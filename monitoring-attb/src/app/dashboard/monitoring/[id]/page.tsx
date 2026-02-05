"use client";

import { useEffect, useState, use, useCallback } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import {
  ArrowLeft,
  MapPin,
  FileText,
  Download,
  Clock,
  AlertCircle,
  Scale,
  Hash,
  Loader2,
  Edit,
  CheckCircle,
  X,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { toast } from "react-hot-toast";

// --- CONSTANTS ---
const ASSET_CATEGORIES = [
  { id: "10100", label: "Tanah & hak atas tanah" },
  { id: "10200", label: "Bangunan & kelengkap" },
  { id: "10300", label: "Bangunan saluran air" },
  { id: "10400", label: "Jalan dan sepur samp" },
  { id: "10500", label: "Instalasi dan mesin" },
  { id: "10510", label: "Ins & Mesin Cina" },
  { id: "10520", label: "Ins & Mesin Non-Cina" },
  { id: "10600", label: "Plngk penyaluran TL" },
  { id: "10700", label: "Gardu Induk" },
  { id: "10800", label: "SUTT" },
  { id: "10900", label: "Kabel di bawah tanah" },
  { id: "11000", label: "Jaringan distribusi" },
  { id: "11010", label: "Penghantar jaringan" },
  { id: "11020", label: "Peralatan jaringan" },
  { id: "11030", label: "Tiang" },
  { id: "11100", label: "Gardu distribusi" },
  { id: "11110", label: "Gardu distribusi" },
  { id: "11120", label: "Fasilitas 20 KV-GI" },
  { id: "11130", label: "Trafo" },
  { id: "11200", label: "Plngk lain2 distribu" },
  { id: "11300", label: "Plngk pgolah data" },
  { id: "11400", label: "Plngk transmisi data" },
  { id: "11450", label: "Teleinformasi Data" },
  { id: "11500", label: "Perlengkapan khusus" },
  { id: "11600", label: "Perlengkapan telekom" },
  { id: "11700", label: "Perlengkapan umum" },
  { id: "11750", label: "Peralatan Kerja" },
  { id: "11800", label: "Kendaraan bermotor &" },
  { id: "11900", label: "Kapal & Prlngkapanya" },
  { id: "40700", label: "Gardu Induk" },
];

const TIMELINE_STEPS = [
  {
    step: 1,
    label: "Inventarisasi (AE-1)",
    desc: "Pencatatan awal & BA Penelitian",
  },
  {
    step: 2,
    label: "Penetapan (AE-2)",
    desc: "Penetapan status aset tidak beroperasi",
  },
  {
    step: 3,
    label: "Usulan Penghapusan (AE-3)",
    desc: "Pengajuan usulan ke manajemen",
  },
  { step: 4, label: "Review SPI (AE-4)", desc: "Audit dan review oleh SPI" },
  {
    step: 5,
    label: "Persetujuan Dekom",
    desc: "Persetujuan Dekomisioning Aset",
  },
  { step: 6, label: "Lelang", desc: "Proses Lelang Aset" },
  { step: 7, label: "Pengangkutan", desc: "Pengangkutan Aset dari Lokasi" },
  {
    step: 8,
    label: "Selesai (SK)",
    desc: "Penerbitan SK Penghapusan & Selesai",
  },
];

// --- INTERFACES (FIXED) ---
// Definisi sederhana untuk menampung plugin autoTable
interface AutoTableDoc {
  lastAutoTable?: { finalY: number };
}

interface AssetDetail {
  id: string;
  no_aset: string;
  jenis_aset: string;
  merk_type: string;
  lokasi: string;
  spesifikasi: string;
  konversi_kg: number;
  rupiah_per_kg: number;
  nilai_buku: number;
  harga_tafsiran: number;
  current_step: number;
  status: string;
  foto_url: string | null;
  created_at: string;
  keterangan: string;
  no_surat_ae1: string;
  no_surat_ae2: string;
  no_attb: string;
  no_surat_ae3: string;
  no_surat_ae4: string;
  no_surat_ae4_date?: string;
  no_surat_sk: string;
}

export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // STATE ROLE ADMIN
  const [isAdmin, setIsAdmin] = useState(false);

  // STATE MODAL
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [processing, setProcessing] = useState(false);

  // FORM STATE
  const [updateForm, setUpdateForm] = useState({ nextStep: 2, noSurat: "" });
  const [editForm, setEditForm] = useState<Partial<AssetDetail>>({});

  const getCategoryLabel = useCallback((code: string | undefined) => {
    if (!code) return "-";
    const cleanCode = String(code).trim();
    const category = ASSET_CATEGORIES.find((cat) => cat.id === cleanCode);
    return category ? category.label : cleanCode;
  }, []);

  const fetchAssetDetail = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("attb_assets")
      .select("*")
      .eq("id", id)
      .single();
    if (error) {
      console.error("Error fetching:", error);
      toast.error("Gagal memuat detail aset");
    } else {
      setAsset(data);
      setUpdateForm({ nextStep: (data.current_step || 0) + 1, noSurat: "" });
      setEditForm(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    // 1. Cek Role User
    const checkUserRole = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const checkAdmin =
          user.email?.includes("admin") || user.user_metadata?.role === "admin";
        setIsAdmin(checkAdmin || false);
      }
    };
    checkUserRole();

    // 2. Fetch Data
    if (id) fetchAssetDetail();
  }, [id, fetchAssetDetail]);

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  const handleUpdateProgress = async () => {
    if (!asset) return;
    if (!updateForm.noSurat)
      return toast.error("Nomor Surat/Dokumen Wajib Diisi!");

    setProcessing(true);
    try {
      const nextStepIndex = updateForm.nextStep;
      const statusLabel =
        TIMELINE_STEPS.find((s) => s.step === nextStepIndex)?.label ||
        `Tahap ${nextStepIndex}`;

      let suratField = "";
      if (nextStepIndex === 2) suratField = "no_surat_ae2";
      else if (nextStepIndex === 3) suratField = "no_surat_ae3";
      else if (nextStepIndex === 4) suratField = "no_surat_ae4";
      else if (nextStepIndex === 8) suratField = "no_surat_sk";

      const updatePayload: Record<string, string | number> = {
        current_step: nextStepIndex,
        status: statusLabel,
      };

      if (suratField) {
        updatePayload[suratField] = updateForm.noSurat;
      }

      const { error } = await supabase
        .from("attb_assets")
        .update(updatePayload)
        .eq("id", asset.id);
      if (error) throw error;

      toast.success(`Berhasil update ke ${statusLabel}`);
      setShowUpdateModal(false);
      fetchAssetDetail();
    } catch (err) {
      console.error(err);
      toast.error("Gagal update progress");
    } finally {
      setProcessing(false);
    }
  };

  const handleEditData = async () => {
    if (!asset) return;
    setProcessing(true);
    try {
      const newBerat = editForm.konversi_kg || 0;
      const newRate = editForm.rupiah_per_kg || 0;
      const newTafsiran = newBerat * newRate;

      const payload = {
        ...editForm,
        harga_tafsiran: newTafsiran,
      };

      const { error } = await supabase
        .from("attb_assets")
        .update(payload)
        .eq("id", asset.id);
      if (error) throw error;

      toast.success("Data aset berhasil diperbarui");
      setShowEditModal(false);
      fetchAssetDetail();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan perubahan");
    } finally {
      setProcessing(false);
    }
  };

  // --- HANDLER DOWNLOAD PDF (FIXED TYPE) ---
  const handleDownloadPDF = () => {
    if (!asset) return;
    setDownloading(true);
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Laporan Detail Aset ATTB", 14, 20);
    doc.setFontSize(10);
    doc.text(`Dicetak pada: ${new Date().toLocaleDateString("id-ID")}`, 14, 26);

    autoTable(doc, {
      startY: 35,
      head: [["Informasi", "Detail"]],
      body: [
        ["No. Aset (SAP)", asset.no_aset],
        ["Jenis Aset", getCategoryLabel(asset.jenis_aset)],
        ["Merk / Type", asset.merk_type],
        ["Lokasi", asset.lokasi],
        [
          "Status Saat Ini",
          TIMELINE_STEPS.find((s) => s.step === asset.current_step)?.label ||
            "-",
        ],
        ["No. Register ATTB", asset.no_attb || "Belum Ada"],
      ],
      theme: "grid",
      headStyles: { fillColor: [0, 162, 233] },
    });

    // FIX: Gunakan interface 'AutoTableDoc' agar aman dari TS dan ESLint
    const finalY = (doc as unknown as AutoTableDoc).lastAutoTable?.finalY || 40;

    autoTable(doc, {
      startY: finalY + 10,
      head: [["Parameter Teknis & Keuangan", "Nilai"]],
      body: [
        ["Spesifikasi", asset.spesifikasi],
        ["Berat Material", `${asset.konversi_kg} Kg`],
        ["Rate Scrap", formatRupiah(asset.rupiah_per_kg)],
        ["Estimasi Harga Tafsiran", formatRupiah(asset.harga_tafsiran)],
        ["Nilai Buku", formatRupiah(asset.nilai_buku)],
        ["Keterangan", asset.keterangan],
      ],
      theme: "grid",
      headStyles: { fillColor: [249, 168, 37] },
    });

    // FIX: Gunakan interface 'AutoTableDoc' lagi
    const finalY2 =
      (doc as unknown as AutoTableDoc).lastAutoTable?.finalY || 40;

    autoTable(doc, {
      startY: finalY2 + 10,
      head: [["Tahapan", "Nomor Surat"]],
      body: [
        ["AE-1 (Inventarisasi)", asset.no_surat_ae1 || "-"],
        ["AE-2 (Penetapan)", asset.no_surat_ae2 || "-"],
        ["AE-3 (Usulan)", asset.no_surat_ae3 || "-"],
        ["AE-4 (Review SPI)", asset.no_surat_ae4 || "-"],
        ["SK Penghapusan", asset.no_surat_sk || "-"],
      ],
      theme: "striped",
    });

    doc.save(`Laporan_ATTB_${asset.no_aset}.pdf`);
    setDownloading(false);
  };

  const handleDelete = async () => {
    if (!asset) return;
    if (!confirm("Yakin ingin menghapus aset ini secara permanen?")) return;

    setProcessing(true);
    try {
      const { error } = await supabase
        .from("attb_assets")
        .delete()
        .eq("id", asset.id);
      if (error) throw error;
      toast.success("Aset berhasil dihapus");
      router.push("/dashboard/monitoring");
    } catch (err) {
      console.error(err);
      // FIX: Cast 'err' sebagai 'Error'
      const message = (err as Error).message || "Gagal menghapus aset";
      toast.error(message);
      setProcessing(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pln-primary"></div>
      </div>
    );
  if (!asset)
    return (
      <div className="flex h-screen items-center justify-center flex-col gap-4">
        <h2 className="text-xl font-bold text-gray-600">
          Aset tidak ditemukan
        </h2>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Kembali
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      <div className="bg-white border-b sticky top-0 z-20 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              {getCategoryLabel(asset.jenis_aset)}
            </h1>
            <div className="flex items-center gap-2 text-sm text-gray-500 font-mono">
              <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                {asset.no_aset}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} /> {asset.lokasi}
              </span>
            </div>
          </div>
        </div>

        {/* --- SECURITY CHECK: HANYA TAMPIL JIKA ADMIN --- */}
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={handleDelete}
              className="p-2 text-red-500 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
              title="Hapus Aset Ini"
            >
              <Trash2 size={20} />
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 shadow-sm transition-all"
            >
              <Edit size={16} /> Edit Data
            </button>
            {asset.current_step < 8 && (
              <button
                onClick={() => setShowUpdateModal(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-pln-primary rounded-lg hover:bg-blue-700 shadow-md transition-all active:scale-95"
              >
                <CheckCircle size={16} /> Update Progres
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative group">
            <div className="relative w-full h-[400px] bg-gray-100 flex items-center justify-center">
              {asset.foto_url ? (
                <Image
                  src={asset.foto_url}
                  alt="Aset"
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                  <AlertCircle size={48} />
                  <p>Tidak ada foto</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <FileText size={20} className="text-pln-primary" /> Spesifikasi &
              Nilai
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Kategori Aset (AT Class)
                </p>
                <p className="text-lg font-bold text-pln-primary">
                  {getCategoryLabel(asset.jenis_aset)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Merk / Type
                </p>
                <p className="text-lg font-medium">{asset.merk_type || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Spesifikasi
                </p>
                <p className="text-gray-700">{asset.spesifikasi || "-"}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Berat Material
                </p>
                <div className="flex items-center gap-2">
                  <Scale size={18} className="text-gray-400" />
                  <span className="text-lg font-bold">
                    {asset.konversi_kg} Kg
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Estimasi Harga Scrap
                </p>
                <p className="text-2xl font-bold text-pln-gold">
                  {formatRupiah(asset.harga_tafsiran || 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Nilai Buku
                </p>
                <p className="text-lg font-bold text-gray-800">
                  {formatRupiah(asset.nilai_buku || 0)}
                </p>
              </div>
              <div className="md:col-span-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <p className="text-xs text-gray-400 uppercase font-bold">
                  Keterangan
                </p>
                <p className="italic text-gray-600">
                  {asset.keterangan || "Tidak ada keterangan."}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Clock className="text-blue-500" /> Tracking Progres
            </h3>
            <div className="relative border-l-2 border-gray-100 ml-3 space-y-8">
              {TIMELINE_STEPS.map((item) => {
                const isCompleted = asset.current_step > item.step;
                const isActive = asset.current_step === item.step;
                let surat = "";
                if (item.step === 1) surat = asset.no_surat_ae1;
                else if (item.step === 2) surat = asset.no_surat_ae2;
                else if (item.step === 3) surat = asset.no_surat_ae3;
                else if (item.step === 4) surat = asset.no_surat_ae4;
                else if (item.step === 8) surat = asset.no_surat_sk;

                return (
                  <div key={item.step} className="relative pl-8">
                    <div
                      className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 ${isCompleted ? "bg-green-500 border-white" : isActive ? "bg-blue-500 border-white animate-pulse" : "bg-gray-200 border-white"}`}
                    ></div>
                    <h4
                      className={`text-sm font-bold ${isCompleted || isActive ? "text-gray-800" : "text-gray-400"}`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-400 mb-1">{item.desc}</p>
                    {surat && (
                      <div className="mt-1 inline-flex items-center gap-1 px-2 py-1 bg-gray-50 border rounded text-xs font-mono text-gray-600">
                        <Hash size={10} /> {surat}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FileText className="text-orange-500" /> Dokumen ATTB
            </h3>
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex justify-between items-center">
              <div>
                <p className="text-xs text-yellow-700 font-bold uppercase">
                  No. Register ATTB
                </p>
                <p className="text-lg font-mono font-bold text-gray-800">
                  {asset.no_attb || "Belum Ada"}
                </p>
              </div>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="p-2 bg-yellow-100 hover:bg-yellow-200 rounded-full text-yellow-700 transition-all active:scale-95 disabled:opacity-50"
              >
                {downloading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Download size={24} />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showUpdateModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setShowUpdateModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Update Tahapan Aset
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Tahap Selanjutnya
                </label>
                <select
                  className="w-full p-2 border rounded-lg bg-gray-50"
                  value={updateForm.nextStep}
                  onChange={(e) =>
                    setUpdateForm({
                      ...updateForm,
                      nextStep: parseInt(e.target.value),
                    })
                  }
                >
                  {TIMELINE_STEPS.map((s) => (
                    <option
                      key={s.step}
                      value={s.step}
                      disabled={s.step <= asset.current_step}
                    >
                      {s.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-1">
                  Nomor Surat Pendukung
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  placeholder="Contoh: 002/BA-PENETAPAN/2026"
                  value={updateForm.noSurat}
                  onChange={(e) =>
                    setUpdateForm({ ...updateForm, noSurat: e.target.value })
                  }
                />
                <p className="text-xs text-gray-400 mt-1">
                  *Nomor surat wajib diisi untuk validasi perpindahan tahap.
                </p>
              </div>
              <button
                onClick={handleUpdateProgress}
                disabled={processing}
                className="w-full bg-pln-primary text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-all flex justify-center gap-2"
              >
                {processing ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Simpan & Lanjutkan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && isAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Edit Data Aset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">
                  Jenis Aset (Kategori)
                </label>
                <select
                  className="w-full p-2 border rounded bg-white"
                  value={editForm.jenis_aset || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, jenis_aset: e.target.value })
                  }
                >
                  <option value="">Pilih Kategori</option>
                  {ASSET_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.id} - {cat.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">
                  Merk / Type
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editForm.merk_type || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, merk_type: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  Lokasi
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={editForm.lokasi || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, lokasi: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  Spesifikasi
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  value={editForm.spesifikasi || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, spesifikasi: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500">
                  Nilai Buku (Rp)
                </label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={editForm.nilai_buku || 0}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      nilai_buku: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-blue-600">
                  Berat (Kg) [Untuk Hitung Scrap]
                </label>
                <input
                  type="number"
                  className="w-full p-2 border border-blue-200 bg-blue-50 rounded"
                  value={editForm.konversi_kg || 0}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      konversi_kg: parseFloat(e.target.value),
                    })
                  }
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-bold text-gray-500">
                  Keterangan
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={2}
                  value={editForm.keterangan || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, keterangan: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleEditData}
                disabled={processing}
                className="px-6 py-2 bg-pln-primary text-white font-bold rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                {processing ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
