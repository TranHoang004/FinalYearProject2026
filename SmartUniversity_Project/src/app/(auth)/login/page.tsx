"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

export default function LoginPage() {
  const router = useRouter();
  
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const response = await axiosClient.post("/Auth/login", {
        userId: userId,
        password: password
      });

      const data = response.data;

      // Lưu Token & Thông tin vào bộ nhớ trình duyệt
      localStorage.setItem("accessToken", data.token);
      localStorage.setItem("userRole", data.role || "Student");
      localStorage.setItem("userInfo", JSON.stringify(data.userInfo));

      // ====================================================================
      // LUỒNG KIỂM TRA BẢO MẬT ĐỔI MẬT KHẨU LẦN ĐẦU (FIRST LOGIN)
      // ====================================================================
      if (data.userInfo.isFirstLogin && data.role !== "Admin") {
        // Ép buộc chuyển hướng sang trang đổi mật khẩu
        router.push("/change-password");
      } else {
        // Điều hướng thông thường dựa trên Role nếu đã đổi mật khẩu
        if (data.role === "Admin" || data.role === "Staff") {
          router.push("/admin");
        } else if (data.role === "Lecturer") {
          router.push("/lecturer/grades");
        } else {
          router.push("/");
        }
      }
      
    } catch (error) {
      // Ép kiểu AxiosError an toàn
      const err = error as AxiosError<{ message?: string }>;
      console.error("Login Error:", err);

      const serverMessage = err.response?.data?.message || err.response?.data;
      
      setErrorMsg(
        typeof serverMessage === "string" 
          ? serverMessage 
          : "Tài khoản hoặc mật khẩu không chính xác."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* --- CỘT TRÁI --- */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D2B5E] to-slate-900 opacity-90 z-0"></div>
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#F2A900] rounded-full blur-[120px] opacity-20 z-0"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-[100px] opacity-20 z-0"></div>
        <div className="relative z-10 p-16 flex flex-col items-start max-w-lg">
          <div className="w-14 h-14 bg-white text-[#1C538E] font-black flex items-center justify-center rounded-xl text-3xl shadow-lg mb-8">H</div>
          <h1 className="text-4xl font-black text-white leading-tight mb-6">Smart University <br/> ERP System.</h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10">A modern, data-centric platform empowering the academic journey of HUTECH & OUM Joint Program students.</p>
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/10">
            <ShieldCheck className="text-green-400" size={24} />
            <span className="text-sm font-semibold text-slate-200">Enterprise-grade Security (JWT Authenticated)</span>
          </div>
        </div>
      </div>

      {/* --- CỘT PHẢI (FORM ĐĂNG NHẬP) --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Đăng nhập</h2>
            <p className="text-sm text-slate-500 font-medium mt-2">Nhập thông tin tài khoản HUTECH của bạn.</p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2 text-red-600">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mã Sinh Viên / Mã CBGV</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="h-4 w-4 text-slate-400" /></div>
                <input 
                  type="text" 
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1C538E] transition-all text-slate-900 font-medium" 
                  placeholder="VD: 1911062948 hoặc admin" 
                  required 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mật khẩu</label>
                <a href="#" className="text-xs font-bold text-[#0059A7] hover:text-[#004683] transition-colors">Quên mật khẩu?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Lock className="h-4 w-4 text-slate-400" /></div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1C538E] transition-all text-slate-900 font-medium" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full mt-6 bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-3.5 rounded text-sm transition-all duration-200 active:scale-[0.98] shadow-md flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
              disabled={isLoading}
            >
              {isLoading ? <><Loader2 size={18} className="animate-spin"/> Đang xác thực...</> : <>Đăng nhập <ArrowRight size={18} /></>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}