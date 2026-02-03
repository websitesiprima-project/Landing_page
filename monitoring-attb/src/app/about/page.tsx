"use client";

import Link from "next/link";
// Hapus import Image yang tidak terpakai
import {
  ArrowLeft,
  CheckCircle2,
  Shield,
  TrendingUp,
  Heart,
  Award,
  Zap,
  Users,
  Layers,
  BarChart3,
  Lock,
} from "lucide-react";
import { motion, Variants } from "framer-motion";

// --- ANIMATION VARIANTS ---
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

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col font-sans text-slate-800 bg-slate-50 overflow-x-hidden">
      {/* === HERO HEADER === */}
      <div className="relative bg-[#01717f] text-white py-20 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[url('/background.svg')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#00505a] to-transparent opacity-90"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center text-[#e5b804] hover:text-white transition-colors mb-6 font-bold text-sm"
          >
            <ArrowLeft size={16} className="mr-2" /> KEMBALI KE BERANDA
          </Link>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            Tentang Sistem & Perusahaan
          </motion.h1>
          <p className="text-blue-100 max-w-2xl text-lg font-light">
            Mengenal lebih dalam fitur unggulan Monitoring ATTB dan profil
            korporat PT PLN (Persero).
          </p>
        </div>
      </div>

      {/* === SECTION 1: PENJELASAN FITUR UNGGULAN === */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#01717f] mb-3">
            Fitur Unggulan Sistem
          </h2>
          <div className="h-1 w-16 bg-[#e5b804] mx-auto rounded-full"></div>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Sistem Monitoring ATTB UPT Manado dirancang untuk memberikan
            transparansi dan efisiensi maksimal melalui tiga pilar utama.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <DetailFeatureCard
            icon={<Layers size={40} />}
            title="Workflow Digital Terintegrasi"
            desc="Menggantikan proses manual dengan alur kerja digital yang sistematis. Mencakup tahapan Inventarisasi (AE-1), Penetapan (AE-2), Usulan (AE-3), Review SPI (AE-4), hingga SK Penghapusan. Setiap langkah terekam dengan timestamp untuk akuntabilitas penuh."
          />
          <DetailFeatureCard
            icon={<BarChart3 size={40} />}
            title="Realtime Executive Dashboard"
            desc="Menyajikan visualisasi data aset secara waktu nyata. Manajemen dapat memantau total nilai potensi recovery (scrap value), sebaran lokasi aset, dan status persetujuan terkini dalam satu tampilan grafis yang mudah dipahami."
          />
          <DetailFeatureCard
            icon={<Lock size={40} />}
            title="Keamanan Data & Arsip Digital"
            desc="Penyimpanan terpusat untuk seluruh dokumen legal dan foto aset. Menggunakan enkripsi tingkat tinggi dan pembatasan akses berbasis peran (Role-Based Access Control) untuk menjamin kerahasiaan data perusahaan."
          />
        </div>
      </section>

      {/* === SECTION 2: VISI & MISI (DARK BLUE THEME) === */}
      <section className="bg-[#01717f] text-white py-20 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 relative z-10 items-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="mb-10">
              <h3 className="text-[#e5b804] font-bold tracking-widest uppercase mb-2">
                Visi Perusahaan
              </h3>
              <h2 className="text-3xl font-bold leading-relaxed">
                Menjadi Perusahaan Global Top 500 dan #1 Pilihan Pelanggan untuk
                Solusi Energi.
              </h2>
            </motion.div>

            <motion.div variants={fadeInUp}>
              <h3 className="text-[#e5b804] font-bold tracking-widest uppercase mb-4">
                Misi Perusahaan
              </h3>
              <ul className="space-y-4 text-blue-50">
                <li className="flex gap-3">
                  <CheckCircle2 className="shrink-0 text-[#e5b804]" />
                  <span>
                    Menjalankan bisnis kelistrikan dan bidang lain yang terkait,
                    berorientasi pada kepuasan pelanggan, anggota perusahaan dan
                    pemegang saham.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="shrink-0 text-[#e5b804]" />
                  <span>
                    Menjadikan tenaga listrik sebagai media untuk meningkatkan
                    kualitas kehidupan masyarakat.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="shrink-0 text-[#e5b804]" />
                  <span>
                    Mengupayakan agar tenaga listrik menjadi pendorong kegiatan
                    ekonomi.
                  </span>
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="shrink-0 text-[#e5b804]" />
                  <span>
                    Menjalankan kegiatan usaha yang berwawasan lingkungan.
                  </span>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* MOTO & TUJUAN CARD */}
          <div className="bg-white text-slate-800 p-8 rounded-2xl shadow-2xl border-t-8 border-[#e5b804]">
            <div className="mb-8">
              <h4 className="text-lg font-bold text-[#01717f] mb-2 border-b border-slate-100 pb-2">
                Moto Perusahaan
              </h4>
              {/* FIX: Menggunakan &quot; untuk tanda kutip */}
              <p className="text-2xl font-black italic text-slate-700">
                &quot;Listrik untuk Kehidupan yang Lebih Baik&quot;
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold text-[#01717f] mb-2 border-b border-slate-100 pb-2">
                Maksud dan Tujuan Perseroan
              </h4>
              <p className="text-slate-600 leading-relaxed text-sm">
                Untuk menyelenggarakan usaha penyediaan tenaga listrik bagi
                kepentingan umum dalam jumlah dan mutu yang memadai serta
                memupuk keuntungan dan melaksanakan penugasan Pemerintah di
                bidang ketenagalistrikan dalam rangka menunjang pembangunan
                dengan menerapkan prinsip-prinsip Perseroan Terbatas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === SECTION 3: TATA NILAI AKHLAK === */}
      <section className="py-20 px-6 bg-white max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#01717f] mb-3">
            Tata Nilai PLN
          </h2>
          <p className="text-slate-500">
            Nilai-nilai utama sumber daya manusia BUMN (AKHLAK)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ValueCard
            icon={<Shield />}
            title="AMANAH"
            desc="Memegang teguh kepercayaan yang diberikan."
          />
          <ValueCard
            icon={<TrendingUp />}
            title="KOMPETEN"
            desc="Terus belajar dan mengembangkan kapabilitas."
          />
          <ValueCard
            icon={<Heart />}
            title="HARMONIS"
            desc="Saling peduli dan menghargai perbedaan."
          />
          <ValueCard
            icon={<Award />}
            title="LOYAL"
            desc="Berdedikasi dan mengutamakan kepentingan bangsa dan negara."
          />
          <ValueCard
            icon={<Zap />}
            title="ADAPTIF"
            desc="Terus berinovasi dan antusias dalam menggerakkan ataupun menghadapi perubahan."
          />
          <ValueCard
            icon={<Users />}
            title="KOLABORATIF"
            desc="Membangun kerjasama yang sinergis."
          />
        </div>
      </section>

      {/* === SECTION 4: RIWAYAT SINGKAT (TIMELINE) === */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#01717f] mb-3">
              Riwayat Singkat PLN
            </h2>
            <div className="h-1 w-16 bg-[#e5b804] mx-auto rounded-full"></div>
          </div>

          <div className="relative border-l-4 border-[#01717f]/20 ml-4 md:ml-0 space-y-12">
            <TimelineItem year="Abad 19" title="Awal Mula">
              Bidang pabrik gula dan pabrik ketenagalistrikan di Indonesia mulai
              ditingkatkan saat beberapa perusahaan asal Belanda mendirikan
              pembangkit tenaga listrik untuk keperluan sendiri.
            </TimelineItem>

            <TimelineItem year="1942 - 1945" title="Era Jepang">
              Terjadi peralihan pengelolaan perusahaan-perusahaan Belanda
              tersebut oleh Jepang, setelah Belanda menyerah kepada pasukan
              tentara Jepang di awal Perang Dunia II.
            </TimelineItem>

            <TimelineItem year="1945" title="Kemerdekaan & Nasionalisasi">
              Pasca kemerdekaan, pemuda dan buruh listrik menyerahkan perusahaan
              listrik kepada Pemerintah RI. Pada 27 Oktober 1945, Presiden
              Soekarno membentuk Jawatan Listrik dan Gas (Kapasitas 157,5 MW).
            </TimelineItem>

            <TimelineItem year="1961 - 1965" title="Pembentukan BPU-PLN">
              Jawatan Listrik dan Gas diubah menjadi BPU-PLN (Badan Pemimpin
              Umum Perusahaan Listrik Negara). Pada 1965, dibubarkan menjadi
              dua: PLN (Listrik) dan PGN (Gas).
            </TimelineItem>

            <TimelineItem year="1972" title="Perusahaan Umum (PERUM)">
              Sesuai PP No. 18, status PLN ditetapkan sebagai Perusahaan Umum
              Listrik Negara dan sebagai Pemegang Kuasa Usaha Ketenagalistrikan
              (PKUK).
            </TimelineItem>

            <TimelineItem year="1994 - Sekarang" title="Perseroan (Persero)">
              Status PLN beralih menjadi Perusahaan Perseroan (Persero). PLN
              terus bertugas sebagai PKUK dalam menyediakan listrik bagi
              kepentingan umum hingga sekarang.
            </TimelineItem>
          </div>
        </div>
      </section>

      {/* === FOOTER === */}
      <footer className="bg-white py-8 border-t border-slate-200 text-center">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>&copy; {new Date().getFullYear()} PT PLN (Persero) UPT Manado.</p>
          <p>Tim SIPRIMA - Asset Recovery Management</p>
        </div>
      </footer>
    </div>
  );
}

// --- SUB COMPONENTS ---

function DetailFeatureCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 hover:shadow-lg transition-all text-center">
      <div className="w-16 h-16 mx-auto bg-[#01717f]/10 text-[#01717f] rounded-full flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

function ValueCard({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4 p-6 rounded-xl border border-slate-100 hover:border-[#e5b804] hover:bg-[#fff9e6] transition-all group">
      <div className="shrink-0 w-12 h-12 bg-[#01717f] text-white rounded-lg flex items-center justify-center group-hover:bg-[#e5b804] group-hover:text-[#01717f] transition-colors">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-[#01717f] mb-1">{title}</h3>
        <p className="text-sm text-slate-600">{desc}</p>
      </div>
    </div>
  );
}

function TimelineItem({
  year,
  title,
  children,
}: {
  year: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative pl-8 md:pl-12">
      {/* Dot */}
      <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full bg-[#e5b804] border-4 border-slate-50"></div>

      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
        <span className="font-black text-xl text-[#01717f] min-w-[120px]">
          {year}
        </span>
        <h3 className="font-bold text-slate-800 text-lg">{title}</h3>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed text-justify">
        {children}
      </p>
    </div>
  );
}
