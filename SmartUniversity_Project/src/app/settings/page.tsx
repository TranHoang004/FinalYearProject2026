"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Shield,
  Key,
  BellRing,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

// Định nghĩa Interface để tránh dùng 'any'
interface UserInfo {
  userId: string;
  fullName: string;
}

export default function SettingsPage() {
  // 1. STATE TRÁNH LỖI HYDRATION
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [passwords, setPasswords] = useState({ old: "", new: "", confirm: "" });

  // 2. CHỈ ĐỌC LOCAL STORAGE Ở CLIENT-SIDE
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) {
      setUserInfo(JSON.parse(storedUser));
    }
  }, []);

  const handleUpdatePassword = async () => {
    setMessage(null);
    if (passwords.new !== passwords.confirm)
      return setMessage({
        type: "error",
        text: "Mật khẩu xác nhận không khớp.",
      });
    if (passwords.new.length < 6)
      return setMessage({
        type: "error",
        text: "Mật khẩu mới phải có ít nhất 6 ký tự.",
      });

    setIsUpdating(true);
    try {
      await axiosClient.post("/Auth/change-initial-password", {
        userId: userInfo.userId,
        oldPassword: passwords.old,
        newPassword: passwords.new,
      });
      setMessage({ type: "success", text: "Cập nhật mật khẩu thành công!" });
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (error) {
      const err = error as AxiosError<{ message?: string } | string>;
      let errText = "Lỗi khi đổi mật khẩu.";
      if (err.response?.data)
        errText =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || errText;
      setMessage({ type: "error", text: errText });
    } finally {
      setIsUpdating(false);
    }
  };

  // 3. CHẶN RENDER TRƯỚC KHI MOUNT ĐỂ TRÁNH LỖI HYDRATION
  if (!isMounted) return null;

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
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">
                  {userInfo.fullName}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  ID: {userInfo.userId}
                </p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                ST
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-4xl mx-auto w-full">
          <div className="mb-8 border-b pb-4 border-slate-200">
            <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">
              Cài Đặt Hệ Thống
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý bảo mật và tùy chọn thông báo cá nhân.
            </p>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-xl flex items-start gap-3 shadow-sm border ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              )}
              <p className="font-bold text-sm">{message.text}</p>
            </div>
          )}

          <div className="space-y-6">
            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
                <Shield size={16} className="text-[#1C538E]" />
                <h3 className="font-bold text-[#1C538E] text-sm">
                  Đổi Mật Khẩu
                </h3>
              </div>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">
                    <Key size={12} /> Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={passwords.old}
                    onChange={(e) =>
                      setPasswords({ ...passwords, old: e.target.value })
                    }
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1C538E]"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      Mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.new}
                      onChange={(e) =>
                        setPasswords({ ...passwords, new: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1C538E]"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">
                      Xác nhận mật khẩu mới
                    </label>
                    <input
                      type="password"
                      value={passwords.confirm}
                      onChange={(e) =>
                        setPasswords({ ...passwords, confirm: e.target.value })
                      }
                      className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-[#1C538E]"
                      required
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    onClick={handleUpdatePassword}
                    disabled={isUpdating || !passwords.old || !passwords.new}
                    className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-all duration-200 active:scale-[0.98] text-sm flex items-center gap-2 disabled:opacity-70"
                  >
                    {isUpdating ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : null}{" "}
                    {isUpdating ? "Đang lưu..." : "Cập Nhật Mật Khẩu"}
                  </button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
                <BellRing size={16} className="text-[#1C538E]" />
                <h3 className="font-bold text-[#1C538E] text-sm">
                  Tùy Chọn Thông Báo
                </h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">
                      Nhận thông báo qua Email
                    </h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                      Hệ thống sẽ gửi nhắc nhở học phí và kết quả điểm thi.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    defaultChecked
                    className="w-5 h-5 rounded border-slate-300 cursor-pointer accent-[#0059A7]"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
