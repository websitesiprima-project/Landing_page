"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  User,
  ArrowLeft,
  ArrowRight,
  Mail,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Loader from "../../components/Loader";

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Form State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // 1. Check Session on Mount
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.replace("/dashboard");
      } else {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    // FIX 1: Hapus notifikasi lama agar bersih
    toast.dismiss();

    try {
      if (isLogin) {
        // --- LOGIN LOGIC ---
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        toast.success("Login Berhasil! Mengalihkan...", {
          duration: 2000, // Durasi pendek
          style: { border: "1px solid #01717f", color: "#01717f" },
          iconTheme: { primary: "#01717f", secondary: "#FFFAEE" },
        });

        setIsRedirecting(true);
        router.refresh();

        setTimeout(() => {
          // FIX 2: Hapus notifikasi tepat sebelum pindah halaman
          toast.dismiss();
          router.replace("/dashboard");
        }, 800);
      } else {
        // --- SIGNUP LOGIC ---
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: "staff",
            },
          },
        });

        if (error) throw error;

        if (data.session === null && data.user) {
          toast.success("Pendaftaran sukses! Cek email untuk verifikasi.");
          setErrorMsg(
            "Cek email Anda dan klik link verifikasi untuk bisa login.",
          );
          setLoading(false);
        } else {
          toast.success("Pendaftaran Berhasil! Mengalihkan...");
          setIsRedirecting(true);
          router.refresh();
          setTimeout(() => {
            toast.dismiss(); // FIX 2
            router.replace("/dashboard");
          }, 800);
        }
      }
    } catch (error) {
      console.error("Auth Error:", error);
      let pesan = (error as Error).message;

      if (pesan === "Invalid login credentials")
        pesan = "Email atau password salah.";

      setErrorMsg(pesan);
      toast.error(pesan, {
        style: { border: "1px solid #EF4444", color: "#B91C1C" },
      });
      setLoading(false);
      setIsRedirecting(false);
    }
  };

  // --- FULL SCREEN LOADER STATE ---
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('/background.svg')] bg-cover bg-center" />
        <div className="z-10 flex flex-col items-center gap-4 bg-white/80 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-white/50">
          <Loader />
          <p className="text-[#01717f] text-sm font-semibold animate-pulse">
            {isRedirecting
              ? "Mengalihkan ke Dashboard..."
              : "Memproses Data..."}
          </p>
        </div>
      </div>
    );
  }

  // --- AUTH FORM UI ---
  return (
    <div className="min-h-screen flex items-center justify-center bg-white relative overflow-hidden p-4">
      {/* Background Style */}
      <div className="absolute inset-0 bg-[#01717f] z-0">
        <div className="absolute inset-0 opacity-15 bg-[url('/background.svg')] bg-cover bg-center mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-[#004a53] to-transparent opacity-90"></div>
      </div>

      <Link
        href="/"
        className="absolute top-8 left-8 text-white/80 hover:text-white flex items-center gap-2 transition-colors z-20 font-medium text-sm"
      >
        <ArrowLeft size={18} /> Kembali ke Beranda
      </Link>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-4xl flex flex-col md:flex-row min-h-[550px] relative z-10"
      >
        {/* Left Side: Visual/Branding */}
        <div className="w-full md:w-5/12 bg-slate-50 p-8 flex flex-col justify-center items-center text-center border-r border-slate-100 relative overflow-hidden">
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white rounded-2xl mb-6 shadow-md flex items-center justify-center mx-auto p-4">
              <Image
                src="/Logo.png"
                alt="Logo PLN"
                width={60}
                height={80}
                className="object-contain"
              />
            </div>
            <h2 className="text-2xl font-black text-[#01717f] mb-2">
              Monitoring ATTB
            </h2>
            <p className="text-slate-500 text-sm mb-6 px-4">
              {isLogin
                ? "Silakan masuk untuk mengakses dashboard aset."
                : "Daftarkan akun staff baru untuk memulai."}
            </p>
          </div>
          {/* Decorative Circles */}
          <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-[#01717f]/5 rounded-full blur-3xl" />
          <div className="absolute top-8 right-8 w-24 h-24 bg-[#e5b804]/10 rounded-full blur-2xl" />
        </div>

        {/* Right Side: Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 bg-white flex flex-col justify-center">
          {/* Toggle Login/Signup */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-8 w-full max-w-xs mx-auto md:mx-0">
            <button
              type="button"
              onClick={() => {
                setIsLogin(true);
                setErrorMsg("");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                isLogin
                  ? "bg-white shadow-sm text-[#01717f]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setIsLogin(false);
                setErrorMsg("");
              }}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${
                !isLogin
                  ? "bg-white shadow-sm text-[#01717f]"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              Daftar Baru
            </button>
          </div>

          <h3 className="text-2xl font-bold text-slate-800 mb-1">
            {isLogin ? "Selamat Datang" : "Buat Akun Staff"}
          </h3>
          <p className="text-slate-400 text-sm mb-6">
            {isLogin
              ? "Masukkan kredensial Anda untuk melanjutkan."
              : "Lengkapi data diri Anda di bawah ini."}
          </p>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-600 text-sm">
              <AlertTriangle size={18} className="shrink-0 mt-0.5" />
              <p>{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 ml-1">
                    Nama Lengkap
                  </label>
                  <div className="relative group">
                    <User
                      className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#e5b804] transition-colors"
                      size={18}
                    />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Nama Pegawai"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5b804] focus:border-transparent text-sm font-medium transition-all"
                      required={!isLogin}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 ml-1">
                Email Perusahaan
              </label>
              <div className="relative group">
                <Mail
                  className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#e5b804] transition-colors"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@pln.co.id"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5b804] focus:border-transparent text-sm font-medium transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1.5 ml-1">
                Password
              </label>
              <div className="relative group">
                <Lock
                  className="absolute left-3 top-3 text-slate-400 group-focus-within:text-[#e5b804] transition-colors"
                  size={18}
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#e5b804] focus:border-transparent text-sm font-medium transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#01717f] hover:bg-[#015f6b] text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-all flex justify-center items-center gap-2 mt-2 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLogin ? "Masuk Dashboard" : "Daftar Akun"}{" "}
              <ArrowRight size={18} />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
