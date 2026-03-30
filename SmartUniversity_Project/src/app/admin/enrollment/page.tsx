"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  UserPlus,
  CheckCircle2,
  Loader2,
  User,
  Mail,
  BookOpen,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface BackendError {
  message?: string;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function StudentEnrollmentPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [successData, setSuccessData] = useState<{
    mssv: string;
    assignedClass: string;
    name: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    personalEmail: "",
    majorId: "IT",
  });

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccessData(null);

    try {
      const response = await axiosClient.post(
        "/Academic/enroll-student",
        null,
        {
          params: {
            fullName: formData.fullName,
            personalEmail: formData.personalEmail,
            majorId: formData.majorId,
          },
        },
      );

      setSuccessData({
        mssv: response.data.mssv,
        assignedClass: response.data.assignedClass,
        name: formData.fullName,
      });

      setFormData({ fullName: "", personalEmail: "", majorId: "IT" });
    } catch (error) {
      const err = error as AxiosError<string | BackendError>;
      let errorMessage = "Có lỗi xảy ra khi tạo hồ sơ sinh viên.";
      if (err.response?.data) {
        errorMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || errorMessage;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">
              Academic Portal
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">
                  {userInfo.fullName || "Giáo vụ"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Admissions Office
                </p>
              </div>
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AS
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-4xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">
              Student Enrollment
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Tạo hồ sơ Tân sinh viên, hệ thống sẽ tự động cấp MSSV và phân vào
              lớp hành chính.
            </p>
          </div>

          {successData && (
            <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 className="text-emerald-800 font-bold text-lg mb-1">
                  Nhập học thành công!
                </h3>
                <p className="text-sm text-emerald-700 mb-3">
                  Tài khoản sinh viên đã được khởi tạo trên hệ thống ERP.
                </p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2 bg-white p-4 rounded-lg border border-emerald-100">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Họ và tên
                    </p>
                    <p className="font-bold text-slate-800">
                      {successData.name}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Lớp Hành Chính
                    </p>
                    <p className="font-bold text-[#0059A7]">
                      {successData.assignedClass}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Mã Sinh Viên (Tài khoản)
                    </p>
                    <p className="font-black text-[#1C538E] text-lg">
                      {successData.mssv}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Mật khẩu mặc định
                    </p>
                    <p className="font-bold text-slate-800">123456</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
              <UserPlus size={18} className="text-[#1C538E]" />
              <h3 className="font-bold text-[#1C538E] text-sm">
                Form Nhập Liệu Tân Sinh Viên
              </h3>
            </div>

            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                    Họ và tên sinh viên
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-slate-400" />
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] transition-all text-slate-900 font-medium"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Email cá nhân
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.personalEmail}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            personalEmail: e.target.value,
                          })
                        }
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] transition-all text-slate-900 font-medium"
                        placeholder="nva@gmail.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                      Ngành trúng tuyển
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-slate-400" />
                      </div>
                      <select
                        value={formData.majorId}
                        onChange={(e) =>
                          setFormData({ ...formData, majorId: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#0059A7]/20 focus:border-[#0059A7] transition-all text-slate-900 font-bold appearance-none cursor-pointer"
                      >
                        <option value="IT">Công nghệ thông tin</option>
                        <option value="BA">Quản trị kinh doanh</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-3.5 rounded-lg text-sm transition-all duration-200 active:scale-[0.98] shadow-sm flex justify-center items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 size={18} className="animate-spin" /> Đang khởi
                        tạo hồ sơ...
                      </>
                    ) : (
                      "Xác nhận & Khởi tạo Tài khoản"
                    )}
                  </button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
