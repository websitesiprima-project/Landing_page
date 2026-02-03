"use client";

import {
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function PortalGateway() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-800 relative overflow-hidden">
      {/* --- BACKGROUND ELEMENTS --- */}
      <div
        className="absolute inset-0 z-0 opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(#94a3b8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#01717f]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-[#e5b804]/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          {/* Badge Status */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              System Operational
            </span>
          </div>

          {/* Logo & Judul */}
          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <div className="relative w-36 h-36 mb-2">
              <Image
                src="/Logo.png"
                alt="Logo PLN"
                fill
                className="object-contain drop-shadow-lg"
                priority
              />
            </div>

            <h1 className="text-4xl md:text-6xl font-black text-slate-800 tracking-tight leading-none">
              PORTAL <span className="text-[#01717f]">SIPRIMA</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm md:text-base tracking-wide">
            <span className="text-[#e5b804] font-bold">PT PLN (Persero)</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>UPT MANADO</span>
          </div>

          <p className="mt-4 text-slate-400 text-sm max-w-xl mx-auto leading-relaxed">
            Gateway Terintegrasi Sistem Informasi Pengelolaan & Inventarisasi
            Aset.
          </p>
        </motion.div>

        {/* --- KARTU APLIKASI --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full px-4 max-w-4xl">
          {/* KARTU 1: REVALUE (TEAL) */}
          <a
            href="https://siprima-kepd.vercel.app/"
            className="group w-full block"
          >
            <motion.div
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="h-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(1,113,127,0.15)] transition-all duration-300 relative overflow-hidden group hover:border-[#01717f]/30"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#01717f] to-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-[#01717f]/10 text-[#01717f] rounded-2xl flex items-center justify-center group-hover:bg-[#01717f] group-hover:text-white transition-all duration-300">
                    <LayoutGrid size={28} />
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-600 group-hover:bg-[#01717f]/10 group-hover:text-[#01717f] transition-colors text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Monitoring App
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-[#01717f] transition-colors">
                  ReValue
                </h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  Aplikasi Monitoring Aset Tetap Tidak Beroperasi (ATTB),
                  Visualisasi Data, dan Pelacakan Status Penghapusan.
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-[#01717f] transition-colors">
                  Buka Aplikasi{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </motion.div>
          </a>

          {/* KARTU 2: SIJAGAD (GOLD - WARRANTY) */}
          <a
            href="https://siprima-two.vercel.app/"
            className="group w-full block"
          >
            <motion.div
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className="h-full bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 border border-white shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_20px_40px_rgb(229,184,4,0.15)] transition-all duration-300 relative overflow-hidden group hover:border-[#e5b804]/50"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#e5b804] to-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity" />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-6">
                  <div className="w-14 h-14 bg-[#e5b804]/10 text-[#b38f00] rounded-2xl flex items-center justify-center group-hover:bg-[#e5b804] group-hover:text-white transition-all duration-300">
                    {/* IKON SUDAH BERUBAH JADI PERISAI (WARRANTY) */}
                    <ShieldCheck size={28} />
                  </div>
                  <div className="px-3 py-1 bg-slate-100 text-slate-600 group-hover:bg-[#e5b804]/10 group-hover:text-[#b38f00] transition-colors text-[10px] font-bold uppercase tracking-wider rounded-full">
                    Warranty App
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-slate-800 mb-2 group-hover:text-[#b38f00] transition-colors">
                  SiJAGAD
                </h2>
                {/* DESKRIPSI SUDAH DIPERBARUI */}
                <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow">
                  Aplikasi Manajemen Surat Penjaminan Pelaksanaan & Pemeliharaan
                  (Garansi) serta Kontrol Masa Berlaku.
                </p>

                <div className="flex items-center gap-2 text-sm font-bold text-slate-400 group-hover:text-[#b38f00] transition-colors">
                  Buka Aplikasi{" "}
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </motion.div>
          </a>
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="mt-20 text-slate-400 text-[10px] md:text-xs font-medium relative z-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2 opacity-50">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>Secure Connection Established</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} PT PLN (Persero) UPT Manado. All
          Rights Reserved.
        </p>
        {/* Penanda Versi */}
        <p className="text-[9px] opacity-30 font-mono">Portal v2.1</p>
      </footer>
    </div>
  );
}
