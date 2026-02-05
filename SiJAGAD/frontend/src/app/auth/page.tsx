"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  ArrowRight,
  CheckCircle,
  XCircle,
  X,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const router = useRouter();

  const showToast = (message: string, type: "success" | "error") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setNotification(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.session) {
          document.cookie =
            "token=valid-sijagad-session; path=/; max-age=86400";
          showToast("Login Berhasil! Mengalihkan...", "success");
          router.refresh();
          router.replace("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;

        showToast("Registrasi Berhasil! Silakan cek email/login.", "success");
        setIsLogin(true);
        setPassword("");
      }
    } catch (error: unknown) {
      // PERBAIKAN: Menggunakan 'unknown' dan pengecekan tipe yang aman
      console.error("Auth Error:", error);

      let msg = "Terjadi kesalahan pada server.";

      if (error instanceof Error) {
        msg = error.message;
      } else if (typeof error === "string") {
        msg = error;
      }

      if (msg.includes("Invalid login")) msg = "Email atau password salah.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 font-sans text-slate-800">
      {/* --- BACKGROUND ELEMENTS (DEPTH EFFECT) --- */}
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none"></div>

      {/* Soft Orbs (Cahaya Halus) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px] pointer-events-none mix-blend-multiply animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-blue-50/40 pointer-events-none"></div>

      {/* --- TOMBOL KEMBALI (FIXED) --- */}
      <Link href="/" className="absolute top-6 left-6 z-50">
        <button className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur-md border border-white/50 rounded-full shadow-sm hover:bg-white hover:shadow-md transition-all text-slate-600 text-sm font-semibold group">
          <div className="p-1 bg-slate-100 rounded-full group-hover:bg-blue-50 transition-colors">
            <ArrowLeft
              size={14}
              className="group-hover:-translate-x-0.5 transition-transform"
            />
          </div>
          Kembali
        </button>
      </Link>

      {/* --- TOAST NOTIFICATION --- */}
      {notification && (
        <div
          className={`fixed top-6 z-[60] flex items-center gap-3 px-6 py-3 rounded-xl border shadow-2xl animate-in slide-in-from-top-5 duration-300 backdrop-blur-md ${
            notification.type === "success"
              ? "bg-green-50/90 border-green-200 text-green-700"
              : "bg-red-50/90 border-red-200 text-red-700"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle size={20} />
          ) : (
            <XCircle size={20} />
          )}
          <span className="text-sm font-bold">{notification.message}</span>
          <button
            onClick={() => setNotification(null)}
            className="ml-2 hover:bg-black/5 rounded-full p-1"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* --- CARD UTAMA (GLASSMORPHISM) --- */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Efek Glow di belakang Card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-[2.5rem] blur opacity-30"></div>

        <div className="relative bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.08)] rounded-[2.5rem] p-8 md:p-10">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-32 h-32 mx-auto mb-6 drop-shadow-xl filter">
              <Image
                src="/SiJAGAD_4.svg"
                alt="Logo SiJAGAD"
                fill
                className="object-contain"
                priority
              />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight font-display mb-2">
              Selamat Datang
            </h1>
            <p className="text-slate-500 text-sm font-medium">
              Silakan login untuk mengakses dashboard.
            </p>
          </div>

          {/* Switch Login/Daftar */}
          <div className="bg-slate-100/80 p-1.5 rounded-2xl flex mb-8 relative border border-slate-200/60 shadow-inner">
            <div className="absolute inset-1.5 pointer-events-none">
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 35 }}
                className={`h-full w-1/2 bg-white rounded-xl shadow-sm border border-black/5 absolute ${
                  isLogin ? "left-0" : "left-1/2"
                }`}
              />
            </div>
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${
                isLogin
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Masuk
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-sm font-bold relative z-10 transition-colors duration-300 ${
                !isLogin
                  ? "text-slate-900"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Daftar
            </button>
          </div>

          {/* Form Input */}
          <form onSubmit={handleAuth} className="space-y-5">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">
                Email
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="nama@pln.co.id"
                  className="w-full pl-12 pr-4 py-3.5 bg-white/60 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 ml-1 uppercase tracking-wider">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 bg-white/60 border border-slate-200 rounded-xl text-slate-800 text-sm outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all font-medium placeholder:text-slate-400 shadow-sm"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-md hover:bg-slate-100"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-slate-900/30 hover:-translate-y-1 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span className="text-sm">
                    {isLogin ? "Masuk Dashboard" : "Buat Akun Baru"}
                  </span>
                  <div className="p-1 bg-white/10 rounded-full">
                    <ArrowRight size={16} />
                  </div>
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/60 text-center">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
              PLN UPT MANADO © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
