"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "../../../lib/supabaseClient";
import {
  User as UserIcon,
  Mail,
  Shield,
  Calendar,
  Camera,
  Save,
  Loader2,
  Edit3,
  CheckCircle2,
  X,
  Trash2,
  Lock,
  Key,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // State Profile
  const [updating, setUpdating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State Password
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passLoading, setPassLoading] = useState(false);

  // --- HELPER: Ambil nama file dari URL ---
  const extractFilePath = (url: string) => {
    try {
      const parts = url.split("/avatars/");
      if (parts.length < 2) return null;
      return parts[1];
    } catch (error) {
      console.error("Error parsing URL:", error);
      return null;
    }
  };

  // 1. Fetch User Data
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFullName(user.user_metadata?.full_name || "");
        setAvatarUrl(user.user_metadata?.avatar_url || null);
      }
      setLoading(false);
    };
    getUser();
  }, []);

  // 2. Fungsi Update Nama
  const handleUpdateProfile = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: fullName },
      });

      if (error) throw error;

      toast.success("Nama berhasil diperbarui!");
      setIsEditingName(false);

      const { data } = await supabase.auth.refreshSession();
      if (data.user) setUser(data.user);
    } catch (error) {
      const message = (error as Error).message;
      toast.error("Gagal update profil: " + message);
    } finally {
      setUpdating(false);
    }
  };

  // 3. Fungsi Ganti Password (BARU)
  const handlePasswordUpdate = async () => {
    // Validasi Sederhana
    if (!newPassword || !confirmPassword) {
      toast.error("Mohon isi kedua kolom password.");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password minimal 6 karakter.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Konfirmasi password tidak cocok!");
      return;
    }

    setPassLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      toast.success("Password berhasil diubah!");
      setIsChangingPassword(false);
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      const msg = (error as Error).message;
      toast.error("Gagal ganti password: " + msg);
    } finally {
      setPassLoading(false);
    }
  };

  // 4. Fungsi Upload Foto
  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    try {
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const MAX_SIZE = 2 * 1024 * 1024; // 2MB

      if (file.size > MAX_SIZE) {
        toast.error("Ukuran file max 2MB.");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setUploading(true);
      const oldAvatarUrl = avatarUrl;
      const fileExt = file.name.split(".").pop();
      const fileName = `${user?.id}-${Date.now()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Foto profil diperbarui!");

      if (oldAvatarUrl) {
        const oldPath = extractFilePath(oldAvatarUrl);
        if (oldPath) await supabase.storage.from("avatars").remove([oldPath]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Gagal upload foto.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  // 5. Fungsi Hapus Foto
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    const isConfirmed = window.confirm("Hapus foto profil?");
    if (!isConfirmed) return;

    setUploading(true);
    try {
      const pathToRemove = extractFilePath(avatarUrl);
      if (pathToRemove) {
        await supabase.storage.from("avatars").remove([pathToRemove]);
      }

      const { error } = await supabase.auth.updateUser({
        data: { avatar_url: null },
      });

      if (error) throw error;

      setAvatarUrl(null);
      toast.success("Foto profil dihapus.");
    } catch (error) {
      console.error(error);
      toast.error("Gagal menghapus foto.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-pln-primary" size={40} />
      </div>
    );
  }

  if (!user) return <div className="p-10 text-center">Anda belum login.</div>;

  const isAdmin =
    user.email?.includes("admin") || user.user_metadata?.role === "admin";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto pb-10"
    >
      {/* --- HEADER CARD --- */}
      <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden relative">
        <div className="h-48 bg-gradient-to-r from-[#01717f] to-cyan-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
          <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-20 mb-6 flex flex-col md:flex-row justify-between items-end gap-4">
            <div className="relative group">
              <div className="w-40 h-40 rounded-full border-4 border-white bg-slate-200 shadow-xl overflow-hidden relative">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <UserIcon size={64} />
                  </div>
                )}
                {uploading && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                    <Loader2 className="text-white animate-spin" />
                  </div>
                )}
              </div>

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-2 right-2 p-2.5 bg-[#e5b804] text-white rounded-full shadow-lg hover:bg-yellow-500 transition-all hover:scale-110 z-10 border-2 border-white"
                title="Ganti Foto"
                disabled={uploading}
              >
                <Camera size={20} />
              </button>

              {avatarUrl && (
                <button
                  onClick={handleRemoveAvatar}
                  disabled={uploading}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all hover:scale-110 z-10 border-2 border-white"
                  title="Hapus Foto"
                >
                  <Trash2 size={16} />
                </button>
              )}
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAvatarUpload}
              />
            </div>

            <div className="flex flex-col items-end gap-3 w-full md:w-auto">
              <div className="flex items-center gap-3">
                <div
                  className={`px-4 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold shadow-sm border ${isAdmin ? "bg-yellow-50 text-yellow-700 border-yellow-200" : "bg-slate-100 text-slate-600 border-slate-200"}`}
                >
                  <Shield size={14} />
                  {isAdmin ? "ADMINISTRATOR" : "STAFF UNIT"}
                </div>
                {!isEditingName && (
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="px-4 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-full text-xs font-bold hover:bg-slate-50 hover:text-[#01717f] hover:border-[#01717f] transition-all flex items-center gap-2 shadow-sm"
                  >
                    <Edit3 size={14} /> Edit Profil
                  </button>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono hidden md:block">
                ID: {user.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">
                  Nama Lengkap
                </label>
                <div className="flex items-center gap-3 h-12">
                  {isEditingName ? (
                    <div className="flex w-full gap-2 animate-in fade-in slide-in-from-left-2 duration-300 items-center">
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01717f] shadow-inner"
                        autoFocus
                      />
                      <button
                        onClick={handleUpdateProfile}
                        disabled={updating}
                        className="px-4 py-2 bg-[#01717f] text-white rounded-lg hover:bg-[#015f6b] flex items-center gap-2 font-medium shadow-md transition-all active:scale-95"
                      >
                        {updating ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Save size={18} />
                        )}{" "}
                        Simpan
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        className="p-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 group w-full">
                      <h1 className="text-3xl font-black text-slate-800">
                        {fullName}
                      </h1>
                      <button
                        onClick={() => setIsEditingName(true)}
                        className="p-1.5 text-slate-300 hover:text-[#01717f] hover:bg-slate-100 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Edit3 size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <p className="text-slate-500 flex items-center gap-2 mt-1">
                  <Mail size={14} /> {user.email}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-[#01717f]/30 transition-colors">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <Calendar size={16} />{" "}
                    <span className="text-xs font-bold uppercase">
                      Bergabung Sejak
                    </span>
                  </div>
                  <p className="font-semibold text-slate-700">
                    {new Date(user.created_at).toLocaleDateString("id-ID", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-200 transition-colors">
                  <div className="flex items-center gap-2 text-slate-400 mb-1">
                    <CheckCircle2 size={16} />{" "}
                    <span className="text-xs font-bold uppercase">
                      Status Akun
                    </span>
                  </div>
                  <p className="font-semibold text-emerald-600 flex items-center gap-1">
                    Aktif / Terverifikasi
                  </p>
                </div>
              </div>
            </div>

            {/* --- SECTION KEAMANAN (PASSWORD) --- */}
            <div className="md:col-span-1">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-full flex flex-col">
                <h3 className="font-bold text-slate-800 mb-4 border-b pb-2 flex items-center gap-2">
                  <Shield size={18} className="text-[#01717f]" /> Keamanan
                </h3>

                <div className="space-y-4 flex-1">
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                      Metode Login
                    </p>
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded-md border border-blue-100 inline-block">
                      Email & Password
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase font-bold mb-1">
                      Aktivitas Terakhir
                    </p>
                    <p className="text-sm text-slate-600 font-medium">
                      {user.last_sign_in_at
                        ? new Date(user.last_sign_in_at).toLocaleString("id-ID")
                        : "Baru saja"}
                    </p>
                  </div>
                </div>

                {/* --- FORM GANTI PASSWORD --- */}
                <div className="pt-4 mt-4 border-t border-dashed border-slate-200">
                  {!isChangingPassword ? (
                    <button
                      onClick={() => setIsChangingPassword(true)}
                      className="w-full py-2.5 border border-slate-300 text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-slate-800 transition-all hover:shadow-sm flex items-center justify-center gap-2"
                    >
                      <Lock size={16} /> Ubah Password
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="bg-slate-50 p-3 rounded-xl border border-slate-200"
                    >
                      <p className="text-xs font-bold text-slate-500 mb-2 uppercase">
                        Password Baru
                      </p>
                      <div className="space-y-2">
                        <input
                          type="password"
                          placeholder="Password Baru (Min 6)"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01717f]"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                          type="password"
                          placeholder="Konfirmasi Password"
                          className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#01717f]"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={handlePasswordUpdate}
                            disabled={passLoading}
                            className="flex-1 bg-[#01717f] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#015f6b] disabled:opacity-70"
                          >
                            {passLoading ? "Menyimpan..." : "Simpan"}
                          </button>
                          <button
                            onClick={() => {
                              setIsChangingPassword(false);
                              setNewPassword("");
                              setConfirmPassword("");
                            }}
                            className="px-3 bg-white border border-slate-300 text-slate-600 text-xs font-bold rounded-lg hover:bg-slate-100"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
