"use client";

import { useState, useEffect } from "react";
import {
  X,
  Save,
  FileText,
  AlertCircle,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";
import Image from "next/image";

interface Asset {
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

  // Dokumen Surat
  no_surat_ae1?: string;
  no_surat_ae2?: string;
  no_surat_ae3?: string;
  no_surat_ae4?: string;
  no_surat_sk?: string;

  // PELENGKAP
  no_attb?: string;

  [key: string]: string | number | null | undefined;
}

interface EditModalProps {
  asset: Asset;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditAssetModal({
  asset,
  isOpen,
  onClose,
  onSuccess,
}: EditModalProps) {
  const [loading, setLoading] = useState(false);

  // State untuk Foto
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    merk_type: "",
    spesifikasi: "",
    no_surat_ae1: "",
    no_surat_ae2: "",
    no_surat_ae3: "",
    no_surat_ae4: "",
    no_surat_sk: "",
    no_attb: "",
    berat_kg: 0,
    rate_scrap: 0,
  });

  // Load data saat modal dibuka
  useEffect(() => {
    if (asset) {
      setFormData({
        merk_type: asset.merk_type || "",
        spesifikasi: asset.spesifikasi || "",
        no_surat_ae1: asset.no_surat_ae1 || "",
        no_surat_ae2: asset.no_surat_ae2 || "",
        no_surat_ae3: asset.no_surat_ae3 || "",
        no_surat_ae4: asset.no_surat_ae4 || "",
        no_surat_sk: asset.no_surat_sk || "",

        no_attb: asset.no_attb || "",
        berat_kg: asset.konversi_kg || 0,
        rate_scrap: asset.rupiah_per_kg || 0,
      });
      setPreviewUrl(asset.foto_url || null);
      setSelectedFile(null);
    }
  }, [asset, isOpen]);

  if (!isOpen || !asset) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Ukuran file maksimal 5MB");
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let finalFotoUrl = asset.foto_url;

      if (selectedFile) {
        const cleanNoAset = (asset.no_aset || "tanpa_nomor").replace(
          /[^a-zA-Z0-9]/g,
          "_",
        );
        const fileExt = selectedFile.name.split(".").pop();
        const fileName = `foto_${cleanNoAset}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("attb-photos")
          .upload(filePath, selectedFile, {
            cacheControl: "3600",
            upsert: true,
          });

        if (uploadError)
          throw new Error("Gagal upload foto: " + uploadError.message);

        const { data: publicUrlData } = supabase.storage
          .from("attb-photos")
          .getPublicUrl(filePath);

        finalFotoUrl = publicUrlData.publicUrl;
      }

      const estimasi_harga = formData.berat_kg * formData.rate_scrap;

      const { error } = await supabase
        .from("attb_assets")
        .update({
          merk_type: formData.merk_type,
          spesifikasi: formData.spesifikasi,

          no_surat_ae1: formData.no_surat_ae1,
          no_surat_ae2: formData.no_surat_ae2,
          no_surat_ae3: formData.no_surat_ae3,
          no_surat_ae4: formData.no_surat_ae4,
          no_surat_sk: formData.no_surat_sk,
          no_attb: formData.no_attb,

          konversi_kg: formData.berat_kg,
          rupiah_per_kg: formData.rate_scrap,
          harga_tafsiran: estimasi_harga,
          foto_url: finalFotoUrl,
        })
        .eq("id", asset.id);

      if (error) throw error;

      toast.success("Data aset berhasil diperbarui!");
      onSuccess();
      onClose();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Terjadi kesalahan saat menyimpan.";
      console.error("Error Full:", error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-8 animate-in fade-in zoom-in duration-300">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/50 rounded-t-xl">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <div className="p-1.5 bg-pln-primary/10 rounded-lg text-pln-primary">
              <FileText size={20} />
            </div>
            Edit Data Aset
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-full"
          >
            <X size={24} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar"
        >
          {/* FOTO */}
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="relative w-full h-48 mb-4 bg-gray-200 rounded-lg overflow-hidden flex items-center justify-center">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview Aset"
                  fill
                  className="object-contain"
                  unoptimized
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <ImageIcon size={48} className="mb-2" />
                  <span className="text-xs">Belum ada foto</span>
                </div>
              )}
            </div>
            <label className="cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all active:scale-95">
                <Upload size={16} />
                {previewUrl ? "Ganti Foto" : "Upload Foto"}
              </div>
            </label>
          </div>

          {/* IDENTITAS */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold text-pln-primary uppercase tracking-wider border-b pb-2 mb-4">
              Identitas Aset
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Nomor Aset (SAP)
                </label>
                <input
                  type="text"
                  value={asset.no_aset || "-"}
                  disabled
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Kategori
                </label>
                <input
                  type="text"
                  value={asset.jenis_aset}
                  disabled
                  className="w-full p-2.5 bg-gray-100 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Merk / Type
              </label>
              <input
                type="text"
                value={formData.merk_type}
                onChange={(e) =>
                  setFormData({ ...formData, merk_type: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pln-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                Spesifikasi Detail
              </label>
              <textarea
                rows={3}
                value={formData.spesifikasi}
                onChange={(e) =>
                  setFormData({ ...formData, spesifikasi: e.target.value })
                }
                className="w-full p-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-pln-primary outline-none transition-all resize-none"
              />
            </div>
          </div>

          {/* DOKUMEN & LEGALITAS */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
            <h4 className="text-sm font-bold text-yellow-800 flex items-center gap-2 mb-4">
              <AlertCircle size={16} /> Dokumen & Legalitas
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={asset.current_step < 2 ? "md:col-span-2" : ""}>
                <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                  No. Surat AE-1 (Awal)
                </label>
                <input
                  type="text"
                  value={formData.no_surat_ae1}
                  onChange={(e) =>
                    setFormData({ ...formData, no_surat_ae1: e.target.value })
                  }
                  className="w-full p-2 bg-white border border-yellow-300 rounded-md text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                />
              </div>

              {asset.current_step >= 2 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    No. Surat AE-2 (Penetapan)
                  </label>
                  <input
                    type="text"
                    value={formData.no_surat_ae2}
                    onChange={(e) =>
                      setFormData({ ...formData, no_surat_ae2: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-yellow-300 rounded-md text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
              )}

              {asset.current_step >= 3 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    No. Surat AE-3 (Usulan)
                  </label>
                  <input
                    type="text"
                    value={formData.no_surat_ae3}
                    onChange={(e) =>
                      setFormData({ ...formData, no_surat_ae3: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-yellow-300 rounded-md text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
              )}

              {asset.current_step >= 4 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                  <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">
                    No. Surat AE-4 (Review SPI)
                  </label>
                  <input
                    type="text"
                    value={formData.no_surat_ae4}
                    onChange={(e) =>
                      setFormData({ ...formData, no_surat_ae4: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-yellow-300 rounded-md text-sm focus:ring-1 focus:ring-yellow-500 outline-none"
                  />
                </div>
              )}

              {/* PERUBAHAN DISINI: SK HANYA MUNCUL DI TAHAP 8 */}
              {asset.current_step >= 8 && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-300 md:col-span-2">
                  <label className="block text-[10px] font-bold text-green-700 uppercase mb-1">
                    No. SK Penghapusan
                  </label>
                  <input
                    type="text"
                    value={formData.no_surat_sk}
                    onChange={(e) =>
                      setFormData({ ...formData, no_surat_sk: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-green-400 rounded-md text-sm focus:ring-1 focus:ring-green-500 outline-none font-bold text-green-800"
                  />
                </div>
              )}
            </div>

            {asset.current_step >= 2 && (
              <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="block text-[10px] font-bold text-pln-primary uppercase mb-1">
                  No. Surat ATTB (Pelengkap)
                </label>
                <input
                  type="text"
                  value={formData.no_attb}
                  onChange={(e) =>
                    setFormData({ ...formData, no_attb: e.target.value })
                  }
                  placeholder="Contoh: 005/ATTB/..."
                  className="w-full p-2 bg-white border-2 border-pln-gold/50 rounded-md text-sm focus:ring-1 focus:ring-pln-primary outline-none"
                />
              </div>
            )}
          </div>

          {/* NILAI & TAKSIRAN */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-5">
            <h4 className="text-sm font-bold text-blue-800 flex items-center gap-2 mb-4">
              Data Nilai & Taksiran
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">
                  Berat (KG)
                </label>
                <input
                  type="number"
                  value={formData.berat_kg}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      berat_kg: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white border border-blue-200 rounded-md text-sm font-bold"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-blue-600 uppercase mb-1">
                  Rate Scrap (Rp)
                </label>
                <input
                  type="number"
                  value={formData.rate_scrap}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rate_scrap: Number(e.target.value),
                    })
                  }
                  className="w-full p-2 bg-white border border-blue-200 rounded-md text-sm font-bold"
                />
              </div>
            </div>
            <div className="mt-3 p-3 bg-white rounded-lg border border-blue-100 flex justify-between items-center">
              <span className="text-xs font-bold text-gray-500">
                Estimasi Tafsiran (Auto):
              </span>
              <span className="text-lg font-bold text-pln-primary">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(formData.berat_kg * formData.rate_scrap)}
              </span>
            </div>
          </div>
        </form>

        <div className="p-5 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-gray-600 font-bold hover:bg-gray-200 transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg bg-pln-primary text-white font-bold hover:bg-pln-accent shadow-lg shadow-pln-primary/30 flex items-center gap-2 transition-all active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Menyimpan...
              </>
            ) : (
              <>
                <Save size={18} /> Simpan Perubahan
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
