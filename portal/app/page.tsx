"use client";

import {
  ArrowRight,
  LayoutGrid,
  ShieldCheck,
  Zap,
  HardHat,
  Database,
  Search,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

// Data Aplikasi untuk memudahkan maintenance
const applications = [
  {
    title: "ReValue",
    desc: "Monitoring Aset Tetap Tidak Beroperasi (ATTB), Visualisasi Data, dan Pelacakan Status Penghapusan.",
    link: "https://revalue.plnuptmdo.com",
    tag: "Monitoring App",
    icon: <LayoutGrid size={28} />,
    color: "from-[#01717f] to-cyan-400",
    textHover: "group-hover:text-[#01717f]",
    bgHover: "hover:shadow-[0_20px_40px_rgb(1,113,127,0.15)]",
    borderColor: "group-hover:border-[#01717f]/30",
    iconBg: "bg-[#01717f]/10 text-[#01717f] group-hover:bg-[#01717f]",
  },
  {
    title: "SiJAGAD",
    desc: "Manajemen Surat Penjaminan Pelaksanaan & Pemeliharaan (Garansi) serta Kontrol Masa Berlaku.",
    link: "https://sijagad.plnuptmdo.com",
    tag: "Warranty App",
    icon: <ShieldCheck size={28} />,
    color: "from-[#e5b804] to-yellow-400",
    textHover: "group-hover:text-[#b38f00]",
    bgHover: "hover:shadow-[0_20px_40px_rgb(229,184,4,0.15)]",
    borderColor: "group-hover:border-[#e5b804]/50",
    iconBg: "bg-[#e5b804]/10 text-[#b38f00] group-hover:bg-[#e5b804]",
  },
  {
    title: "SmartTrafo",
    desc: "Sistem monitoring kondisi transformator secara real-time untuk keandalan penyaluran energi.",
    link: "https://smarttrafo.plnuptmdo.com",
    tag: "Utility App",
    icon: <Zap size={28} />,
    color: "from-blue-500 to-indigo-400",
    textHover: "group-hover:text-blue-600",
    bgHover: "hover:shadow-[0_20px_40px_rgb(59,130,246,0.15)]",
    borderColor: "group-hover:border-blue-500/30",
    iconBg: "bg-blue-50 text-blue-500 group-hover:bg-blue-500",
  },
  {
    title: "SAKTI",
    desc: "Sistem Aplikasi Konsolidasi Teknologi Informasi untuk integrasi data operasional UPT.",
    link: "https://sakti.plnuptmdo.com",
    tag: "Integration App",
    icon: <Database size={28} />,
    color: "from-purple-500 to-pink-400",
    textHover: "group-hover:text-purple-600",
    bgHover: "hover:shadow-[0_20px_40px_rgb(168,85,247,0.15)]",
    borderColor: "group-hover:border-purple-500/30",
    iconBg: "bg-purple-50 text-purple-500 group-hover:bg-purple-500",
  },
  {
    title: "SIPINTAR",
    desc: "Sistem Informasi Manajemen Pintar untuk efisiensi administrasi dan pelaporan internal PLN.",
    link: "https://sipintar-pln.id",
    tag: "Smart System",
    icon: <Search size={28} />,
    color: "from-emerald-500 to-teal-400",
    textHover: "group-hover:text-emerald-600",
    bgHover: "hover:shadow-[0_20px_40px_rgb(16,185,129,0.15)]",
    borderColor: "group-hover:border-emerald-500/30",
    iconBg: "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500",
  },
  {
    title: "SIMAVI HSSE",
    desc: "Portal monitoring Health, Safety, Security, and Environment untuk menjamin keselamatan kerja.",
    link: "https://simavi-hsse.id",
    tag: "Safety App",
    icon: <HardHat size={28} />,
    color: "from-orange-500 to-red-400",
    textHover: "group-hover:text-orange-600",
    bgHover: "hover:shadow-[0_20px_40px_rgb(249,115,22,0.15)]",
    borderColor: "group-hover:border-orange-500/30",
    iconBg: "bg-orange-50 text-orange-500 group-hover:bg-orange-500",
  },
];

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

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#01717f]/5 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#e5b804]/5 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
        {/* --- HEADER --- */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md rounded-full border border-slate-200 shadow-sm mb-6">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] font-bold tracking-widest text-slate-600 uppercase">
              UPT Manado Digital Ecosystem
            </span>
          </div>

          <div className="flex flex-col items-center justify-center gap-4 mb-4">
            <div className="relative w-28 h-28 mb-2">
              <Image
                src="/Logo.png"
                alt="Logo PLN"
                fill
                className="object-contain drop-shadow-md"
                priority
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              PORTAL <span className="text-[#01717f]">SIPRIMA</span>
            </h1>
          </div>

          <div className="flex items-center justify-center gap-2 text-slate-500 font-medium text-sm">
            <span className="text-[#e5b804] font-bold">PT PLN (Persero)</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>UPT MANADO</span>
          </div>
        </motion.div>

        {/* --- GRID APLIKASI (3 Kolom di Desktop) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full px-4">
          {applications.map((app, index) => (
            <motion.a
              key={index}
              href={app.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
              className={`group block h-full bg-white/80 backdrop-blur-xl rounded-[1.5rem] p-6 border border-white shadow-sm transition-all duration-300 relative overflow-hidden ${app.bgHover} ${app.borderColor}`}
            >
              <div
                className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${app.color} opacity-0 group-hover:opacity-100 transition-opacity`}
              />

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${app.iconBg} group-hover:text-white`}
                  >
                    {app.icon}
                  </div>
                  <div className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[9px] font-bold uppercase tracking-wider rounded-full group-hover:bg-opacity-20 transition-colors">
                    {app.tag}
                  </div>
                </div>

                <h2
                  className={`text-xl font-bold text-slate-800 mb-2 transition-colors ${app.textHover}`}
                >
                  {app.title}
                </h2>
                <p className="text-slate-500 text-xs leading-relaxed mb-6 flex-grow">
                  {app.desc}
                </p>

                <div
                  className={`flex items-center gap-2 text-[11px] font-bold text-slate-400 transition-colors ${app.textHover}`}
                >
                  BUKA SISTEM
                  <ArrowRight
                    size={14}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* --- FOOTER --- */}
      <footer className="mt-16 text-slate-400 text-[10px] font-medium relative z-10 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2 opacity-50">
          <CheckCircle2 size={12} className="text-emerald-500" />
          <span>Integrated Single Sign-On Access</span>
        </div>
        <p>
          &copy; {new Date().getFullYear()} PT PLN (Persero) UPT Manado. Portal
          v2.5
        </p>
      </footer>
    </div>
  );
}
