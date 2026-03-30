"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, UserPlus, CheckCircle2, Loader2, User, Mail, ShieldAlert, BadgeCheck, Lock } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface BackendError { message?: string; }
interface UserInfo { userId: string; fullName: string; }

export default function AccountProvisioningPage() {
  const router = useRouter();

  // 1. STATE BẢO VỆ VÀ HYDRATION
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: "", fullName: "" });
  const [userRole, setUserRole] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [formData, setFormData] = useState({
    userId: "",
    fullName: "",
    email: "",
    roleId: 2 // Mặc định 2 là Academic Staff
  });

  // 2. ĐỌC LOCAL STORAGE VÀ PHÂN QUYỀN
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    const storedRole = localStorage.getItem("userRole");
    
    if (storedUser) setUserInfo(JSON.parse(storedUser));
    if (storedRole) setUserRole(storedRole);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    // KICK NẾU CHƯA ĐĂNG NHẬP
    if (!userInfo.userId) {
      router.push("/login");
      return;
    }

    // KICK NẾU KHÔNG PHẢI IT ADMIN
    if (userRole !== "Admin") {
      router.push("/"); 
      return;
    }
  }, [isMounted, userInfo.userId, userRole, router]);

  // 3. XỬ LÝ GỌI API TẠO TÀI KHOẢN
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await axiosClient.post("/Users/create-internal", formData);
      setMessage({ type: 'success', text: response.data.message });
      // Reset form sau khi tạo thành công
      setFormData({ userId: "", fullName: "", email: "", roleId: 2 }); 
    } catch (error) {
      const err = error as AxiosError<string | BackendError>;
      let errorText = "Lỗi khi tạo tài khoản. Vui lòng kiểm tra lại.";
      if (err.response?.data) {
        errorText = typeof err.response.data === "string" ? err.response.data : (err.response.data.message || errorText);
      }
      setMessage({ type: 'error', text: errorText });
    } finally {
      setIsLoading(false);
    }
  };

  // CHẶN RENDER KHI CHƯA MOUNT HOẶC SAI QUYỀN
  if (!isMounted || userRole !== "Admin") return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">IT Admin Portal</h2></div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">{userInfo.fullName || "System Administrator"}</p>
                <p className="text-[10px] text-slate-500 font-medium">IT Department</p>
              </div>
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">AD</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Cấp Phát Tài Khoản</h1>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Tạo tài khoản phân quyền cho Giáo vụ (Academic Staff) và Giảng viên (Lecturer).</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {message && (
                <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm border ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                  {message.type === 'success' ? <CheckCircle2 size={24} className="mt-0.5 shrink-0"/> : <ShieldAlert size={24} className="mt-0.5 shrink-0"/>}
                  <p className="font-bold text-sm mt-1 leading-relaxed">{message.text}</p>
                </div>
              )}

              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
                  <UserPlus size={18} className="text-[#1C538E]"/>
                  <h3 className="font-bold text-[#1C538E] text-sm">Form Khởi Tạo User Nội Bộ</h3>
                </div>
                
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mã Đăng Nhập (ID)</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><BadgeCheck className="h-5 w-5 text-slate-400" /></div>
                          <input 
                            type="text" required 
                            value={formData.userId} onChange={(e) => setFormData({...formData, userId: e.target.value.toUpperCase()})} 
                            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] font-bold text-slate-900 uppercase" 
                            placeholder="VD: GV001, STAFF01" 
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Phân Quyền (Role)</label>
                        <select 
                          value={formData.roleId} onChange={(e) => setFormData({...formData, roleId: Number(e.target.value)})} 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] font-bold text-slate-900 cursor-pointer"
                        >
                          <option value={2}>Academic Staff (Giáo vụ)</option>
                          <option value={3}>Lecturer (Giảng viên)</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Họ và Tên</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><User className="h-5 w-5 text-slate-400" /></div>
                        <input 
                          type="text" required 
                          value={formData.fullName} onChange={(e) => setFormData({...formData, fullName: e.target.value})} 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] font-medium text-slate-900" 
                          placeholder="VD: Nguyễn Quang Anh" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Email Nội Bộ</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none"><Mail className="h-5 w-5 text-slate-400" /></div>
                        <input 
                          type="email" required 
                          value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] font-medium text-slate-900" 
                          placeholder="email@hutech.edu.vn" 
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100">
                      <button 
                        type="submit" disabled={isLoading} 
                        className="w-full bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-3.5 rounded-lg text-sm transition-all duration-200 active:scale-[0.98] shadow-sm flex justify-center items-center gap-2 disabled:opacity-70"
                      >
                        {isLoading ? <><Loader2 size={18} className="animate-spin"/> Đang cấp tài khoản...</> : "Xác nhận Cấp Tài Khoản"}
                      </button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* BẢNG THÔNG TIN BẢO MẬT BÊN PHẢI */}
            <div className="lg:col-span-1">
              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white h-full">
                <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h3 className="font-bold text-[#1C538E] text-sm">Chính Sách Bảo Mật</h3>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
                      <div className="flex items-center gap-2 text-blue-700 font-bold text-sm mb-2">
                        <Lock size={16} /> Mật Khẩu Mặc Định
                      </div>
                      <p className="text-xs text-blue-800 leading-relaxed mb-3">Tất cả tài khoản nội bộ (Giáo vụ, Giảng viên) khi được khởi tạo sẽ sử dụng chung mật khẩu mặc định của hệ thống:</p>
                      <div className="text-center bg-white border border-blue-100 py-2 rounded text-lg font-black text-[#1C538E] tracking-widest shadow-sm">
                        123456
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-800 text-sm mb-2">Bảo Mật Lớp Đăng Nhập</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Tương tự như Sinh viên, hệ thống sẽ tự động bật cờ <span className="font-bold text-slate-700">IsFirstLogin = true</span>. Ngay trong lần đăng nhập đầu tiên, hệ thống sẽ chặn quyền truy cập Dashboard và ép buộc người dùng phải tự đổi sang mật khẩu cá nhân.
                      </p>
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">QUYỀN HẠN ROLE</p>
                      <ul className="text-xs text-slate-500 space-y-2">
                        <li className="flex items-start gap-2"><span className="text-[#0059A7] font-bold">Role 2 (Staff):</span> Quản lý Khung chương trình, Lớp học, Nhập học sinh viên.</li>
                        <li className="flex items-start gap-2"><span className="text-[#0059A7] font-bold">Role 3 (Lecturer):</span> Xem lịch dạy, nhập và lưu điểm thi.</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}