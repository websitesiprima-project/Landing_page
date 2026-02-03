"use client";

import React from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  Printer,
  Edit,
  Trash2,
  TrendingUp,
  Scale,
  ScrollText,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

export default function HelpPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-pln-primary flex items-center gap-3">
          <BookOpen size={32} /> Pusat Bantuan & Panduan
        </h1>
        <p className="text-gray-500 mt-2">
          Dokumentasi standar operasional prosedur (SOP) dan dasar pengetahuan
          Monitoring ATTB (8 Tahapan).
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* KOLOM KIRI: KONTEN UTAMA */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. VISUALISASI ALUR (UPDATE: 8 TAHAP) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <TrendingUp className="text-pln-primary" /> Ringkasan Alur Proses
              (8 Tahap)
            </h3>
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              <StepItem
                number="1"
                title="Inventarisasi (AE-1)"
                desc="Penelitian fisik & administratif aset yang rusak/tidak beroperasi."
              />
              <StepItem
                number="2"
                title="Penetapan Status (AE-2)"
                desc="Aset resmi ditetapkan menjadi ATTB (Aset Tetap Tidak Beroperasi)."
              />
              <StepItem
                number="3"
                title="Usulan Penghapusan (AE-3)"
                desc="Pengajuan usulan penghapusan dari Unit ke Kantor Pusat/Divisi."
              />
              <StepItem
                number="4"
                title="Review SPI (AE-4)"
                desc="Audit dan review kelayakan penghapusan oleh Satuan Pengawas Internal."
              />
              <StepItem
                number="5"
                title="Persetujuan Dekomisioning"
                desc="Persetujuan teknis pembongkaran aset dari sistem."
              />
              <StepItem
                number="6"
                title="Proses Lelang"
                desc="Penjualan aset melalui mekanisme lelang negara/internal."
              />
              <StepItem
                number="7"
                title="Pengangkutan"
                desc="Aset diambil oleh pemenang lelang atau dipindahkan dari lokasi."
              />
              <StepItem
                number="8"
                title="Selesai (SK Penghapusan)"
                desc="Penerbitan SK Penghapusan & aset dihapus dari buku (Write-off)."
                isLast
              />
            </div>
          </div>

          {/* 2. DEFINISI & DASAR HUKUM */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <Scale className="text-pln-primary" /> Dasar Hukum & Pengertian
            </h3>

            <div className="bg-blue-50 p-4 rounded-lg mb-4 border border-blue-100">
              <h4 className="font-bold text-blue-900 text-sm mb-1">
                Apa itu Aset Tetap Tidak Beroperasi (ATTB)?
              </h4>
              <p className="text-sm text-blue-800 leading-relaxed">
                Aset berwujud yang diperoleh, tetapi{" "}
                <strong>
                  tidak digunakan dalam kegiatan operasi normal Perusahaan
                </strong>
                , diukur sebesar biaya perolehannya dan disusutkan.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-gray-700 text-sm">
                Kebijakan & Regulasi Terkait:
              </h4>
              <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4 marker:text-pln-primary">
                <li>
                  SE 015.E/870/DIR/1998 (Penarikan Aktiva Operasi menjadi Tidak
                  Beroperasi - AE.2)
                </li>
                <li>
                  SK Direksi No. 055.K/8713/DIR/1996 (Penghapusan karena
                  Hilang/Pencurian/Terbakar)
                </li>
                <li>
                  Keputusan Direksi No.1233.K/DIR/2011 (Tata Cara
                  Penghapusbukuan)
                </li>
                <li>
                  PERDIR No. 0116.K/DIR/2017 (Pedoman Kebijakan Akuntansi)
                </li>
              </ul>
            </div>
          </div>

          {/* 3. SYARAT PENARIKAN */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <ShieldCheck className="text-pln-primary" /> Syarat Penarikan Aset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold text-sm text-gray-800 mb-2 border-b pb-1">
                  1. Aset Tetap
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Kondisi fisik teknis tidak memungkinkan operasi.</li>
                  <li>Tidak ekonomis (biaya perbaikan tinggi).</li>
                  <li>Penggantian teknologi (usang).</li>
                  <li>Relokasi sesuai kebijakan manajemen.</li>
                </ul>
              </div>
              <div className="border border-gray-200 p-4 rounded-lg">
                <h4 className="font-bold text-sm text-gray-800 mb-2 border-b pb-1">
                  2. Material / PDP
                </h4>
                <ul className="text-xs text-gray-600 space-y-1 list-disc pl-4">
                  <li>Rusak & tidak ekonomis diperbaiki.</li>
                  <li>Kadaluwarsa (Expired).</li>
                  <li>PDP/Pengembangan yang tidak ekonomis dilanjutkan.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* 4. DETAIL PROSEDUR (EXPANDABLE) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <ScrollText className="text-pln-primary" /> Detail Prosedur Teknis
            </h3>
            <details className="group bg-gray-50 rounded-lg border border-gray-200">
              <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                <span>Klik untuk melihat Detail Langkah Kerja</span>
                <span className="transition group-open:rotate-180">
                  <ChevronDown size={16} />
                </span>
              </summary>
              <div className="text-xs text-gray-600 p-4 pt-0 border-t border-gray-200 space-y-2 leading-relaxed h-80 overflow-y-auto custom-scrollbar">
                <ol className="list-decimal pl-4 space-y-2">
                  <li>
                    <strong>Tahap 1 (Inventarisasi):</strong> Tim UP melakukan
                    sensus aset fisik. Menerbitkan BA Penelitian Aset (Formulir
                    AE-1).
                  </li>
                  {/* FIX: Menggunakan &apos; pengganti tanda kutip tunggal */}
                  <li>
                    <strong>Tahap 2 (Penetapan):</strong> Berdasarkan AE-1,
                    status aset di SAP diubah menjadi &apos;Not In
                    Operation&apos;. Terbit Dokumen AE-2.
                  </li>
                  <li>
                    <strong>Tahap 3 (Usulan):</strong> Unit Induk (UIW/UID)
                    mengajukan usulan penghapusan ke Kantor Pusat (Divisi
                    Akuntansi). Dokumen AE-3.
                  </li>
                  <li>
                    <strong>Tahap 4 (Review SPI):</strong> Satuan Pengawas
                    Internal (SPI) melakukan audit kepatuhan dan kewajaran
                    nilai. Terbit AE-4.
                  </li>
                  <li>
                    <strong>Tahap 5 (Dekomisioning):</strong> Persetujuan teknis
                    untuk membongkar aset dari jaringan (jika masih terpasang).
                  </li>
                  <li>
                    <strong>Tahap 6 (Lelang):</strong> Proses penilaian harga
                    limit (KJPP) dan pelaksanaan lelang melalui KPKNL atau
                    internal.
                  </li>
                  <li>
                    <strong>Tahap 7 (Pengangkutan):</strong> Pembeli/Pemenang
                    lelang mengangkut material dari gudang/lokasi. Dibuatkan
                    Berita Acara Serah Terima.
                  </li>
                  <li>
                    <strong>Tahap 8 (Penghapusan):</strong> Penerbitan SK
                    Penghapusan oleh Direksi. Aset dihapus (Write-off) dari
                    pembukuan perusahaan.
                  </li>
                </ol>
              </div>
            </details>
          </div>

          {/* 5. FAQ */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-800 text-lg mb-4 flex items-center gap-2">
              <HelpCircle className="text-pln-primary" /> FAQ (Tanya Jawab)
            </h3>
            <div className="space-y-4">
              <FaqItem
                q="Apa bedanya AE-1 dan AE-2?"
                a="AE-1 adalah hasil penelitian fisik (barang ada/rusak). AE-2 adalah dokumen legal perubahan status akuntansi menjadi ATTB."
              />
              <FaqItem
                q="Apakah aset di Tahap 5 sudah boleh dijual?"
                a="Belum. Tahap 5 baru persetujuan bongkar. Penjualan baru boleh dilakukan setelah proses Lelang (Tahap 6) selesai."
              />
              <FaqItem
                q="Bagaimana jika salah input tahap?"
                a="Gunakan fitur 'Revert Tahap' di menu Progress atau Monitoring untuk mengembalikan aset ke tahapan sebelumnya."
              />
            </div>
          </div>
        </div>

        {/* KOLOM KANAN: FITUR & IKON */}
        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
            <h3 className="font-bold text-blue-800 mb-4">Fitur Aplikasi</h3>
            <ul className="space-y-3">
              <FeatureItem
                icon={<Edit size={16} />}
                text="Edit Data & Foto Aset"
              />
              <FeatureItem
                icon={<CheckCircle size={16} />}
                text="Update Progress Bertahap"
              />
              <FeatureItem
                icon={<Trash2 size={16} />}
                text="Hapus / Revert Usulan"
              />
              <FeatureItem
                icon={<Printer size={16} />}
                text="Cetak PDF Laporan Aset"
              />
              <FeatureItem
                icon={<FileText size={16} />}
                text="Export Monitoring Excel"
              />
            </ul>
          </div>

          <div className="bg-yellow-50 p-6 rounded-xl border border-yellow-100">
            <h3 className="font-bold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle size={18} /> Perhatian
            </h3>
            <p className="text-sm text-yellow-800 opacity-90 leading-relaxed">
              Pastikan dokumen fisik (Berita Acara) sudah lengkap dan
              ditandatangani sebelum memindahkan aset ke tahap selanjutnya di
              sistem ini.
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4">Kontak Admin</h3>
            <p className="text-sm text-gray-500 mb-2">
              Jika terjadi kendala sistem, hubungi:
            </p>
            <div className="font-mono text-sm bg-gray-100 p-2 rounded text-center">
              websitesiprima@gmail.com
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- KOMPONEN KECIL ---

function StepItem({
  number,
  title,
  desc,
  isLast,
}: {
  number: string;
  title: string;
  desc: string;
  isLast?: boolean;
}) {
  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-pln-primary group-[.is-active]:text-white text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10">
        {number}
      </div>
      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between space-x-2 mb-1">
          <div className="font-bold text-slate-900">{title}</div>
          {isLast && <CheckCircle size={16} className="text-green-500" />}
        </div>
        <div className="text-slate-500 text-sm leading-snug">{desc}</div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="border-b border-gray-100 pb-3 last:border-0 last:pb-0">
      <h4 className="font-bold text-sm text-gray-800 mb-1">{q}</h4>
      <p className="text-sm text-gray-500">{a}</p>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <li className="flex items-center gap-3 text-sm text-blue-900">
      <div className="bg-white p-1.5 rounded-md shadow-sm text-pln-primary">
        {icon}
      </div>
      {text}
    </li>
  );
}
