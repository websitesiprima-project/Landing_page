"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Zap,
  BellRing,
  FileText,
  ArrowRight,
  Lock,
  ArrowLeft,
  CheckCircle2, // Pastikan ini terimport
} from "lucide-react";
import { useEffect, useState, ReactNode } from "react";
import { supabase } from "../lib/supabase";
import Image from "next/image";

// Interface Props
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
  className?: string;
  delay?: number;
}

export default function LandingPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setIsLoggedIn(true);
    };
    checkUser();
  }, []);

  return (
    <div className="relative min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-100 overflow-hidden">
      {/* --- BACKGROUND ELEMENTS (Agar tidak flat) --- */}
      {/* 1. Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      {/* 2. Soft Orbs (Cahaya Halus) */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* --- NAVBAR --- */}
      <nav className="fixed top-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-white/50 shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Bagian Kiri */}
          <div className="flex items-center gap-6">
            <a
              href="https://portal-utama.vercel.app/"
              className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium text-sm transition-all group"
            >
              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-100 transition-all">
                <ArrowLeft
                  size={14}
                  className="group-hover:-translate-x-0.5 transition-transform"
                />
              </div>
              <span className="hidden md:block">Kembali ke Portal</span>
            </a>

            <div className="h-5 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-3 select-none">
              {/* Logo Container dengan Shadow Halus */}
              <div className="relative w-9 h-9 shadow-sm rounded-lg overflow-hidden">
                <Image
                  src="/SiJAGAD_2.svg"
                  alt="Logo SiJAGAD"
                  fill
                  className="object-contain bg-white"
                  priority
                />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-900 hidden sm:block">
                SiJAGAD
              </span>
            </div>
          </div>

          {/* Bagian Kanan */}
          <div className="flex gap-3">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-sm font-semibold hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 transition-all flex items-center gap-2"
              >
                Dashboard <ArrowRight size={16} />
              </Link>
            ) : (
              <Link
                href="/auth"
                className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-full text-sm font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 transition-all overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <Lock size={16} /> Login Pegawai
                </span>
                {/* Shine Effect pada Button */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12"></div>
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <section className="relative pt-36 pb-20 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* TEXT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Badge Baru */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6 shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse"></span>
              PLN UPT Manado
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Sistem Jaminan <br />
              <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-[length:200%_auto] animate-gradient">
                Garansi Digital
              </span>
            </h1>

            <p className="text-lg text-slate-500 mb-8 leading-relaxed max-w-lg">
              Platform terintegrasi untuk monitoring masa berlaku Bank Garansi,
              arsip digital aman, dan notifikasi real-time demi kepatuhan
              vendor.
            </p>

            {/* --- BUTTON GROUP (UPDATED) --- */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tombol Utama (Dashboard/Mulai) */}
              <Link href={isLoggedIn ? "/dashboard" : "/auth"}>
                <button className="w-full sm:w-auto px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg hover:-translate-y-1 transition-all shadow-xl hover:shadow-2xl shadow-slate-900/20 flex items-center justify-center gap-3">
                  {isLoggedIn ? "Buka Dashboard" : "Mulai Sekarang"}
                  <div className="p-1 bg-white/10 rounded-full">
                    <ArrowRight size={18} />
                  </div>
                </button>
              </Link>

              {/* Tombol Sekunder (Pelajari Fitur) - DITAMBAHKAN DISINI */}
              <Link href="/features">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} className="text-green-500" />
                  Pelajari Fitur
                </button>
              </Link>
            </div>

            {/* Stats Kecil (Pemanis) */}
            <div className="mt-10 pt-8 border-t border-slate-200/60 flex gap-8">
              <div>
                <p className="text-3xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Secure
                </p>
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-900">24/7</p>
                <p className="text-xs text-slate-500 uppercase tracking-wide">
                  Monitoring
                </p>
              </div>
            </div>
          </motion.div>

          {/* VISUAL CONTENT (Floating Cards) */}
          <div className="relative h-[500px] w-full hidden lg:block">
            {/* Background Glow visual content */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 to-transparent rounded-full blur-3xl transform translate-x-10"></div>

            <div className="relative z-10 grid grid-cols-2 gap-5 p-4">
              <FeatureCard
                icon={<ShieldCheck size={28} className="text-blue-600" />}
                title="Keamanan Data"
                desc="Enkripsi End-to-End untuk dokumen vital perusahaan."
                delay={0.2}
              />
              <FeatureCard
                icon={<BellRing size={28} className="text-orange-500" />}
                title="Auto Notifikasi"
                desc="Peringatan dini H-90 sebelum masa garansi habis."
                className="translate-y-12" // Staggered layout
                delay={0.4}
              />
              <FeatureCard
                icon={<FileText size={28} className="text-emerald-500" />}
                title="Arsip Digital"
                desc="Pencarian cepat & penyimpanan terpusat yang rapi."
                delay={0.6}
              />
              <FeatureCard
                icon={<Zap size={28} className="text-yellow-500" />}
                title="Real-time Sync"
                desc="Data selalu sinkron antar perangkat admin."
                className="translate-y-12"
                delay={0.8}
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>
            © {new Date().getFullYear()} PLN UPT Manado. All rights reserved.
          </p>
          <div className="flex gap-6 mt-4 md:mt-0 font-medium">
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Privacy Policy
            </span>
            <span className="hover:text-blue-600 cursor-pointer transition-colors">
              Terms of Service
            </span>
            <span className="flex items-center gap-1 text-slate-400">
              <Lock size={12} /> Secure System
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

// --- KOMPONEN KARTU YANG DI-UPGRADE ---
function FeatureCard({
  icon,
  title,
  desc,
  className = "",
  delay = 0,
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      // Efek Melayang (Floating) terus menerus
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={`
        group relative p-6 rounded-2xl
        bg-white/70 backdrop-blur-md
        border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)]
        hover:shadow-[0_8px_30px_rgb(59,130,246,0.1)] hover:border-blue-100
        transition-all duration-300
        ${className}
      `}
    >
      {/* Icon Container with Gradient Background */}
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
        {icon}
      </div>

      <h3 className="font-bold text-slate-800 text-lg mb-2 group-hover:text-blue-700 transition-colors">
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </motion.div>
  );
}
