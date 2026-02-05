"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  LayoutDashboard,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Wallet,
  Package,
  Activity,
  ArrowUpRight,
  Clock,
  Calendar,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Loader from "../../components/Loader";
import { motion } from "framer-motion";

// --- REFERENSI KATEGORI (Agar kode berubah jadi Nama) ---
const ASSET_CATEGORY_MAP: Record<string, string> = {
  "10100": "Tanah & hak atas tanah",
  "10200": "Bangunan & kelengkap",
  "10300": "Bangunan saluran air",
  "10400": "Jalan dan sepur samp",
  "10500": "Instalasi dan mesin",
  "10510": "Ins & Mesin Cina",
  "10520": "Ins & Mesin Non-Cina",
  "10600": "Plngk penyaluran TL",
  "10700": "Gardu Induk",
  "10800": "SUTT",
  "10900": "Kabel di bawah tanah",
  "11000": "Jaringan distribusi",
  "11010": "Penghantar jaringan",
  "11020": "Peralatan jaringan",
  "11030": "Tiang",
  "11100": "Gardu distribusi",
  "11110": "Gardu distribusi",
  "11120": "Fasilitas 20 KV-GI",
  "11130": "Trafo",
  "11200": "Plngk lain2 distribu",
  "11300": "Plngk pgolah data",
  "11400": "Plngk transmisi data",
  "11450": "Teleinformasi Data",
  "11500": "Perlengkapan khusus",
  "11600": "Perlengkapan telekom",
  "11700": "Perlengkapan umum",
  "11750": "Peralatan Kerja",
  "11800": "Kendaraan bermotor &",
  "11900": "Kapal & Prlngkapanya",
  "40700": "Gardu Induk",
};

// DYNAMIC IMPORT CHART
const DistributionChart = dynamic(
  () => import("../../components/Charts").then((mod) => mod.DistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-50 animate-pulse rounded-lg flex items-center justify-center text-slate-300 text-xs">
        Memuat Grafik...
      </div>
    ),
  },
);

const CompositionChart = dynamic(
  () => import("../../components/Charts").then((mod) => mod.CompositionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-slate-50 animate-pulse rounded-full flex items-center justify-center text-slate-300 text-xs">
        Memuat Data...
      </div>
    ),
  },
);

interface AssetData {
  id: string;
  jenis_aset: string;
  merk_type: string;
  nilai_buku: number;
  harga_tafsiran: number;
  current_step: number;
  created_at: string;
}

