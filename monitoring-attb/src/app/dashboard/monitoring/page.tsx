"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Download,
  Loader2,
  RefreshCw,
  Filter,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { toast } from "react-hot-toast";
import * as XLSX from "xlsx";
import Link from "next/link";

// --- INTERFACES ---
interface Asset {
  id: string;
  no_aset: string;
  jenis_aset: string;
  merk_type: string;
  lokasi: string;
  current_step: number;
  status: string;
  nilai_buku: number;
  harga_tafsiran: number;
  konversi_kg: number;
  no_surat_ae1: string;
  no_surat_ae2: string;
  no_surat_ae3: string;
  no_surat_ae4: string;
  no_surat_sk: string;
  no_attb: string;
  keterangan: string;
  created_at: string;
  persetujuan_dekom?: string;
  lelang?: string;
  pengangkutan?: string;
  selesai?: string;
  [key: string]: string | number | null | undefined;
}

// REFERENSI KATEGORI (MAP: KODE -> LABEL)
const ASSET_CATEGORY_MAP: Record<string, string> = {
  "10100": "Tanah & hak atas tanah",
  "10200": "Bangunan & kelengkap",
  "10300": "Bangunan saluran air",
  "10400": "Jalan dan sepur samp",
  "10500": "Instalasi dan mesin",
  "10510": "Ins & Mesin Cina",
  "10520": "Ins & Mesin Non-Cina",
  "10600": "Plngk penyaluran TL",
  "10700": "Gardu Induk",
  "10800": "SUTT",
  "10900": "Kabel di bawah tanah",
  "11000": "Jaringan distribusi",
  "11010": "Penghantar jaringan",
  "11020": "Peralatan jaringan",
  "11030": "Tiang",
  "11100": "Gardu distribusi",
  "11110": "Gardu distribusi",
  "11120": "Fasilitas 20 KV-GI",
  "11130": "Trafo",
  "11200": "Plngk lain2 distribu",
  "11300": "Plngk pgolah data",
  "11400": "Plngk transmisi data",
  "11450": "Teleinformasi Data",
  "11500": "Perlengkapan khusus",
  "11600": "Perlengkapan telekom",
  "11700": "Perlengkapan umum",
  "11750": "Peralatan Kerja",
  "11800": "Kendaraan bermotor &",
  "11900": "Kapal & Prlngkapanya",
  "40700": "Gardu Induk",
};

const getStatusLabel = (step: number) => {
  if (step === 8) return "Selesai";
  if (step === 5) return "Persetujuan Dekom";
  if (step === 6) return "Lelang";
  if (step === 7) return "Pengangkutan";
  return `AE-${step}`;
};

