"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  Search,
  Loader2,
  Edit,
  CheckSquare,
  ArrowRight,
  FileText,
  Filter,
  CheckCircle,
  Trash2,
  SortAsc,
  MapPin,
} from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import EditAssetModal from "../../../components/EditAssetModal";
import Link from "next/link";

// --- OPSI SORTIR ---
const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru Ditambahkan" },
  { value: "oldest", label: "Terlama Ditambahkan" },
  { value: "a_z", label: "Nama Aset (A-Z)" },
  { value: "z_a", label: "Nama Aset (Z-A)" },
  { value: "sap_asc", label: "No. Aset (0-9)" },
  { value: "sap_desc", label: "No. Aset (9-0)" },
];

// --- DEFINISI TIPE DATA ---
interface AssetData {
  id: string;
  no_aset: string;
  jenis_aset: string;
  merk_type: string;
  spesifikasi: string;
  lokasi: string;
  current_step: number;
  foto_url: string | null;
  jumlah?: number;
  satuan?: string;
  created_at?: string;
  tahun_perolehan?: number;
  nilai_perolehan?: number;
  nilai_buku?: number;
  konversi_kg?: number;
  rupiah_per_kg?: number;
  harga_tafsiran?: number;
  keterangan?: string;
  no_surat_ae1?: string;
  no_surat_ae2?: string;
  no_surat_ae3?: string;
  no_surat_ae4?: string;
  no_surat_sk?: string;
  no_attb?: string;
  [key: string]: string | number | null | undefined;
}

// 1. UPDATE DAFTAR STASIUN (WORKFLOW BARU 8 TAHAP)
const STATIONS = [
  { id: 1, label: "AE-1 (Inventarisasi)", code: "AE-1" },
  { id: 2, label: "AE-2 (Penetapan)", code: "AE-2" },
  { id: 3, label: "AE-3 (Usulan)", code: "AE-3" },
  { id: 4, label: "AE-4 (Review SPI)", code: "AE-4" },
  // Station Baru
  { id: 5, label: "Persetujuan Dekom", code: "DEKOM" },
  { id: 6, label: "Lelang", code: "LELANG" },
  { id: 7, label: "Pengangkutan", code: "ANGKUT" },
  // Station Akhir
  { id: 8, label: "Selesai (Penghapusan)", code: "SELESAI" },
];

