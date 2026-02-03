"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabaseClient"; // Pastikan path ini benar
import { toast } from "react-hot-toast";

// --- MODE DEBUG ---
// Ubah ini jadi 10 detik (10 * 1000) untuk pengetesan.
// Nanti kembalikan ke 15 menit (15 * 60 * 1000) kalau sudah fix.
const TIMEOUT_MS = 10 * 1000;

export default function AutoLogout() {
  const router = useRouter();
  const lastActivityRef = useRef<number>(0);

  useEffect(() => {
    // Initialize lastActivityRef on mount
    lastActivityRef.current = Date.now();

    // Fungsi logout dipindah ke dalam effect agar tidak perlu dependency
    const handleLogout = async () => {
      const toastId = toast.loading("Sedang keluar...");
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;

        localStorage.clear();
        sessionStorage.clear();

        toast.success("Berhasil keluar", { id: toastId });

        router.refresh();
        router.replace("/");
      } catch (err) {
        console.error("Logout Error:", err);
        toast.error("Gagal logout, coba lagi", { id: toastId });
      }
    };

    // Fungsi reset timer (dipanggil saat ada gerakan)
    const resetTimer = () => {
      lastActivityRef.current = Date.now();
    };

    // Event listener yang lebih lengkap
    const events = [
      "mousedown",
      "mousemove",
      "wheel", // Tambahkan wheel untuk scroll mouse
      "keydown",
      "touchstart",
      "scroll",
      "click",
    ];

    // Pasang listener ke WINDOW dan DOCUMENT (untuk keamanan ganda)
    events.forEach((event) => {
      window.addEventListener(event, resetTimer);
      document.addEventListener(event, resetTimer);
    });

    // Cek setiap 1 detik (agar tes 10 detik akurat)
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivityRef.current;

      console.log(`Idle: ${Math.floor(timeSinceLastActivity / 1000)} detik`); // LOG DEBUG

      if (timeSinceLastActivity > TIMEOUT_MS) {
        handleLogout();
        // Hentikan interval agar tidak logout berulang kali
        clearInterval(intervalId);
      }
    }, 1000);

    // Bersihkan (Cleanup)
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetTimer);
        document.removeEventListener(event, resetTimer);
      });
      clearInterval(intervalId);
    };
  }, [router]);

  return null;
}
