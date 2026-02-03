"use client";

import { useEffect, useState, use } from "react"; // 1. Tambahkan import 'use'
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
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Interface Data
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

  // Surat-surat
  no_surat_ae1: string;
  no_surat_ae2: string;
  no_attb: string;
  no_surat_ae3: string;
  no_surat_ae4: string;
  no_surat_sk: string;
}

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
  { step: 5, label: "SK Penghapusan", desc: "Penerbitan SK Penghapusan Aset" },
];

// 2. Ubah tipe params menjadi Promise
export default function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 3. Unwrap params dengan use()
  const { id } = use(params);

  const [asset, setAsset] = useState<AssetDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchAssetDetail = async () => {
      setLoading(true);
      // Gunakan 'id' hasil unwrap tadi
      const { data, error } = await supabase
        .from("attb_assets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching detail:", error);
      } else {
        setAsset(data);
      }
      setLoading(false);
    };

    if (id) {
      fetchAssetDetail();
    }
  }, [id]); // Dependency gunakan 'id'

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

  const formatRupiah = (val: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(val);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* HEADER PAGE */}
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
              {asset.jenis_aset}
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

        <div className="hidden md:block">
          <span
            className={`px-4 py-2 rounded-full text-sm font-bold border ${asset.current_step === 5 ? "bg-green-100 text-green-700 border-green-200" : "bg-blue-600 text-white border-blue-600"}`}
          >
            Status: {TIMELINE_STEPS[asset.current_step - 1]?.label || "Proses"}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: FOTO & DATA */}
        <div className="lg:col-span-2 space-y-6">
          {/* FOTO BESAR */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
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

          {/* DETAIL DATA */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2 flex items-center gap-2">
              <FileText size={20} className="text-pln-primary" /> Spesifikasi &
              Nilai
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* KOLOM KANAN: TIMELINE */}
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

                // Cek Surat per Step
                if (item.step === 1) surat = asset.no_surat_ae1;
                else if (item.step === 2) surat = asset.no_surat_ae2;
                else if (item.step === 3) surat = asset.no_surat_ae3;
                else if (item.step === 4) surat = asset.no_surat_ae4;
                else if (item.step === 5) surat = asset.no_surat_sk;

                return (
                  <div key={item.step} className="relative pl-8">
                    {/* DOT STATUS */}
                    <div
                      className={`absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 ${
                        isCompleted
                          ? "bg-green-500 border-white"
                          : isActive
                            ? "bg-blue-500 border-white animate-pulse"
                            : "bg-gray-200 border-white"
                      }`}
                    ></div>

                    <h4
                      className={`text-sm font-bold ${
                        isCompleted || isActive
                          ? "text-gray-800"
                          : "text-gray-400"
                      }`}
                    >
                      {item.label}
                    </h4>
                    <p className="text-xs text-gray-400 mb-1">{item.desc}</p>

                    {/* LABEL SURAT */}
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
              {asset.no_attb && (
                <Download className="text-yellow-600 cursor-pointer hover:scale-110 transition-transform" />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
