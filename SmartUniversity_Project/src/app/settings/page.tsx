"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Shield, Key, BellRing, Smartphone } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER TỐI GIẢN (Không còn Search) */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">Học kỳ 2 (2025-2026)</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">Nguyen Van A.</p>
                <p className="text-[10px] text-slate-500 font-medium">MSSV: 1911062948</p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">NA</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-4xl mx-auto w-full">
          <div className="mb-8 border-b pb-4 border-slate-200">
            <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Cài đặt tài khoản</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý bảo mật và các tùy chọn thông báo của bạn.</p>
          </div>

          <div className="space-y-6">
            {/* ĐỔI MẬT KHẨU */}
            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
                <Shield size={16} className="text-[#1C538E]"/>
                <h3 className="font-bold text-[#1C538E] text-sm">Bảo mật & Đổi mật khẩu</h3>
              </div>
              <CardContent className="p-6 space-y-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Key size={12}/> Mật khẩu hiện tại</label>
                  <input type="password" placeholder="••••••••" className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]"/>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Mật khẩu mới</label>
                    <input type="password" placeholder="Nhập mật khẩu mới" className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600">Xác nhận mật khẩu mới</label>
                    <input type="password" placeholder="Nhập lại mật khẩu mới" className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]"/>
                  </div>
                </div>
                <div className="pt-2">
                  <button className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-all text-sm">
                    Cập nhật mật khẩu
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* THÔNG BÁO */}
            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
                <BellRing size={16} className="text-[#1C538E]"/>
                <h3 className="font-bold text-[#1C538E] text-sm">Tùy chọn thông báo</h3>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Thông báo qua Email</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Nhận nhắc nhở học phí và cập nhật điểm số qua email.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-[#0059A7] focus:ring-[#0059A7] cursor-pointer accent-[#0059A7]" />
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-1.5"><Smartphone size={14}/> Cảnh báo qua SMS</h4>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">Nhận tin nhắn khẩn cấp (như thông báo nghỉ học đột xuất) qua SMS.</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-[#0059A7] focus:ring-[#0059A7] cursor-pointer accent-[#0059A7]" />
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </main>
    </div>
  );
}