interface ChartData {
  name: string;
  count: number;
  totalValue: number;
  [key: string]: string | number | undefined;
}

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number | undefined;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  iconColorClass: string;
  subtext: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalAsset: 0,
    totalValue: 0,
    totalScrap: 0,
    completed: 0,
    onProgress: 0,
  });

  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [pieData, setPieData] = useState<PieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentAssets, setRecentAssets] = useState<AssetData[]>([]);
  const [userName, setUserName] = useState("User");

  useEffect(() => {
    fetchDashboardData();
    getUserName();
  }, []);

  const getUserName = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUserName(
        user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
      );
    }
  };

  // Helper Translate Kode -> Nama
  const getCategoryLabel = (code: string) => {
    const cleanCode = String(code).trim();
    return ASSET_CATEGORY_MAP[cleanCode] || cleanCode;
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("attb_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const assets = data as AssetData[];

        // 1. STATISTIK
        const completed = assets.filter((a) => a.current_step === 8).length;
        const onProgress = assets.filter((a) => a.current_step < 8).length;
        const totalValue = assets.reduce(
          (acc, curr) => acc + (curr.nilai_buku || 0),
          0,
        );
        const totalScrap = assets.reduce(
          (acc, curr) => acc + (curr.harga_tafsiran || 0),
          0,
        );

        setStats({
          totalAsset: assets.length,
          totalValue,
          totalScrap,
          completed,
          onProgress,
        });

        setRecentAssets(assets.slice(0, 5));

        // 2. CHART DATA
        const statusMap: Record<number, string> = {
          1: "AE-1",
          2: "AE-2",
          3: "AE-3",
          4: "AE-4",
          5: "Dekom",
          6: "Lelang",
          7: "Angkut",
          8: "Selesai",
        };

        const statusCounts = assets.reduce<Record<string, ChartData>>(
          (acc, curr) => {
            const stepLabel =
              statusMap[curr.current_step] || `Tahap ${curr.current_step}`;
            if (!acc[stepLabel]) {
              acc[stepLabel] = { name: stepLabel, count: 0, totalValue: 0 };
            }
            acc[stepLabel].count += 1;
            acc[stepLabel].totalValue += curr.nilai_buku || 0;
            return acc;
          },
          {},
        );

        const orderedLabels = [
          "AE-1",
          "AE-2",
          "AE-3",
          "AE-4",
          "Dekom",
          "Lelang",
          "Angkut",
          "Selesai",
        ];

        const sortedChartData: ChartData[] = orderedLabels.map((label) => ({
          name: label,
          count: statusCounts[label]?.count || 0,
          totalValue: statusCounts[label]?.totalValue || 0,
        }));

        setChartData(sortedChartData);

        // 3. PIE DATA (Translate Label di sini juga)
        const categoryCounts = assets.reduce<Record<string, PieData>>(
          (acc, curr) => {
            // Translate Kode ke Label untuk Pie Chart
            const rawCat = curr.jenis_aset || "Lainnya";
            const catLabel = getCategoryLabel(rawCat);

            if (!acc[catLabel]) {
              acc[catLabel] = { name: catLabel, value: 0 };
            }
            acc[catLabel].value += 1;
            return acc;
          },
          {},
        );

        const sortedPie: PieData[] = Object.values(categoryCounts).sort(
          (a, b) => b.value - a.value,
        );
        setPieData(sortedPie);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatRupiahShort = (val: number) => {
    if (val >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    if (val >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(0)} Jt`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-20"
    >
      {/* --- HERO BANNER --- */}
      <div className="relative bg-gradient-to-r from-[#01717f] to-cyan-600 rounded-3xl p-8 text-white shadow-xl overflow-hidden border border-white/20">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-10 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-medium mb-3 border border-white/10">
              <span className="w-2 h-2 bg-[#e5b804] rounded-full animate-pulse"></span>
              Live Monitoring
            </div>
            <h1 className="text-3xl font-bold mb-1">Halo, {userName} 👋</h1>
            <p className="text-cyan-100 opacity-90 max-w-lg text-sm leading-relaxed">
              Selamat datang di Dashboard REVALUE. Berikut adalah ringkasan
              status aset ATTB dan nilai perolehan terkini.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl min-w-[200px]">
            <p className="text-cyan-100 text-xs font-bold uppercase tracking-wider mb-1">
              Total End Acq Value
            </p>
            <p className="text-3xl font-black text-white drop-shadow-sm">
              {formatRupiahShort(stats.totalValue)}
            </p>
          </div>
        </div>
      </div>

      {/* --- STAT CARDS --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Aset"
          value={stats.totalAsset}
          icon={<Package size={22} />}
          colorClass="bg-blue-50"
          iconColorClass="text-blue-600"
          subtext="Unit Terdaftar"
        />
        <StatCard
          title="Sedang Proses"
          value={stats.onProgress}
          icon={<Activity size={22} />}
          colorClass="bg-orange-50"
          iconColorClass="text-orange-600"
          subtext="Perlu Tindak Lanjut"
        />
        <StatCard
          title="Selesai (OK)"
          value={stats.completed}
          icon={<CheckCircle size={22} />}
          colorClass="bg-emerald-50"
          iconColorClass="text-emerald-600"
          subtext="Siap Penghapusan"
        />
        <StatCard
          title="Est. Recovery"
          value={formatRupiahShort(stats.totalScrap)}
          icon={<Wallet size={22} />}
          colorClass="bg-yellow-50"
          iconColorClass="text-yellow-600"
          subtext="Potensi Pendapatan"
        />
      </div>

      {/* --- CHARTS SECTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Distribusi Tahapan
              </h3>
              <p className="text-slate-400 text-xs">
                Sebaran aset berdasarkan proses administrasi
              </p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <TrendingUp size={20} />
            </div>
          </div>
          <div className="h-[320px] w-full">
            <DistributionChart data={chartData} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-3xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">
                Kategori Aset
              </h3>
              <p className="text-slate-400 text-xs">Komposisi jenis aset</p>
            </div>
            <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
              <LayoutDashboard size={20} />
            </div>
          </div>
          <div className="h-[320px] w-full">
            <CompositionChart data={pieData} />
          </div>
        </div>
      </div>

      {/* --- RECENT ACTIVITY & ACTION --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent List - DIPERBAIKI DESAINNYA */}
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Aset Terbaru</h3>
              <p className="text-slate-400 text-xs">
                5 data terakhir yang ditambahkan
              </p>
            </div>
            <Link
              href="/dashboard/progress"
              className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-[#01717f] hover:text-white transition-all flex items-center gap-2"
            >
              Lihat Semua <ArrowRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-50 overflow-auto max-h-[400px] custom-scrollbar">
            {recentAssets.map((asset) => (
              <div
                key={asset.id}
                className="group flex items-center justify-between p-5 hover:bg-slate-50/80 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  {/* Icon Box */}
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 
                    ${asset.current_step === 8 ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-[#01717f]"}`}
                  >
                    {asset.current_step === 8 ? (
                      <CheckCircle size={20} />
                    ) : (
                      <Package size={20} />
                    )}
                  </div>

                  {/* Asset Info */}
                  <div>
                    <p className="font-bold text-slate-700 text-sm mb-0.5 group-hover:text-[#01717f] transition-colors">
                      {getCategoryLabel(asset.jenis_aset)}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-500 font-mono">
                        {asset.current_step === 8
                          ? "Selesai"
                          : `Tahap ${asset.current_step}`}
                      </span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="truncate max-w-[150px]">
                        {asset.merk_type || "Tanpa Merk"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Info: Price & Date */}
                <div className="text-right">
                  <p className="font-bold text-slate-800 text-sm">
                    {formatRupiahShort(asset.nilai_buku || 0)}
                  </p>
                  <p className="text-[10px] text-slate-400 flex items-center justify-end gap-1 mt-1">
                    <Calendar size={10} />
                    {new Date(asset.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            ))}

            {recentAssets.length === 0 && (
              <div className="p-10 text-center flex flex-col items-center justify-center text-slate-400">
                <Package size={40} className="mb-2 opacity-20" />
                <p className="text-sm">Belum ada data aset.</p>
              </div>
            )}
          </div>
        </div>

        {/* Input Card (CTA) */}
        <div className="bg-[#01717f] rounded-3xl p-8 text-white shadow-xl shadow-cyan-900/10 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>

          <div className="relative z-10">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-4 text-white">
              <ArrowUpRight size={24} />
            </div>
            <h3 className="font-bold text-2xl mb-2">Input Usulan</h3>
            <p className="text-cyan-100 text-sm leading-relaxed mb-6 opacity-90">
              Tambah data aset baru ke dalam sistem monitoring. Pastikan dokumen
              lengkap.
            </p>
          </div>

          <Link
            href="/dashboard/input"
            className="relative z-10 w-full py-4 bg-white text-[#01717f] rounded-xl font-bold text-center hover:bg-cyan-50 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            + Tambah Data
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

// --- HELPER COMPONENT: STAT CARD ---
function StatCard({
  title,
  value,
  icon,
  colorClass,
  iconColorClass,
  subtext,
}: StatCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-5 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 relative overflow-hidden"
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-slate-400 text-[10px] uppercase font-bold tracking-wider mb-2">
            {title}
          </p>
          <h3 className="text-3xl font-black text-slate-800 mb-1 tracking-tight">
            {value}
          </h3>
          <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
            {subtext}
          </p>
        </div>
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorClass} ${iconColorClass}`}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}
