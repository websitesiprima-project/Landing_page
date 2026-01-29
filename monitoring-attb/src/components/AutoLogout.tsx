"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";

// ATUR BATAS WAKTU DISINI (Contoh: 15 Menit)
// 15 menit * 60 detik * 1000 milidetik
const TIMEOUT_MS = 15 * 60 * 1000;

export default function AutoLogout() {
  const router = useRouter();
  const [lastActivity, setLastActivity] = useState(() => Date.now());

  // Fungsi Logout
  const handleLogout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      toast.error("Sesi Anda telah berakhir karena tidak ada aktivitas.", {
        icon: "⏳",
        duration: 5000,
        style: {
          border: "1px solid #EF4444",
          padding: "16px",
          color: "#713200",
        },
      });
      router.replace("/auth"); // Redirect ke halaman login
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }, [router]);

  // Removed unnecessary effect that sets lastActivity on mount

  useEffect(() => {
    // Fungsi untuk mereset timer saat ada aktivitas user
    const resetTimer = () => {
      setLastActivity(Date.now());
    };

    // Event listener untuk mendeteksi aktivitas
    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);
    window.addEventListener("click", resetTimer);
    window.addEventListener("scroll", resetTimer);
    window.addEventListener("keydown", resetTimer);

    // Interval pengecekan setiap 10 detik
    // Kita cek: Apakah (Waktu Sekarang - Aktivitas Terakhir) > Batas Waktu?
    const intervalId = setInterval(() => {
      const now = Date.now();
      if (now - lastActivity > TIMEOUT_MS) {
        handleLogout();
      }
    }, 10000); // Cek tiap 10 detik

    // Bersihkan listener saat komponen di-unmount (pindah halaman/tutup tab)
    return () => {
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
      window.removeEventListener("click", resetTimer);
      window.removeEventListener("scroll", resetTimer);
      window.removeEventListener("keydown", resetTimer);
      clearInterval(intervalId);
    };
  }, [lastActivity, handleLogout]);

  // Komponen ini tidak merender apa-apa secara visual (invisible)
  return null;
}
