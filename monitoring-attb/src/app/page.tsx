"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Database,
  ArrowLeft,
  Layers,
  ChevronRight,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// --- VARIANTS ANIMASI ---
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

// --- DATA FITUR (Untuk Memudahkan Link) ---
const FEATURES_DATA = [
  {
    icon: <Layers size={32} />,
    title: "Workflow Digital",
    desc: "Proses approval berjenjang (AE-1 s.d AE-5) yang tercatat sistematis dan transparan sesuai SOP perusahaan.",
    link: "/about", // Ganti dengan link tujuan, misal: /fitur/workflow
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Realtime Dashboard",
    desc: "Pemantauan status dan lokasi aset secara langsung melalui dashboard eksekutif untuk keputusan cepat.",
    link: "/about", // Ganti dengan link tujuan
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Keamanan Data",
    desc: "Arsip digital terpusat dengan enkripsi tingkat tinggi untuk dokumen legal dan riwayat aset.",
    link: "/about", // Ganti dengan link tujuan
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 overflow-x-hidden">
      {/* === SECTION 1: HERO (CENTERED & CLEAN) === */}
      <div className="relative bg-[#01717f] text-white min-h-[85vh] flex flex-col">
        {/* Background SVG */}
        <div
          className="absolute inset-0 z-0 opacity-15"
          style={{
            backgroundImage: "url('/background.svg')",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        ></div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00505a]/80 via-[#01717f]/50 to-[#01717f] z-0"></div>

        {/* Navbar */}
        <nav className="relative z-20 max-w-7xl mx-auto px-6 py-6 w-full flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="relative w-8 h-10 bg-white p-1 rounded shadow-sm">
              <Image
                src="/Logo.png"
                alt="Logo PLN"
                fill
                className="object-contain p-0.5"
              />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[10px] font-bold text-[#e5b804] tracking-widest uppercase">
                PT PLN (Persero)
              </span>
              <span className="text-lg font-bold text-white tracking-tight">
                UPT MANADO
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://portal-utama.vercel.app/"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft size={16} /> Kembali ke Portal
            </a>
            <Link href="/auth">
              <button className="bg-[#e5b804] text-[#01717f] px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-[#ffcc00] transition-colors shadow-md flex items-center gap-2">
                Login Staff <ArrowRight size={16} />
              </button>
            </Link>
          </div>
        </nav>

        {/* Hero Content (Centered) */}
        <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center max-w-4xl mx-auto px-6 w-full pb-20">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-8"
          >
            <motion.div
              variants={fadeInUp}
              className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-[#e5b804] text-xs font-bold tracking-widest uppercase shadow-lg"
            >
              Sistem Manajemen Aset v3.0
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="text-5xl md:text-7xl font-black leading-tight tracking-tight drop-shadow-xl"
            >
              Asset Recovery <br />
              <span className="text-[#e5b804]">Monitoring System</span>
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-lg md:text-xl text-blue-50/90 max-w-2xl mx-auto leading-relaxed font-light"
            >
              Solusi digital terintegrasi untuk pengelolaan, pemantauan, dan
              optimalisasi nilai Aset Tetap Tidak Beroperasi (ATTB) secara
              transparan.
            </motion.p>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
            >
              <Link href="/auth">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-[#01717f] font-bold rounded-xl shadow-xl hover:bg-slate-100 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                  Mulai Monitoring <ArrowRight size={18} />
                </button>
              </Link>
              <Link href="/about">
                <button className="w-full sm:w-auto px-8 py-4 bg-[#01717f]/50 backdrop-blur-md border border-white/30 text-white font-medium rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                  <Database size={18} /> Dokumentasi SOP
                </button>
              </Link>
            </motion.div>
          </motion.div>
        </main>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] z-20">
          <svg
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
            className="relative block w-full h-[60px] md:h-[100px] fill-slate-50"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
          </svg>
        </div>
      </div>

      {/* === SECTION 2: FITUR (CLEAN CARD & LINKED) === */}
      <div className="max-w-7xl mx-auto px-6 py-24 relative z-20 bg-slate-50">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-black text-[#01717f] mb-3">
            Fitur Unggulan
          </h2>
          <div className="h-1 w-16 bg-[#e5b804] mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {FEATURES_DATA.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              desc={feature.desc}
              href={feature.link}
            />
          ))}
        </div>
      </div>

      {/* === SECTION 3: FOOTER SIMPLE === */}
      <footer className="bg-white border-t border-slate-200 py-10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Image
              src="/Logo.png"
              alt="Logo"
              width={18}
              height={22}
              className="grayscale opacity-50"
            />
            <span>
              &copy; {new Date().getFullYear()} PT PLN (Persero) UPT Manado
            </span>
          </div>
          <p>Tim SIPRIMA - Asset Recovery Management System</p>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS ---

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
}

function FeatureCard({ icon, title, desc, href }: FeatureCardProps) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-slate-100 hover:border-[#01717f] hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
      <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-[#01717f] mb-6 group-hover:bg-[#01717f] group-hover:text-white transition-colors">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm mb-6 flex-1">
        {desc}
      </p>

      {/* Tombol Pelajari Fitur */}
      <Link href={href} className="mt-auto">
        <div className="inline-flex items-center text-[#01717f] text-sm font-bold group-hover:gap-2 transition-all cursor-pointer">
          Pelajari Fitur <ChevronRight size={16} className="ml-1" />
        </div>
      </Link>
    </div>
  );
}
