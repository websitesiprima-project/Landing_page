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
const STORAGE_KEY = "last_activity_timestamp"; // Key untuk simpan waktu

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 1. Hook Dasar
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const lastActivityRef = useRef(Date.now());

  // State Data User
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false); // KEMBALIKAN STATE ADMIN

  // --- FUNGSI LOGOUT ---
  const performLogout = useCallback(async (isAuto = false) => {
    try {
      if (isAuto) {
        toast.dismiss();
        toast.error("Sesi kedaluwarsa. Silakan login kembali.", {
          duration: 4000,
        });
      } else {
        toast.loading("Keluar sistem...");
      }

      await supabase.auth.signOut();

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
        localStorage.clear();
        sessionStorage.clear();
      }

      window.location.href = "/";
    } catch (error) {
      console.error("Logout error", error);
      window.location.href = "/";
    }
  }, []);

  // --- 1. CEK SESI & ROLE SAAT LOAD ---
  useEffect(() => {
    const checkSessionAndRole = async () => {
      // A. Cek Sesi Timeout
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const storedLastActivity = localStorage.getItem(STORAGE_KEY);
      if (storedLastActivity) {
        const lastActiveTime = parseInt(storedLastActivity, 10);
        const now = Date.now();
        if (now - lastActiveTime > TIMEOUT_MS) {
          performLogout(true);
          return; // Stop eksekusi jika logout
        } else {
          localStorage.setItem(STORAGE_KEY, now.toString());
        }
      } else {
        localStorage.setItem(STORAGE_KEY, Date.now().toString());
      }

      // B. Cek Role User (Untuk Menyembunyikan Menu)
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        if (user.user_metadata?.avatar_url) {
          setAvatarUrl(user.user_metadata.avatar_url);
        }
        // Logika: Email mengandung 'admin' ATAU role metadata = 'admin'
        const checkAdmin =
          user.email?.includes("admin") || user.user_metadata?.role === "admin";
        setIsAdmin(checkAdmin || false);
      }
    };

    checkSessionAndRole();
  }, [performLogout]);

  // --- 2. UPDATE WAKTU SAAT AKTIVITAS ---
  useEffect(() => {
    const updateActivity = () => {
      const now = Date.now();
      lastActivityRef.current = now;
      localStorage.setItem(STORAGE_KEY, now.toString());
    };

    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => window.addEventListener(event, updateActivity));

    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastActivityRef.current > TIMEOUT_MS) {
        performLogout(true);
        clearInterval(intervalId);
      }
    }, 10000);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateActivity),
      );
      clearInterval(intervalId);
    };
  }, [performLogout]);

  // --- 3. RESPONSIVENESS ---
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

  useEffect(() => {
    if (isMobile && isSidebarOpen) setSidebarOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // --- RENDER UI ---
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden relative">
      <Toaster position="top-center" />

      {/* Overlay Mobile */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity duration-300"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 h-full z-40 bg-pln-primary text-white shadow-2xl flex flex-col shrink-0 overflow-hidden
          transition-[width] duration-300 ease-in-out
          ${isSidebarOpen ? "w-72" : isMobile ? "w-0" : "w-20"}
          ${isMobile && isSidebarOpen ? "translate-x-0" : ""}
          ${isMobile && !isSidebarOpen ? "-translate-x-full" : ""}
        `}
      >
        {/* Header Sidebar */}
        <div className="h-24 flex items-center px-4 border-b border-white/10 bg-white/5 shrink-0 relative">
          <div
            className={`flex items-center w-full transition-all duration-300 ${!isSidebarOpen ? "justify-center" : "justify-start"}`}
          >
            <div
              className={`relative transition-all duration-300 bg-white rounded-xl flex items-center justify-center shadow-lg
                ${isSidebarOpen ? "w-48 h-12 px-4" : "w-10 h-10 p-1"}`}
            >
              <Image
                src="/Logo_1.png"
                alt="Logo PLN"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
            </div>
          </div>
          {isMobile && isSidebarOpen && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute right-4 text-white/70 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto custom-scrollbar overflow-x-hidden">
          <SidebarItem
            href="/dashboard"
            icon={<LayoutDashboard size={22} />}
            label="Dashboard"
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            href="/dashboard/progress"
            icon={<Activity size={22} />}
            label="Progress Aset"
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            href="/dashboard/monitoring"
            icon={<TableProperties size={22} />}
            label="Monitoring Data"
            isOpen={isSidebarOpen}
          />
          <SidebarItem
            href="/dashboard/help"
            icon={<BookOpen size={22} />}
            label="Panduan & SOP"
            isOpen={isSidebarOpen}
          />

          {/* MENU INPUT: HANYA MUNCUL JIKA ADMIN */}
          {isAdmin && (
            <>
              <div
                className={`pt-6 pb-2 border-t border-white/10 mt-2 transition-opacity duration-300 ${!isSidebarOpen ? "opacity-0 hidden" : "opacity-100 block"}`}
              >
                <p className="text-xs text-pln-accent/80 font-bold px-4 mb-2 uppercase tracking-wider whitespace-nowrap">
                  Menu Input
                </p>
              </div>
              <SidebarItem
                href="/dashboard/input"
                icon={<FilePlus size={22} />}
                label="Input Usulan"
                isOpen={isSidebarOpen}
              />
            </>
          )}
        </div>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-white/10 shrink-0 bg-black/10">
          <button
            onClick={() => performLogout(false)}
            className={`flex items-center gap-3 text-red-200 hover:text-white hover:bg-white/10 transition-all w-full p-3 rounded-xl group relative ${!isSidebarOpen ? "justify-center" : ""}`}
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <div className="shrink-0">
              <LogOut size={22} />
            </div>
            <span
              className={`font-medium whitespace-nowrap transition-opacity duration-200 ${!isSidebarOpen ? "opacity-0 w-0 hidden" : "opacity-100 w-auto block"}`}
            >
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col h-full min-w-0 relative bg-gray-50 transition-all duration-300">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0 z-20">
          <button
            onClick={() => setSidebarOpen(!isSidebarOpen)}
            className="text-pln-primary hover:bg-gray-100 p-2 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-pln-primary/20"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-sm font-bold text-pln-primary">User Active</p>
              <Link
                href="/dashboard/profile"
                className="text-xs text-gray-500 hover:text-pln-accent transition-colors font-medium"
              >
                Lihat Profil
              </Link>
            </div>

            <Link href="/dashboard/profile" className="relative group block">
              <div className="w-10 h-10 bg-gray-100 rounded-full border-2 border-pln-primary/20 cursor-pointer hover:border-pln-primary hover:shadow-md flex items-center justify-center overflow-hidden relative transition-all duration-300">
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
                    alt="Profile"
                    width={40}
                    height={40}
                    className="object-cover opacity-50 p-1"
                  />
                )}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
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

// Helper Sidebar Item
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
      className={`flex items-center px-3 py-3 rounded-xl transition-colors duration-200 group relative mb-1
      ${isActive ? "bg-white text-pln-primary shadow-lg font-bold" : "text-gray-300 hover:bg-white/10 hover:text-white"}
      ${!isOpen ? "justify-center" : "gap-3"}`}
      title={!isOpen ? label : ""}
    >
      <div
        className={`shrink-0 transition-colors duration-200 ${isActive ? "text-pln-primary" : "text-pln-gold group-hover:text-white"}`}
      >
        {icon}
      </div>
      <span
        className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${!isOpen ? "opacity-0 w-0 hidden" : "opacity-100 w-auto block"}`}
      >
        {label}
      </span>
      {!isOpen && (
        <div className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap shadow-xl border border-white/10 transition-opacity duration-200">
          {label}
        </div>
      )}
    </Link>
  );
}
