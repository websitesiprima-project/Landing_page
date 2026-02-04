"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FilePlus,
  Activity,
  TableProperties,
  LogOut,
  Menu,
  BookOpen,
  X,
} from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../lib/supabaseClient";
import { toast, Toaster } from "react-hot-toast";
import Image from "next/image";

// --- KONFIGURASI WAKTU LOGOUT (15 MENIT) ---
const TIMEOUT_MS = 15 * 60 * 1000;

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Hook Dasar (useState, useRouter, etc)
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const lastActivityRef = useRef(Date.now());

  // State untuk Avatar Header (Opsional: agar sinkron dengan profil)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // --- FIX UTAMA: BERSIHKAN NOTIFIKASI SAAT MOUNT ---
  useEffect(() => {
    // Menghapus semua toast yang 'nyangkut' dari halaman Login
    toast.dismiss();

    // Opsional: Ambil foto profil untuk Header
    const getAvatar = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };
    getAvatar();
  }, []);
  // --------------------------------------------------

  // 2. Callback Logout
  const handleAutoLogout = useCallback(async () => {
    try {
      toast.dismiss(); // Bersihkan dulu sebelum pesan baru
      toast.error("Sesi habis. Mengalihkan...", { duration: 3000 });
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Auto logout error", error);
      window.location.href = "/";
    }
  }, []);

  const handleManualLogout = async () => {
    toast.dismiss();
    const toastId = toast.loading("Keluar sistem...");
    try {
      await supabase.auth.signOut();
      toast.success("Berhasil keluar", { id: toastId });
    } catch (error) {
      console.error("Manual logout error:", error);
      toast.error("Gagal logout", { id: toastId });
    }
  };

  // 3. Effect: Auth State Listener (Satpam Global)
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = "/"; // Hard Redirect
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 4. Effect: Resize Listener (Responsif)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
        setSidebarOpen(false);
      } else {
        setIsMobile(false);
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 5. Effect: Tutup Sidebar saat ganti halaman (Mobile Only)
  useEffect(() => {
    if (isMobile && isSidebarOpen) {
      setSidebarOpen(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // 6. Effect: Timer Auto Logout
  useEffect(() => {
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();

    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      if (timeSinceLastActivity > TIMEOUT_MS) {
        handleAutoLogout();
        clearInterval(intervalId);
      }
    }, 10000);

    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      clearInterval(intervalId);
    };
  }, [handleAutoLogout]);

  // --- RENDER UI ---
  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Toaster Global */}
      <Toaster position="top-center" />

      {/* Overlay Gelap (Mobile) */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 h-screen z-40 bg-pln-primary text-white shadow-xl transition-all duration-300 ease-in-out flex flex-col
          ${
            isSidebarOpen
              ? "translate-x-0 w-64"
              : "-translate-x-full md:translate-x-0 md:w-20"
          }
        `}
      >
        {/* Header Sidebar */}
        <div className="h-20 flex items-center justify-between px-4 border-b border-white/10 bg-white shrink-0">
          <div className="relative w-full h-12 flex items-center justify-center">
            <Image
              src="/Logo.png"
              alt="Logo PLN"
              fill
              priority
              className="object-contain"
            />
          </div>
          {isMobile && isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-500 hover:text-red-500 absolute right-0 mr-4"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={20} />}
            label="Dashboard"
            isOpen={isSidebarOpen}
          />

          <SidebarItem
            href="/dashboard/progress"
            icon={<Activity size={20} />}
            label="Progress Aset"
            isOpen={isSidebarOpen}
          />

          <SidebarItem
            href="/dashboard/monitoring"
            icon={<TableProperties size={20} />}
            label="Monitoring Data"
            isOpen={isSidebarOpen}
          />

          <SidebarItem
            href="/dashboard/help"
            icon={<BookOpen size={20} />}
            label="Panduan & SOP"
            isOpen={isSidebarOpen}
          />

          <div className="pt-4 pb-2 border-t border-white/10 mt-4">
            <p
              className={`text-xs text-pln-accent/70 font-semibold px-4 mb-2 uppercase ${!isSidebarOpen && "hidden"}`}
            >
              Menu Input
            </p>
            <SidebarItem
              href="/dashboard/input"
              icon={<FilePlus size={20} />}
              label="Input Usulan"
              isOpen={isSidebarOpen}
            />
          </div>
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 shrink-0">
          <button
            onClick={handleManualLogout}
            className="flex items-center gap-3 text-red-300 hover:text-white transition-colors w-full p-2 rounded-lg hover:bg-white/10"
          >
            <LogOut size={20} />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b-4 border-pln-gold flex items-center justify-between px-4 md:px-6 shadow-sm sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-pln-primary hover:bg-gray-100 p-2 rounded-lg"
          >
            <Menu />
          </button>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-pln-primary">User Active</p>
              <Link
                href="/dashboard/profile"
                className="text-xs text-gray-500 hover:text-pln-accent"
              >
                Lihat Profil
              </Link>
            </div>

            {/* Foto Profil di Header (Sinkron dengan Profil) */}
            <Link href="/dashboard/profile">
              <div className="w-9 h-9 bg-gray-200 rounded-full border-2 border-pln-primary cursor-pointer hover:shadow-md flex items-center justify-center overflow-hidden relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <Image
                    src="/Logo.png"
                    alt="Profile Placeholder"
                    width={36}
                    height={36}
                    className="object-cover opacity-50"
                  />
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="p-4 md:p-6 flex-1 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

// Helper Component Sidebar Item
function SidebarItem({
  href,
  icon,
  label,
  isOpen,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  isOpen: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative
      ${isActive ? "bg-pln-accent text-white shadow-md font-semibold" : "text-gray-300 hover:bg-white/10 hover:text-white"}`}
    >
      <div
        className={`${isActive ? "text-white" : "text-pln-gold group-hover:text-white"}`}
      >
        {icon}
      </div>
      {isOpen ? (
        <span>{label}</span>
      ) : (
        <div className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 hidden md:block">
          {label}
        </div>
      )}
    </Link>
  );
}
