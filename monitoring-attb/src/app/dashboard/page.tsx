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
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

// DYNAMIC IMPORT CHART
const DistributionChart = dynamic(
  () => import("../../components/Charts").then((mod) => mod.DistributionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 animate-pulse rounded-lg" />
    ),
  },
);

const CompositionChart = dynamic(
  () => import("../../components/Charts").then((mod) => mod.CompositionChart),
  {
    ssr: false,
    loading: () => (
      <div className="h-full bg-gray-100 animate-pulse rounded-full" />
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

// --- FIX TYPE ERROR ---
// Tambahkan [key: string]: ... agar cocok dengan interface di komponen Charts.tsx
interface ChartData {
  name: string;
  count: number;
  totalValue: number;
  [key: string]: string | number | undefined; // <--- INI PERBAIKANNYA
}

interface PieData {
  name: string;
  value: number;
  [key: string]: string | number | undefined; // <--- INI PERBAIKANNYA
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
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

        // 1. HITUNG STATISTIK (SELESAI = TAHAP 8)
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

        // 2. DATA GRAFIK DISTRIBUSI (BAR CHART)
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

        // Pastikan tipe data sesuai dengan ChartData
        const sortedChartData: ChartData[] = orderedLabels.map((label) => ({
          name: label,
          count: statusCounts[label]?.count || 0,
          totalValue: statusCounts[label]?.totalValue || 0,
        }));

        setChartData(sortedChartData);

        // 3. DATA PIE CHART
        const categoryCounts = assets.reduce<Record<string, PieData>>(
          (acc, curr) => {
            const cat = curr.jenis_aset || "Lainnya";
            if (!acc[cat]) {
              acc[cat] = { name: cat, value: 0 };
            }
            acc[cat].value += 1;
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
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pln-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-pln-primary">
            Dashboard Monitoring
          </h1>
          <p className="text-gray-500 mt-1">
            Halo, <span className="font-bold text-pln-accent">{userName}</span>
          </p>
        </div>
        <div className="text-left md:text-right bg-pln-gold/10 p-3 rounded-lg md:bg-transparent md:p-0">
          <p className="text-xs font-bold text-gray-500 uppercase">
            Total Nilai Buku (Aset)
          </p>
          <p className="text-xl md:text-2xl font-bold text-pln-primary">
            {formatRupiahShort(stats.totalValue)}
          </p>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Aset"
          value={stats.totalAsset}
          icon={<Package size={20} className="text-white" />}
          color="bg-pln-primary"
          subtext="Unit Terdaftar"
        />
        <StatCard
          title="Proses"
          value={stats.onProgress}
          icon={<Activity size={20} className="text-white" />}
          color="bg-yellow-500"
          subtext="Sedang Berjalan"
        />
        <StatCard
          title="Selesai"
          value={stats.completed}
          icon={<CheckCircle size={20} className="text-white" />}
          color="bg-green-600"
          subtext="Siap Hapus"
        />
        <StatCard
          title="Estimasi Recovery"
          value={formatRupiahShort(stats.totalScrap)}
          icon={<TrendingUp size={20} className="text-white" />}
          color="bg-pln-gold"
          subtext="Potensi Pendapatan"
        />
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* BAR CHART */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Wallet size={18} className="text-pln-primary" /> Distribusi Tahapan
            & End Accounting Value
          </h3>
          <div className="h-[300px] w-full">
            <DistributionChart data={chartData} />
          </div>
        </div>

        {/* PIE CHART */}
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col">
          <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
            <LayoutDashboard size={18} className="text-pln-primary" /> Jenis
            Aset
          </h3>
          <div className="h-[300px] w-full">
            <CompositionChart data={pieData} />
          </div>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-800 text-sm">Aset Terbaru</h3>
            <Link
              href="/dashboard/progress"
              className="text-xs text-pln-accent hover:underline flex items-center gap-1 font-medium"
            >
              Lihat Semua <ArrowRight size={12} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentAssets.map((asset) => (
              <div
                key={asset.id}
                className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] ${asset.current_step === 8 ? "bg-green-100 text-green-600" : "bg-blue-50 text-blue-600"}`}
                  >
                    {asset.current_step === 8 ? "OK" : `T${asset.current_step}`}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-gray-800 line-clamp-1">
                      {asset.jenis_aset}
                    </p>
                    <p className="text-[10px] text-gray-500 line-clamp-1">
                      {asset.merk_type}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xs text-gray-700">
                    {formatRupiahShort(asset.nilai_buku || 0)}
                  </p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(asset.created_at).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-pln-primary to-pln-accent rounded-xl p-6 text-white shadow-lg flex flex-col justify-center text-center">
          <h3 className="font-bold text-lg mb-2">Input Data Baru</h3>
          <p className="text-white/80 text-xs mb-6">
            Pastikan dokumen pendukung sudah lengkap sebelum input.
          </p>
          <Link
            href="/dashboard/input"
            className="bg-white text-pln-primary py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors shadow-md text-sm"
          >
            + Tambah Aset
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color, subtext }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden group hover:border-gray-200 transition-all">
      <div className="flex justify-between items-start z-10 relative">
        <div>
          <p className="text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-1">
            {title}
          </p>
          <h3 className="text-2xl font-bold text-gray-800 mb-0.5">{value}</h3>
          <p className="text-[10px] text-gray-400">{subtext}</p>
        </div>
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shadow-md ${color}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}
