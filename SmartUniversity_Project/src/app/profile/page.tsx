"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Bell, Camera, Mail, Phone, MapPin, Briefcase, CalendarDays, Edit2, ShieldCheck, Save, Key, Send, CheckCircle2 } from "lucide-react";

interface ProfileData {
  personal: { fullName: string; studentId: string; major: string; cohort: string; startDate: string; status: string; avatar: string; };
  contact: { email: string; personalEmail: string; phone: string; address: string; };
  emergency: { name: string; relationship: string; phone: string; };
}

const initialProfileData: ProfileData = {
  personal: { fullName: "Nguyen Van A.", studentId: "1911062948", major: "Information Technology (International Program)", cohort: "K2021", startDate: "Sep 15, 2021", status: "Active", avatar: "/api/placeholder/120/120" },
  contact: { email: "nguyen.vana.hutech.oum@gmail.com", personalEmail: "nguyen.vana1999@gmail.com", phone: "(+84) 912 345 678", address: "123 Ward 25, Binh Thanh District, Ho Chi Minh City" },
  emergency: { name: "Nguyen Van B.", relationship: "Father", phone: "(+84) 987 654 321" }
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialProfileData);
  
  // State cho phần đổi mật khẩu & OTP
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleInputChange = <S extends keyof ProfileData, F extends keyof ProfileData[S]>(
    e: React.ChangeEvent<HTMLInputElement>,
    section: S,
    field: F
  ) => {
    setProfileData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: e.target.value
      }
    }));
  };

  const handleSendOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpSent(true);
    // Giả lập thông báo gửi mail thành công
    alert(`Mã OTP đã được gửi đến email: ${profileData.contact.personalEmail}`);
  };

  const handleVerifyOTP = (e: React.MouseEvent) => {
    e.preventDefault();
    setOtpVerified(true);
    alert("Đổi mật khẩu thành công!");
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]"> {/* Nền xám nhạt chuẩn HUTECH */}
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2>
          </div>
          
          <div className="flex items-center gap-6">
            <Bell size={20} className="text-slate-500 cursor-pointer hover:text-[#1C538E]" />
            <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
              <div className="text-right">
                <p className="font-bold text-[#1C538E] text-sm">{profileData.personal.fullName}</p>
                <p className="text-[10px] text-slate-500">ID: {profileData.personal.studentId}</p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm">NA</div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG CHÍNH */}
        <div className="p-8 pt-6 max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8 border-b pb-4 border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Thông tin cá nhân (Profile)</h1>
              <p className="text-sm text-slate-500 mt-1">Quản lý hồ sơ học vụ và bảo mật tài khoản.</p>
            </div>
            <div className="flex gap-3">
              {!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2 text-sm"><Edit2 size={16} /> Cập nhật hồ sơ</button>
              ) : (
                <>
                  <button onClick={() => setIsEditing(false)} className="bg-white border border-slate-300 text-red-600 font-bold py-2 px-4 rounded shadow-sm hover:bg-red-50 transition-all text-sm">Hủy</button>
                  <button onClick={() => setIsEditing(false)} className="bg-[#1C538E] hover:bg-[#154070] text-white font-bold py-2 px-4 rounded shadow-sm transition-all flex items-center gap-2 text-sm"><Save size={16} /> Lưu thay đổi</button>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* CỘT TRÁI: THÔNG TIN CƠ BẢN */}
            <div className="col-span-1 space-y-6">
              <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden pt-10 pb-6 flex flex-col items-center">
                <div className="relative mb-6">
                  <img src={profileData.personal.avatar} alt="Avatar" className="w-24 h-24 rounded-full border-4 border-slate-50 shadow-sm object-cover" />
                  <button className="absolute bottom-0 right-0 p-1.5 bg-[#1C538E] text-white rounded-full border-2 border-white hover:bg-[#154070] transition-colors"><Camera size={14} /></button>
                </div>
                <h2 className="text-lg font-bold text-[#1C538E] mb-1">{profileData.personal.fullName}</h2>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-4">MSSV: {profileData.personal.studentId}</p>
                <span className="bg-green-50 text-green-600 border border-green-200 text-[10px] font-bold px-3 py-1 rounded flex items-center gap-1.5 mb-6"><ShieldCheck size={14} /> TÌNH TRẠNG: {profileData.personal.status.toUpperCase()}</span>
                
                <div className="w-full px-6 space-y-3 pt-5 border-t border-slate-100">
                  <div className="text-sm">
                    <p className="text-slate-500 text-xs mb-0.5">Chuyên ngành</p>
                    <p className="text-slate-800 font-medium">{profileData.personal.major}</p>
                  </div>
                  <div className="text-sm">
                    <p className="text-slate-500 text-xs mb-0.5">Khóa học (Cohort)</p>
                    <p className="text-slate-800 font-medium">{profileData.personal.cohort} ({profileData.personal.startDate})</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CỘT PHẢI: LIÊN LẠC & BẢO MẬT */}
            <div className="md:col-span-2 space-y-6">
              
              {/* Card 1: Liên lạc */}
              <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h3 className="font-bold text-[#1C538E] text-sm">Thông tin liên lạc</h3>
                </div>
                <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Mail size={14}/> Email Trường (Academic)</label>
                    <input type="email" value={profileData.contact.email} readOnly className="w-full px-3 py-2.5 bg-slate-100 border border-slate-200 rounded text-sm text-slate-500 cursor-not-allowed"/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5">Email Cá nhân</label>
                    <input type="email" value={profileData.contact.personalEmail} disabled={!isEditing} onChange={(e) => handleInputChange(e, 'contact', 'personalEmail')} className={`w-full px-3 py-2.5 ${isEditing ? 'bg-white border-blue-300' : 'bg-slate-50 border-slate-200'} border rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]`}/>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><Phone size={14}/> Số điện thoại</label>
                    <input type="text" value={profileData.contact.phone} disabled={!isEditing} onChange={(e) => handleInputChange(e, 'contact', 'phone')} className={`w-full px-3 py-2.5 ${isEditing ? 'bg-white border-blue-300' : 'bg-slate-50 border-slate-200'} border rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]`}/>
                  </div>
                  <div className="col-span-2 space-y-1.5">
                    <label className="text-xs font-bold text-slate-600 flex items-center gap-1.5"><MapPin size={14}/> Địa chỉ hiện tại</label>
                    <input type="text" value={profileData.contact.address} disabled={!isEditing} onChange={(e) => handleInputChange(e, 'contact', 'address')} className={`w-full px-3 py-2.5 ${isEditing ? 'bg-white border-blue-300' : 'bg-slate-50 border-slate-200'} border rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]`}/>
                  </div>
                </CardContent>
              </Card>

              {/* Card 2: Đổi mật khẩu & OTP */}
              <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC]">
                  <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2"><Key size={16}/> Bảo mật & Đổi mật khẩu</h3>
                </div>
                <CardContent className="p-6">
                  {otpVerified ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded text-green-700 flex items-center gap-3">
                      <CheckCircle2 size={24} />
                      <div>
                        <p className="font-bold text-sm">Cập nhật thành công</p>
                        <p className="text-xs mt-0.5">Mật khẩu của bạn đã được thay đổi an toàn.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-600">Mật khẩu hiện tại</label>
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

                      {/* Khu vực OTP */}
                      <div className="pt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-500 mb-3">Để bảo mật, hệ thống cần gửi mã OTP đến email <span className="font-bold text-[#1C538E]">{profileData.contact.personalEmail}</span> để xác nhận thay đổi.</p>
                        
                        {!otpSent ? (
                          <button onClick={handleSendOTP} className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-bold py-2 px-4 rounded transition-all flex items-center gap-2 text-sm">
                            <Send size={14} /> Gửi mã OTP
                          </button>
                        ) : (
                          <div className="flex flex-col sm:flex-row items-end gap-3">
                            <div className="space-y-1.5 w-full sm:w-auto">
                              <label className="text-xs font-bold text-slate-600">Nhập mã OTP</label>
                              <input type="text" placeholder="Ví dụ: 123456" className="w-full sm:w-48 px-3 py-2.5 bg-white border border-blue-400 rounded text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#1C538E]"/>
                            </div>
                            <button onClick={handleVerifyOTP} className="w-full sm:w-auto bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2.5 px-6 rounded shadow-sm transition-all text-sm">
                              Xác nhận & Đổi mật khẩu
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}