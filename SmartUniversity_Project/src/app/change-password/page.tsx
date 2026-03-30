"use client";

import { useState, useEffect } from "react";
import { Lock, ArrowRight, ShieldAlert, Loader2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export default function ForceChangePasswordPage() {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const userInfo = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem("userInfo") || "{}") 
    : {};

  useEffect(() => {
    // Nếu vô tình lọt vào đây mà không có isFirstLogin, đá về Login
    if (!userInfo.isFirstLogin) {
      router.push("/login");
    }
  }, [userInfo, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (newPassword !== confirmPassword) {
      return setErrorMsg("Mật khẩu xác nhận không khớp.");
    }
    if (newPassword.length < 6) {
      return setErrorMsg("Mật khẩu mới phải có ít nhất 6 ký tự.");
    }

    setIsLoading(true);
    try {
      await axiosClient.post("/Auth/change-initial-password", {
        userId: userInfo.userId,
        oldPassword: oldPassword,
        newPassword: newPassword
      });

      setSuccessMsg("Đổi mật khẩu thành công! Đang chuyển hướng đến hệ thống...");
      
      // Cập nhật lại localStorage để tắt cờ first login ở Frontend
      const updatedUserInfo = { ...userInfo, isFirstLogin: false };
      localStorage.setItem("userInfo", JSON.stringify(updatedUserInfo));

      // Chuyển hướng sau 2 giây
      setTimeout(() => {
        const role = localStorage.getItem("userRole");
        if (role === "Staff") router.push("/admin");
        else if (role === "Lecturer") router.push("/lecturer/grades");
        else router.push("/");
      }, 2000);

    } catch (error) {
      const err = error as AxiosError<string | {message?: string}>;
      let text = "Có lỗi xảy ra khi đổi mật khẩu.";
      if (err.response?.data) {
        text = typeof err.response.data === "string" ? err.response.data : (err.response.data.message || text);
      }
      setErrorMsg(text);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-900 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D2B5E] to-slate-900 opacity-90 z-0"></div>
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#F2A900] rounded-full blur-[120px] opacity-20 z-0"></div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl relative z-10">
        <div className="mb-6 text-center flex flex-col items-center">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mb-4">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-2xl font-black text-[#1C538E] tracking-tight">Bảo Mật Tài Khoản</h2>
          <p className="text-sm text-slate-500 font-medium mt-2">Đây là lần đăng nhập đầu tiên của bạn. Vui lòng đổi mật khẩu mặc định để bảo vệ tài khoản.</p>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm font-medium text-center">
            {errorMsg}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-bold flex items-center justify-center gap-2">
            <CheckCircle2 size={18}/> {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mật khẩu hiện tại (Mặc định)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-slate-400" /></div>
              <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#1C538E]" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mật khẩu mới</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-slate-400" /></div>
              <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#1C538E]" required />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Xác nhận mật khẩu mới</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-slate-400" /></div>
              <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:border-[#1C538E]" required />
            </div>
          </div>

          <button 
            type="submit" disabled={isLoading || successMsg !== ""}
            className="w-full mt-6 bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-3 rounded text-sm transition-all duration-200 shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
          >
            {isLoading ? <><Loader2 size={18} className="animate-spin"/> Đang xử lý...</> : <>Đổi Mật Khẩu <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  );
}