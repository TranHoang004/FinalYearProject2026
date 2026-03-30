"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Camera,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Bell,
  AlertCircle,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  roleName: string;
  isActive: boolean;
  adminClassId: string | null;
  majorId: string | null;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function ProfilePage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // ĐỌC LOCAL STORAGE SAU KHI MOUNT
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  // GỌI API LẤY DỮ LIỆU
  const fetchProfile = useCallback(async () => {
    if (!userInfo.userId) return; // Chỉ gọi khi đã có userId
    try {
      const response = await axiosClient.get("/Users", {
        params: { keyword: userInfo.userId },
      });
      const userList = response.data.data;
      if (userList && userList.length > 0) {
        setProfileData(userList[0]);
      }
    } catch (error) {
      console.error("Lỗi lấy dữ liệu Profile:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo.userId]);

  // Kích hoạt fetchProfile khi isMounted và userInfo.userId đã sẵn sàng
  useEffect(() => {
    if (isMounted && userInfo.userId) {
      fetchProfile();
    }
  }, [isMounted, userInfo.userId, fetchProfile]);

  // CHẶN RENDER KHI CHƯA MOUNT HOẶC ĐANG LOAD
  if (!isMounted || isLoading || !profileData) {
    return (
      <div className="flex min-h-screen bg-[#F5F7FA] items-center justify-center">
        <Loader2 className="animate-spin text-[#1C538E]" size={40} />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">
              ERP System
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <Bell
              size={20}
              className="text-slate-500 cursor-pointer hover:text-[#1C538E]"
            />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="font-bold text-[#1C538E] text-sm">
                  {profileData.fullName}
                </p>
                <p className="text-[10px] text-slate-500">
                  ID: {profileData.userId}
                </p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm">
                US
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8 border-b pb-4 border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">
                Hồ Sơ Cá Nhân
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Thông tin tài khoản được quản lý bởi Hệ thống ERP.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-1 space-y-6">
              <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden pt-10 pb-6 flex flex-col items-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm bg-slate-200 flex items-center justify-center text-slate-400 font-bold text-2xl">
                    {profileData.fullName.charAt(0)}
                  </div>
                  <button className="absolute bottom-0 right-0 p-1.5 bg-[#1C538E] text-white rounded-full border-2 border-white hover:bg-[#154070] transition-colors">
                    <Camera size={14} />
                  </button>
                </div>
                <h2 className="text-lg font-bold text-[#1C538E] mb-1 text-center px-4">
                  {profileData.fullName}
                </h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">
                  ID: {profileData.userId}
                </p>

                {profileData.isActive ? (
                  <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1.5 mb-6">
                    <CheckCircle2 size={14} /> HOẠT ĐỘNG
                  </span>
                ) : (
                  <span className="bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1.5 mb-6">
                    <AlertCircle size={14} /> TÀI KHOẢN KHÓA
                  </span>
                )}

                <div className="w-full px-6 space-y-3 pt-5 border-t border-slate-100">
                  <div className="text-sm flex justify-between">
                    <span className="text-slate-500 text-xs">Phân quyền:</span>
                    <span className="text-[#1C538E] font-bold">
                      {profileData.roleName}
                    </span>
                  </div>
                  {profileData.roleName === "Student" && (
                    <>
                      <div className="text-sm flex justify-between">
                        <span className="text-slate-500 text-xs">
                          Mã Ngành:
                        </span>
                        <span className="text-slate-800 font-bold">
                          {profileData.majorId || "N/A"}
                        </span>
                      </div>
                      <div className="text-sm flex justify-between">
                        <span className="text-slate-500 text-xs">
                          Lớp Hành Chính:
                        </span>
                        <span className="text-slate-800 font-bold">
                          {profileData.adminClassId || "Chưa xếp lớp"}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            <div className="md:col-span-2 space-y-6">
              <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h3 className="font-bold text-[#1C538E] text-sm">
                    Thông Tin Liên Hệ (Đã đồng bộ DB)
                  </h3>
                </div>
                <CardContent className="p-6 grid grid-cols-1 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                      <Mail size={14} /> Email Hệ Thống
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded text-sm text-slate-500 font-semibold outline-none cursor-not-allowed"
                    />
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded text-blue-700 text-sm flex gap-3 mt-2">
                    <ShieldCheck size={20} className="shrink-0 mt-0.5" />
                    <p>
                      Dữ liệu hồ sơ của bạn được quản lý và bảo mật bởi Hệ thống
                      ERP. Nếu có sai sót về Lớp hành chính hoặc Email, vui lòng
                      liên hệ Giáo vụ (Academic Staff) để được cập nhật.
                    </p>
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