export default function MonitoringTablePage() {
  const [data, setData] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);

  // Sorting & Filtering State
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Asset;
    direction: "asc" | "desc";
  } | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>(
    {},
  );
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // FETCH DATA
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: assets, error } = await supabase
        .from("attb_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      // --- MAPPING DATA (FIX: TERJEMAHKAN KODE KE LABEL) ---
      const mappedData: Asset[] = (assets || []).map((item: Asset) => {
        const cleanJenis = String(item.jenis_aset || "").trim(); // Hapus spasi

        return {
          ...item,
          // Jika kode ada di MAP, pakai Label-nya. Jika tidak, pakai kodenya.
          jenis_aset: ASSET_CATEGORY_MAP[cleanJenis] || cleanJenis,
          status_text: getStatusLabel(item.current_step),
        };
      });

      setData(mappedData);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // LOGIKA PROCESS DATA
  const processData = () => {
    let result = [...data];

    // Filter
    Object.keys(columnFilters).forEach((key) => {
      const selectedValues = columnFilters[key];
      if (selectedValues && selectedValues.length > 0) {
        result = result.filter((item) => {
          if (key === "current_step") {
            const statusLabel = getStatusLabel(item.current_step);
            return selectedValues.includes(statusLabel);
          }
          const itemValue = String(item[key] || "").trim();
          return selectedValues.includes(itemValue);
        });
      }
    });

    // Sort
    if (sortConfig) {
      const { key, direction } = sortConfig;
      result.sort((a, b) => {
        let valA = a[key];
        let valB = b[key];
        if (key === "status") {
          valA = a.current_step;
          valB = b.current_step;
        }
        if (typeof valA === "string") valA = valA.toLowerCase();
        if (typeof valB === "string") valB = valB.toLowerCase();
        const safeValA = valA ?? "";
        const safeValB = valB ?? "";
        if (safeValA < safeValB) return direction === "asc" ? -1 : 1;
        if (safeValA > safeValB) return direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    return result;
  };

  const finalData = processData();

  // Hitung Total
  const totalEndAcqValue = finalData.reduce(
    (sum, item) => sum + (Number(item.nilai_buku) || 0),
    0,
  );

  // Handlers
  const handleSort = (key: keyof Asset, direction: "asc" | "desc") => {
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (
    columnKey: string,
    value: string,
    isChecked: boolean,
  ) => {
    setColumnFilters((prev) => {
      const currentSelected = prev[columnKey] || [];
      if (isChecked) {
        return { ...prev, [columnKey]: [...currentSelected, value] };
      } else {
        return {
          ...prev,
          [columnKey]: currentSelected.filter((v) => v !== value),
        };
      }
    });
  };

  const handleSelectAll = (columnKey: string) => {
    const newFilters = { ...columnFilters };
    delete newFilters[columnKey];
    setColumnFilters(newFilters);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const handleDownloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(finalData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data_Aset");
    XLSX.writeFile(
      workbook,
      `Monitoring_Aset_${new Date().toISOString()}.xlsx`,
    );
  };

  // --- COMPONENT HEADER (FIXED INTERACTIVITY) ---
  const ColumnHeader = ({
    label,
    field,
    width,
    isStatus = false,
    className = "bg-gray-50",
  }: {
    label: string;
    field: keyof Asset | "status_text";
    width?: string;
    isStatus?: boolean;
    className?: string;
  }) => {
    const uniqueValues = Array.from(
      new Set(
        data.map((item) => {
          if (isStatus) return getStatusLabel(item.current_step);
          return String(item[field] || "").trim();
        }),
      ),
    )
      .filter((v) => v !== "")
      .sort();

    const stateKey = isStatus ? "current_step" : (field as string);
    const activeFilter = columnFilters[stateKey];
    const isAllSelected = activeFilter === undefined; // Undefined = Select All
    const isOpen = activeDropdown === field;

    return (
      <th
        className={`p-4 border-b border-r border-gray-200 relative group select-none ${className}`}
        style={{ width }}
      >
        {/* Klik Header untuk buka/tutup Dropdown */}
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            setActiveDropdown(isOpen ? null : (field as string));
          }}
        >
          <span className="font-bold text-gray-700 text-sm hover:text-pln-primary transition-colors">
            {label}
          </span>
          <button
            className={`p-1 rounded hover:bg-black/10 transition-colors ${activeFilter ? "text-pln-primary font-bold" : "text-gray-400"}`}
          >
            <Filter size={14} fill={activeFilter ? "currentColor" : "none"} />
          </button>
        </div>

        {/* DROPDOWN MENU */}
        {isOpen && (
          <div
            // FIX PENTING: stopPropagation agar klik di dalam TIDAK menutup dropdown
            onClick={(e) => e.stopPropagation()}
            className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-300 shadow-xl rounded-md z-50 text-left font-normal animate-in fade-in zoom-in-95 duration-100"
          >
            {/* Sort Section */}
            <div className="p-2 border-b border-gray-100">
              <button
                onClick={() => handleSort(field as keyof Asset, "asc")}
                className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 text-gray-700 text-sm rounded transition-colors"
              >
                <ArrowUp size={16} className="text-gray-500" /> Sort A to Z
              </button>
              <button
                onClick={() => handleSort(field as keyof Asset, "desc")}
                className="flex items-center gap-3 w-full px-2 py-2 hover:bg-gray-100 text-gray-700 text-sm rounded transition-colors"
              >
                <ArrowDown size={16} className="text-gray-500" /> Sort Z to A
              </button>
            </div>

            {/* Filter Section */}
            <div className="p-2">
              <div className="flex items-center gap-2 mb-2 px-2 py-1 bg-gray-50 border rounded">
                <Search size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent outline-none text-xs w-full"
                />
              </div>

              <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                {/* Select All */}
                <label className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer w-full select-none transition-colors">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={() => handleSelectAll(stateKey)}
                    className="rounded text-pln-primary focus:ring-0 cursor-pointer"
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    (Select All)
                  </span>
                </label>

                {uniqueValues.map((val, idx) => {
                  const isChecked =
                    isAllSelected || activeFilter?.includes(val);
                  // Tooltip: Val sudah berupa Label (misal: Trafo), jadi tidak perlu map ulang
                  const tooltipText = val;

                  return (
                    <label
                      key={idx}
                      title={tooltipText}
                      className="flex items-center gap-2 px-2 py-1.5 hover:bg-blue-50 rounded cursor-pointer w-full select-none transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          if (isAllSelected) {
                            const newVal = uniqueValues.filter(
                              (v) => v !== val,
                            );
                            setColumnFilters((prev) => ({
                              ...prev,
                              [stateKey]: newVal,
                            }));
                          } else {
                            handleFilterChange(stateKey, val, e.target.checked);
                          }
                        }}
                        className="rounded text-pln-primary focus:ring-0 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700 truncate">
                        {val}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-100 flex justify-between bg-gray-50 rounded-b-md">
              <button
                onClick={() => {
                  handleSelectAll(stateKey);
                  setActiveDropdown(null);
                }}
                className="text-xs font-bold text-gray-500 hover:text-gray-800"
              >
                Clear
              </button>
              <button
                onClick={() => setActiveDropdown(null)}
                className="text-xs font-bold text-pln-primary hover:text-blue-700"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </th>
    );
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  const SimpleSortHeader = ({
    label,
    field,
    className,
    width,
  }: {
    label: string;
    field: keyof Asset;
    className?: string;
    width?: string;
  }) => (
    <th
      className={`p-4 border-b border-r border-gray-200 cursor-pointer hover:bg-gray-200 transition-colors ${className}`}
      style={{ width }}
      onClick={() =>
        handleSort(field, sortConfig?.direction === "asc" ? "desc" : "asc")
      }
    >
      <div className="flex items-center justify-between gap-1">
        {label}
        {sortConfig?.key === field ? (
          sortConfig.direction === "asc" ? (
            <ArrowUp size={14} />
          ) : (
            <ArrowDown size={14} />
          )
        ) : (
          <ArrowDown size={14} className="text-gray-300" />
        )}
      </div>
    </th>
  );

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col space-y-4">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-pln-primary">
            Monitoring Data Master
          </h1>
          <p className="text-gray-500 text-sm">
            Gunakan filter pada header kolom untuk menyaring data.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchData}
            className="p-3 text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
          </button>
          <button
            onClick={handleDownloadExcel}
            className="flex items-center gap-2 text-sm font-bold text-white bg-green-600 px-6 py-3 rounded-xl shadow-md hover:bg-green-700 transition-all active:scale-95"
          >
            <Download size={18} /> Download Excel
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="flex-1 overflow-auto border border-gray-200 rounded-xl shadow-sm bg-white relative custom-scrollbar pb-20">
        {loading ? (
          <div className="flex items-center justify-center h-full flex-col gap-3">
            <Loader2 className="animate-spin text-pln-primary" size={48} />
            <p className="text-gray-400 font-medium">Memuat data tabel...</p>
          </div>
        ) : (
          <table className="min-w-[4500px] w-full text-sm text-left border-collapse">
            <thead className="bg-gray-100 text-gray-700 font-bold sticky top-0 z-20 shadow-sm uppercase text-xs tracking-wider">
              <tr>
                <th className="p-4 border-b w-16 text-center sticky left-0 z-30 bg-gray-100 border-r border-gray-200">
                  No
                </th>
                <th
                  className="p-4 border-b w-40 sticky left-16 z-30 bg-gray-100 border-r border-gray-200 cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    handleSort(
                      "no_aset",
                      sortConfig?.direction === "asc" ? "desc" : "asc",
                    )
                  }
                >
                  <div className="flex justify-between items-center">
                    No. Aset
                    {sortConfig?.key === "no_aset" &&
                      (sortConfig.direction === "asc" ? (
                        <ArrowUp size={14} />
                      ) : (
                        <ArrowDown size={14} />
                      ))}
                  </div>
                </th>

                <ColumnHeader
                  label="No. ATTB"
                  field="no_attb"
                  width="200px"
                  className="bg-cyan-50/50"
                />
                <ColumnHeader
                  label="Kategori Aset (AT Class)"
                  field="jenis_aset"
                  width="250px"
                />
                <SimpleSortHeader
                  label="Merk / Type"
                  field="merk_type"
                  width="220px"
                />
                <ColumnHeader label="Lokasi" field="lokasi" width="200px" />
                <ColumnHeader
                  label="Status"
                  field="status_text"
                  width="150px"
                  isStatus
                />

                <SimpleSortHeader
                  label="End Acq Value"
                  field="nilai_buku"
                  width="160px"
                  className="text-right bg-emerald-50/30"
                />
                <SimpleSortHeader
                  label="Nilai Tafsiran"
                  field="harga_tafsiran"
                  width="160px"
                  className="text-right"
                />
                <SimpleSortHeader
                  label="Berat (Kg)"
                  field="konversi_kg"
                  width="120px"
                  className="text-center"
                />

                <ColumnHeader
                  label="No. Surat AE-1"
                  field="no_surat_ae1"
                  width="200px"
                  className="bg-blue-50/50"
                />
                <ColumnHeader
                  label="No. Surat AE-2"
                  field="no_surat_ae2"
                  width="200px"
                  className="bg-purple-50/50"
                />
                <ColumnHeader
                  label="No. Surat AE-3"
                  field="no_surat_ae3"
                  width="200px"
                  className="bg-yellow-50/50"
                />
                <ColumnHeader
                  label="No. Surat AE-4"
                  field="no_surat_ae4"
                  width="200px"
                  className="bg-orange-50/50"
                />
                <ColumnHeader
                  label="No. Surat SK"
                  field="no_surat_sk"
                  width="200px"
                  className="bg-green-50/50"
                />

                <ColumnHeader
                  label="Persetujuan Dekom"
                  field="persetujuan_dekom"
                  width="200px"
                  className="bg-gray-50"
                />
                <ColumnHeader
                  label="Lelang"
                  field="lelang"
                  width="200px"
                  className="bg-gray-50"
                />
                <ColumnHeader
                  label="Pengangkutan"
                  field="pengangkutan"
                  width="200px"
                  className="bg-gray-50"
                />
                <ColumnHeader
                  label="Selesai"
                  field="selesai"
                  width="200px"
                  className="bg-gray-50"
                />

                <th className="p-4 border-b min-w-[300px]">Keterangan</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {finalData.map((item, i) => (
                <tr
                  key={item.id}
                  className="hover:bg-blue-50/30 transition-colors group"
                >
                  <td className="p-4 text-center text-gray-500 font-medium sticky left-0 z-10 bg-white group-hover:bg-blue-50/30 border-r border-gray-100">
                    {i + 1}
                  </td>
                  <td className="p-4 font-mono font-bold text-pln-primary sticky left-16 z-10 bg-white group-hover:bg-blue-50/30 border-r border-gray-100">
                    <Link
                      href={`/dashboard/monitoring/${item.id}`}
                      className="bg-blue-50 px-2 py-1 rounded border border-blue-100 hover:bg-blue-600 hover:text-white transition-colors cursor-pointer inline-block"
                    >
                      {item.no_aset}
                    </Link>
                  </td>
                  <td className="p-4 text-xs font-mono text-cyan-700 font-bold bg-cyan-50/10 border-x border-gray-100">
                    {item.no_attb || "-"}
                  </td>

                  {/* KOLOM KATEGORI (SUDAH JADI TEXT) */}
                  <td className="p-4 font-medium text-gray-800 text-base">
                    {item.jenis_aset}
                  </td>

                  <td className="p-4 text-gray-600">{item.merk_type}</td>
                  <td className="p-4 text-gray-600 flex items-center gap-1">
                    📍 {item.lokasi}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border shadow-sm whitespace-nowrap ${
                        item.current_step === 1
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : item.current_step === 2
                            ? "bg-purple-100 text-purple-700 border-purple-200"
                            : item.current_step === 3
                              ? "bg-yellow-100 text-yellow-700 border-yellow-200"
                              : item.current_step === 4
                                ? "bg-orange-100 text-orange-700 border-orange-200"
                                : "bg-green-100 text-green-700 border-green-200"
                      }`}
                    >
                      {getStatusLabel(item.current_step)}
                    </span>
                  </td>
                  <td className="p-4 text-right font-mono text-gray-700 font-semibold bg-emerald-50/10">
                    {formatRupiah(item.nilai_buku || 0)}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-pln-gold text-base">
                    {formatRupiah(item.harga_tafsiran || 0)}
                  </td>
                  <td className="p-4 text-center text-gray-600 font-medium">
                    {item.konversi_kg} kg
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-600 bg-blue-50/10 border-l border-gray-50">
                    {item.no_surat_ae1 || "-"}
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-600 bg-purple-50/10 border-l border-gray-50">
                    {item.no_surat_ae2 || "-"}
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-600 bg-yellow-50/10 border-l border-gray-50">
                    {item.no_surat_ae3 || "-"}
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-600 bg-orange-50/10 border-l border-gray-50">
                    {item.no_surat_ae4 || "-"}
                  </td>
                  <td className="p-4 text-xs font-mono text-gray-600 bg-green-50/10 border-l border-gray-50">
                    {item.no_surat_sk || "-"}
                  </td>

                  <td className="p-4 text-gray-600">
                    {item.persetujuan_dekom || "-"}
                  </td>
                  <td className="p-4 text-gray-600">{item.lelang || "-"}</td>
                  <td className="p-4 text-gray-600">
                    {item.pengangkutan || "-"}
                  </td>
                  <td className="p-4 text-gray-600">{item.selesai || "-"}</td>
                  <td className="p-4 text-gray-500 text-sm italic max-w-[300px] truncate">
                    {item.keterangan || "-"}
                  </td>
                </tr>
              ))}
              {finalData.length === 0 && (
                <tr>
                  <td
                    colSpan={20}
                    className="p-12 text-center text-gray-400 bg-gray-50 italic border-t border-gray-100"
                  >
                    <p className="text-lg font-medium mb-1">
                      Data tidak ditemukan
                    </p>
                    <p className="text-sm">Coba atur ulang filter Anda.</p>
                  </td>
                </tr>
              )}
            </tbody>
            {finalData.length > 0 && (
              <tfoot className="bg-gray-100 font-bold text-gray-800 border-t-2 border-gray-300">
                <tr>
                  <td className="p-4 text-center sticky left-0 bg-gray-100 z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    TOTAL
                  </td>
                  <td className="p-4 sticky left-16 bg-gray-100 z-10 border-r border-gray-300 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]"></td>
                  <td className="p-4 bg-gray-100 border-r border-gray-200"></td>
                  <td className="p-4 bg-gray-100 border-r border-gray-200"></td>
                  <td className="p-4 bg-gray-100 border-r border-gray-200"></td>
                  <td className="p-4 bg-gray-100 border-r border-gray-200"></td>
                  <td className="p-4 bg-gray-100 border-r border-gray-200 text-right text-gray-500 uppercase text-xs tracking-wider">
                    Grand Total:
                  </td>
                  <td className="p-4 text-right font-mono text-lg text-emerald-700 bg-emerald-100/50 border-x border-emerald-300 shadow-inner">
                    {formatRupiah(totalEndAcqValue)}
                  </td>
                  <td className="p-4 bg-gray-100" colSpan={12}></td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  );
}
