"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BellRing,
  Search,
  FileSpreadsheet,
  Zap,
  LayoutDashboard,
  // ShieldCheck, <--- HAPUS INI (Tidak terpakai)
} from "lucide-react";
import { ReactNode } from "react";

// 1. BUAT INTERFACE UNTUK PROPS (Pengganti 'any')
interface FeatureSectionProps {
  badge: string;
  title: string;
  desc: string;
  icon: ReactNode;
  children: ReactNode;
  align: "left" | "right";
}

export default function FeaturesPage() {
  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 overflow-hidden">
      {/* --- BACKGROUND (Sama dengan Landing Page agar konsisten) --- */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* --- NAVBAR SEDERHANA --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-xl border-b border-white/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <ArrowLeft size={16} />
            </div>
            <span className="font-medium text-sm">Kembali ke Beranda</span>
          </Link>
          <span className="font-bold text-lg tracking-tight text-slate-900">
            Fitur SiJAGAD
          </span>
        </div>
      </nav>

      {/* --- HEADER SECTION --- */}
      <header className="relative pt-32 pb-16 px-6 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6">
            Explore Capabilities
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            Monitoring Aset Lebih Cerdas, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">
              Tanpa Rasa Was-was.
            </span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto">
            Pelajari bagaimana SiJAGAD membantu PLN UPT Manado mengelola ratusan
            dokumen jaminan vendor dengan otomatisasi dan keamanan tingkat
            tinggi.
          </p>
        </motion.div>
      </header>

      {/* --- FEATURE SECTIONS (ZIG-ZAG LAYOUT) --- */}
      <main className="max-w-7xl mx-auto px-6 pb-32 space-y-24">
        {/* FITUR 1: DASHBOARD MONITORING */}
        <FeatureSection
          badge="Real-time Overview"
          title="Dashboard Monitoring Interaktif"
          desc="Dapatkan gambaran menyeluruh tentang status semua surat jaminan dalam satu layar. Grafik visual memudahkan Anda melihat mana yang aktif, mendekati expired, atau sudah kadaluarsa."
          icon={<LayoutDashboard className="text-blue-600" size={24} />}
          align="left"
        >
          {/* Abstract UI Mockup: Dashboard Chart */}
          <div className="relative w-full h-64 bg-white rounded-xl shadow-lg border border-slate-100 p-6 flex flex-col gap-4 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <div className="h-4 w-32 bg-slate-100 rounded-full"></div>
              <div className="h-8 w-8 bg-blue-50 rounded-lg"></div>
            </div>
            <div className="flex gap-4 items-end h-full px-4 pb-4">
              <div className="w-1/4 h-[40%] bg-blue-100 rounded-t-lg"></div>
              <div className="w-1/4 h-[70%] bg-blue-500 rounded-t-lg shadow-lg shadow-blue-500/30"></div>
              <div className="w-1/4 h-[50%] bg-blue-200 rounded-t-lg"></div>
              <div className="w-1/4 h-[90%] bg-cyan-400 rounded-t-lg"></div>
            </div>
            {/* Floating Badge */}
            <div className="absolute top-4 right-4 bg-green-100 text-green-700 text-xs px-2 py-1 rounded font-bold">
              Live Data
            </div>
          </div>
        </FeatureSection>

        {/* FITUR 2: TELEGRAM NOTIFICATION */}
        <FeatureSection
          badge="On-Demand Access"
          title="Cek Status Instan via Telegram"
          desc="Monitoring fleksibel tanpa harus membuka dashboard. Cukup ketik perintah /info pada bot Telegram, sistem akan langsung menyajikan rekapitulasi data surat yang mendekati masa expired secara real-time."
          icon={<BellRing className="text-orange-500" size={24} />}
          align="right"
        >
          {/* Abstract UI Mockup: Chat Bubble Interaction */}
          <div className="relative w-full h-64 bg-slate-50 rounded-xl border border-slate-200 p-6 flex flex-col justify-center gap-4 font-sans">
            {/* 1. User mengetik perintah */}
            <div className="self-end bg-blue-600 p-3 rounded-2xl rounded-tr-none shadow-md text-white text-xs font-mono mb-2">
              /info
            </div>

            {/* 2. Bot Membalas */}
            <div className="self-start bg-white p-4 rounded-2xl rounded-tl-none shadow-md border border-slate-100 max-w-[90%]">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-xs font-bold text-slate-700">
                  SiJAGAD Bot
                </span>
                <span className="text-[10px] text-slate-400">Bot</span>
              </div>

              <div className="text-xs text-slate-600 space-y-2">
                <p className="font-bold">📊 UPDATE SISA WAKTU SURAT</p>

                <div className="p-2 bg-orange-50 border-l-2 border-orange-400 rounded-r">
                  <p className="font-bold text-orange-700">
                    ⚠️ PT. Cahaya Abadi
                  </p>
                  <p className="text-[10px]">Sisa: 30 Hari (Exp: 2024-12-01)</p>
                </div>

                <div className="p-2 bg-slate-50 border-l-2 border-slate-300 rounded-r">
                  <p className="font-bold text-slate-700">
                    ⏳ CV. Karya Makmur
                  </p>
                  <p className="text-[10px]">Sisa: 85 Hari (Exp: 2025-02-10)</p>
                </div>
              </div>
            </div>
          </div>
        </FeatureSection>

        {/* FITUR 3: PENCARIAN & EXPORT */}
        <FeatureSection
          badge="Data Management"
          title="Pencarian Cepat & Export Excel"
          desc="Cari data berdasarkan Vendor, No Kontrak, atau Pekerjaan dalam hitungan detik. Butuh laporan? Unduh rekapitulasi lengkap dalam format Excel (.xlsx) hanya dengan satu klik."
          icon={<Search className="text-emerald-600" size={24} />}
          align="left"
        >
          {/* Abstract UI Mockup: Table & Search */}
          <div className="relative w-full h-64 bg-white rounded-xl shadow-lg border border-slate-100 p-6 overflow-hidden">
            <div className="flex gap-3 mb-6">
              <div className="flex-1 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3">
                <Search size={16} className="text-slate-400 mr-2" />
                <div className="h-2 w-24 bg-slate-200 rounded-full"></div>
              </div>
              <div className="w-10 h-10 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center">
                <FileSpreadsheet size={18} className="text-green-600" />
              </div>
            </div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 rounded-lg border border-slate-50 hover:bg-slate-50 transition-colors"
                >
                  <div className="w-8 h-8 rounded bg-slate-200"></div>
                  <div className="flex-1 space-y-1">
                    <div className="h-3 w-1/2 bg-slate-200 rounded"></div>
                    <div className="h-2 w-1/3 bg-slate-100 rounded"></div>
                  </div>
                  <div className="h-6 w-16 bg-blue-50 rounded text-blue-600 text-[10px] flex items-center justify-center font-bold">
                    Active
                  </div>
                </div>
              ))}
            </div>
          </div>
        </FeatureSection>
      </main>

      {/* --- CTA BOTTOM --- */}
      <section className="py-20 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
        {/* Decorative BG */}
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-10"></div>
        <div className="absolute top-[-50%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/30 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Mengamankan Aset Perusahaan?
          </h2>
          <p className="text-slate-300 mb-8 text-lg">
            Bergabunglah dengan sistem manajemen digital yang efisien dan
            terukur. Login sekarang untuk mulai mengelola data.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/auth"
              className="px-8 py-4 bg-white text-slate-900 rounded-full font-bold hover:bg-blue-50 transition-colors shadow-lg shadow-white/10"
            >
              Login Pegawai
            </Link>
            <Link
              href="/"
              className="px-8 py-4 bg-transparent border border-slate-700 text-slate-300 rounded-full font-semibold hover:border-slate-500 hover:text-white transition-colors"
            >
              Kembali ke Depan
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// --- SUB-COMPONENT UNTUK LAYOUT FITUR ---
// 2. GUNAKAN INTERFACE DI SINI (Ganti 'any' dengan 'FeatureSectionProps')
function FeatureSection({
  badge,
  title,
  desc,
  icon,
  children,
  align,
}: FeatureSectionProps) {
  const isLeft = align === "left";

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7 }}
      className={`flex flex-col md:flex-row items-center gap-12 ${
        isLeft ? "" : "md:flex-row-reverse"
      }`}
    >
      {/* TEXT SIDE */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white shadow-sm border border-slate-100 rounded-lg">
            {icon}
          </div>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
            {badge}
          </span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900">{title}</h2>
        <p className="text-lg text-slate-500 leading-relaxed">{desc}</p>
        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
      </div>

      {/* VISUAL SIDE (Mockup Container) */}
      <div className="flex-1 w-full">
        <div className="relative group">
          {/* Efek Glow di belakang Mockup */}
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-200 to-cyan-100 rounded-2xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
          {/* Container Mockup */}
          <div className="relative bg-white/50 backdrop-blur-sm p-2 rounded-2xl border border-white/60 shadow-xl transition-transform duration-500 group-hover:-translate-y-2">
            {children}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