export default function ProgressPage() {
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Selection
  const [activeStation, setActiveStation] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("newest");

  // Actions State
  const [isTransitModalOpen, setTransitModalOpen] = useState(false);
  const [batchSurat, setBatchSurat] = useState("");
  const [moving, setMoving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<AssetData | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attb_assets")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching assets:", error);
      toast.error("Gagal memuat data aset.");
    } else {
      setAssets((data as AssetData[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- FILTERING & SORTING ---
  const getFilteredAndSortedAssets = () => {
    const filtered = assets.filter((asset) => {
      if (asset.current_step !== activeStation) return false;
      const lowerSearch = searchTerm.toLowerCase();
      return (
        (asset.jenis_aset || "").toLowerCase().includes(lowerSearch) ||
        (asset.no_aset || "").toLowerCase().includes(lowerSearch) ||
        (asset.lokasi || "").toLowerCase().includes(lowerSearch) ||
        (asset.no_surat_ae1 || "").toLowerCase().includes(lowerSearch) ||
        (asset.no_surat_ae2 || "").toLowerCase().includes(lowerSearch) ||
        (asset.no_attb || "").toLowerCase().includes(lowerSearch)
      );
    });

    return filtered.sort((a, b) => {
      switch (sortOption) {
        case "a_z":
          return (a.jenis_aset || "").localeCompare(b.jenis_aset || "");
        case "z_a":
          return (b.jenis_aset || "").localeCompare(a.jenis_aset || "");
        case "sap_asc":
          return (a.no_aset || "").localeCompare(b.no_aset || "");
        case "sap_desc":
          return (b.no_aset || "").localeCompare(a.no_aset || "");
        case "oldest":
          return (
            new Date(a.created_at || 0).getTime() -
            new Date(b.created_at || 0).getTime()
          );
        case "newest":
        default:
          return (
            new Date(b.created_at || 0).getTime() -
            new Date(a.created_at || 0).getTime()
          );
      }
    });
  };

  const filteredAssets = getFilteredAndSortedAssets();

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAssets.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filteredAssets.map((a) => a.id)));
  };

  const handleBatchDelete = async () => {
    if (selectedIds.size === 0) return;
    const isConfirmed = window.confirm(
      `PERINGATAN: Hapus ${selectedIds.size} aset terpilih?`,
    );
    if (!isConfirmed) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("attb_assets")
        .delete()
        .in("id", Array.from(selectedIds));
      if (error) throw error;
      toast.success(`Berhasil menghapus ${selectedIds.size} aset.`);
      setSelectedIds(new Set());
      fetchData();
    } catch (err) {
      // FIX 1: Gunakan variable err untuk logging
      console.error("Delete Error:", err);
      toast.error("Gagal menghapus aset.");
    } finally {
      setDeleting(false);
    }
  };

  // --- BATCH TRANSIT (LOGIKA BARU) ---
  const handleBatchTransit = async () => {
    const nextStep = activeStation + 1;

    // Cek apakah step selanjutnya perlu surat?
    // Step 5, 6, 7 (Dekom, Lelang, Angkut) TIDAK perlu surat
    const needsSurat = nextStep <= 4 || nextStep === 8;

    if (needsSurat && !batchSurat.trim()) {
      toast.error("Mohon isi Nomor Surat Tujuan!", {
        style: {
          border: "1px solid #EAB308",
          color: "#854D0E",
          background: "#FEF9C3",
        },
      });
      return;
    }

    const selectedAssetsData = assets.filter((a) => selectedIds.has(a.id));
    const incompleteAssets = selectedAssetsData.filter((asset) => {
      const basicValidation =
        !asset.foto_url ||
        (asset.konversi_kg || 0) <= 0 ||
        (asset.rupiah_per_kg || 0) <= 0;
      let suratValidation = false;
      if (activeStation === 2) {
        const ae2Missing = !asset.no_surat_ae2 || asset.no_surat_ae2 === "-";
        const attbMissing = !asset.no_attb || asset.no_attb === "-";
        if (ae2Missing || attbMissing) suratValidation = true;
      }
      return basicValidation || suratValidation;
    });

    if (incompleteAssets.length > 0) {
      toast.error(
        `Gagal! ${incompleteAssets.length} Aset belum lengkap (Foto/Data).`,
        {
          duration: 4000,
          style: { maxWidth: "500px", fontWeight: "bold" },
        },
      );
      return;
    }

    setMoving(true);
    try {
      const updatePayload: Record<string, string | number> = {
        current_step: nextStep,
        status:
          STATIONS.find((s) => s.id === nextStep)?.label || `Tahap ${nextStep}`,
      };

      // Hanya update kolom surat jika diperlukan
      if (nextStep <= 4) {
        updatePayload[`no_surat_ae${nextStep}`] = batchSurat;
      } else if (nextStep === 8) {
        updatePayload["no_surat_sk"] = batchSurat;
      }

      const { error } = await supabase
        .from("attb_assets")
        .update(updatePayload)
        .in("id", Array.from(selectedIds));
      if (error) throw error;

      toast.success(
        `Sukses! ${selectedIds.size} aset dipindahkan ke ${STATIONS.find((s) => s.id === nextStep)?.code}.`,
      );
      setTransitModalOpen(false);
      setBatchSurat("");
      setSelectedIds(new Set());
      fetchData();
    } catch (err) {
      // FIX 2: Gunakan variable err untuk logging
      console.error("Transit Error:", err);
      toast.error("Gagal memindahkan aset.");
    } finally {
      setMoving(false);
    }
  };

  const openEditModal = (asset: AssetData) => {
    setEditingAsset(asset);
    setEditModalOpen(true);
  };

  // Helper boolean untuk UI Modal
  const nextStepIsIntermediate =
    activeStation + 1 >= 5 && activeStation + 1 <= 7;

  return (
    <div className="space-y-6 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <h1 className="text-2xl font-bold text-pln-primary">
            Progress Aset (Tracking)
          </h1>
          <p className="text-gray-500 text-sm">
            Monitor pergerakan aset dari AE-1 hingga Penghapusan.
          </p>
        </div>
        {/* SEARCH & SORT */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <SortAsc size={18} />
            </div>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg outline-none text-sm bg-white cursor-pointer w-full sm:w-48"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Cari aset atau no. surat..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none text-sm"
            />
          </div>
        </div>
      </div>

      {/* TABS (SCROLLABLE) */}
      <div className="flex overflow-x-auto gap-2 pb-2 border-b border-gray-200 no-scrollbar">
        {STATIONS.map((station) => {
          const count = assets.filter(
            (a) => a.current_step === station.id,
          ).length;
          const isActive = activeStation === station.id;
          return (
            <button
              key={station.id}
              onClick={() => {
                setActiveStation(station.id);
                setSelectedIds(new Set());
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-t-lg font-bold text-sm whitespace-nowrap transition-all border-b-2 ${isActive ? "border-pln-primary text-pln-primary bg-blue-50/50" : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
            >
              <span
                className={`w-2.5 h-2.5 rounded-full ${isActive ? "bg-pln-primary" : "bg-gray-300"}`}
              />
              {station.label}
              {count > 0 && (
                <span
                  className={`ml-1 px-2 py-0.5 rounded-full text-xs ${isActive ? "bg-pln-primary text-white" : "bg-gray-200 text-gray-600"}`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ACTION BAR */}
      {selectedIds.size > 0 && (
        <div className="sticky top-4 z-20 bg-white border border-blue-200 p-4 rounded-xl shadow-lg flex flex-col sm:flex-row justify-between items-center gap-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
              <CheckSquare size={20} />
            </div>
            <div>
              <p className="font-bold text-gray-800">
                {selectedIds.size} Aset Dipilih
              </p>
              <p className="text-xs text-gray-500">
                Pilih tindakan untuk aset ini.
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBatchDelete}
              disabled={deleting || moving}
              className="bg-red-50 text-red-600 border border-red-200 px-4 py-2.5 rounded-lg font-bold shadow-sm hover:bg-red-100 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {deleting ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Trash2 size={18} />
              )}{" "}
              <span className="hidden sm:inline">
                Hapus ({selectedIds.size})
              </span>
            </button>
            {activeStation < 8 && (
              <button
                onClick={() => setTransitModalOpen(true)}
                disabled={deleting || moving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold shadow-md hover:bg-blue-700 flex items-center gap-2 active:scale-95 disabled:opacity-50"
              >
                Proses ke{" "}
                {STATIONS.find((s) => s.id === activeStation + 1)?.code}{" "}
                <ArrowRight size={18} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* CONTENT GRID */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="text-sm">Memuat data aset...</p>
        </div>
      ) : filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
            <Filter size={32} />
          </div>
          <h3 className="font-bold text-gray-600">
            Tidak ada aset di stasiun ini
          </h3>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2 px-1">
            <input
              type="checkbox"
              id="selectAll"
              checked={
                selectedIds.size === filteredAssets.length &&
                filteredAssets.length > 0
              }
              onChange={toggleSelectAll}
              className="w-4 h-4 text-pln-primary rounded cursor-pointer accent-pln-primary"
            />
            <label
              htmlFor="selectAll"
              className="text-sm font-bold text-gray-600 cursor-pointer"
            >
              Pilih Semua ({filteredAssets.length})
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-2">
            {filteredAssets.map((asset) => (
              <div
                key={asset.id}
                className={`bg-white border rounded-xl p-4 shadow-sm hover:shadow-md transition-all relative group ${selectedIds.has(asset.id) ? "ring-2 ring-blue-500 bg-blue-50/30 border-blue-200" : "border-gray-200"}`}
              >
                <div className="absolute top-3 right-3 z-10">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(asset.id)}
                    onChange={() => toggleSelect(asset.id)}
                    className="w-5 h-5 cursor-pointer accent-blue-600"
                  />
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200 relative">
                    {asset.foto_url ? (
                      <Image
                        src={asset.foto_url}
                        alt="Aset"
                        fill
                        sizes="64px"
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                        <FileText size={20} />
                        <span className="text-[8px] mt-1">No Img</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center gap-2 mb-1">
                      <Link
                        href={`/dashboard/monitoring/${asset.id}`}
                        className="text-[10px] font-mono font-bold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 rounded hover:bg-blue-100 hover:underline cursor-pointer"
                      >
                        {asset.no_aset}
                      </Link>
                    </div>
                    <h4
                      className="font-bold text-sm text-gray-800 line-clamp-2 leading-snug mb-1"
                      title={asset.jenis_aset}
                    >
                      {asset.jenis_aset}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      {asset.merk_type || "Tanpa Merk"}
                    </p>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 flex items-start gap-1">
                  <MapPin size={14} className="text-red-500 shrink-0 mt-0.5" />
                  <span className="line-clamp-1">{asset.lokasi || "-"}</span>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 text-xs flex justify-between items-center text-gray-500">
                  <span>Surat saat ini:</span>
                  <span
                    className="font-mono font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded max-w-[120px] truncate"
                    title={
                      activeStation === 1
                        ? asset.no_surat_ae1
                        : activeStation === 2
                          ? asset.no_surat_ae2
                          : activeStation === 3
                            ? asset.no_surat_ae3
                            : activeStation === 4
                              ? asset.no_surat_ae4
                              : activeStation === 8
                                ? asset.no_surat_sk
                                : "-"
                    }
                  >
                    {activeStation === 1
                      ? asset.no_surat_ae1
                      : activeStation === 2
                        ? asset.no_surat_ae2
                        : activeStation === 3
                          ? asset.no_surat_ae3
                          : activeStation === 4
                            ? asset.no_surat_ae4
                            : activeStation === 8
                              ? asset.no_surat_sk
                              : "-"}
                  </span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => openEditModal(asset)}
                    className="flex-1 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded border border-blue-100 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Edit size={12} /> Edit Data
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- MODAL TRANSIT --- */}
      {isTransitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border-t-4 border-pln-primary">
            <h3 className="font-bold text-lg text-gray-800 mb-2">
              Proses Pindah Tahap
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Memindahkan <strong>{selectedIds.size} aset</strong> ke{" "}
              <strong>
                {STATIONS.find((s) => s.id === activeStation + 1)?.code}
              </strong>
              .
            </p>

            {/* Input Surat hanya muncul jika BUKAN tahap intermediate (5,6,7) */}
            {!nextStepIsIntermediate && (
              <input
                type="text"
                value={batchSurat}
                onChange={(e) => setBatchSurat(e.target.value)}
                placeholder={`Contoh No. Surat Tujuan...`}
                className="w-full p-3 border rounded-lg mb-4"
              />
            )}

            {nextStepIsIntermediate && (
              <div className="bg-blue-50 text-blue-700 p-3 rounded-lg mb-4 text-xs">
                Tahap ini tidak memerlukan input nomor surat. Klik Konfirmasi
                untuk lanjut.
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setTransitModalOpen(false)}
                className="px-4 py-2 text-gray-600 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleBatchTransit}
                disabled={moving || (!batchSurat && !nextStepIsIntermediate)}
                className="px-6 py-2 bg-pln-primary text-white rounded-lg flex items-center gap-2"
              >
                {moving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  <CheckCircle size={16} />
                )}{" "}
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}

      <EditAssetModal
        asset={{
          ...editingAsset!, // Force unwrap karena kita tahu modal hanya muncul jika editingAsset ada
          no_surat_ae1: editingAsset?.no_surat_ae1 ?? "",
          no_surat_ae2: editingAsset?.no_surat_ae2 ?? "",
          no_surat_ae3: editingAsset?.no_surat_ae3 ?? "",
          no_surat_ae4: editingAsset?.no_surat_ae4 ?? "",
          no_surat_sk: editingAsset?.no_surat_sk ?? "",
          no_attb: editingAsset?.no_attb ?? "",
        }}
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSuccess={() => {
          fetchData();
          setEditModalOpen(false);
        }}
      />
    </div>
  );
}
