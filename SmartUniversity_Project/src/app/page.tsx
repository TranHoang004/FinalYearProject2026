"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Medal, BookOpen, CheckSquare, Clock, AlertCircle, MapPin, ArrowRight } from "lucide-react";

const dashboardData = {
  student: { firstName: "Nguyen", fullName: "Nguyen Van A.", id: "1911062948", major: "IT Major", term: "Học kỳ 2 (2025-2026)", todoCount: 3 },
  gpa: { current: 3.85, max: 4.0, target: 3.5, percent: 96, trend: "+ 0.05", rank: "Top 5%" },
  credits: { earned: 86, total: 120, completedPercent: "71%" },
  courses: { current: 5, totalCredits: 15 },
  deadlines: { upcoming: 3, nextTask: "Đồ án Machine Learning" },
  tuition: { totalOutstanding: 16500000 },
  schedule: [
    { id: 1, name: "Networking Applications In E-Commerce", code: "CBEC3203", time: "09:20 - 11:35", location: "Phòng B-07.06" },
    { id: 2, name: "Security of Mobile Communication", code: "CBSU4103", time: "12:30 - 14:45", location: "Phòng B-07.11" },
  ]
};

export default function Home() {
  const circleCircumference = 301.6;
  const strokeDashoffset = circleCircumference - (circleCircumference * dashboardData.gpa.percent) / 100;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">{dashboardData.student.term}</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="font-bold text-[#1C538E] text-sm leading-tight">{dashboardData.student.fullName}</p><p className="text-[10px] text-slate-500 font-medium">MSSV: {dashboardData.student.id}</p></div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">NA</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Xin chào, {dashboardData.student.firstName}! 👋</h1>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Tổng quan học tập của bạn trong học kỳ hiện tại.</p>
            </div>
            <button className="flex items-center gap-2 bg-white text-[#1C538E] border border-slate-200 px-4 py-2 rounded shadow-sm hover:bg-slate-50 transition-all font-bold text-sm">
              <CheckSquare size={16} /> Việc cần làm <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded ml-1">{dashboardData.student.todoCount}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-blue-50 text-[#0059A7] flex items-center justify-center"><Medal size={24} /></div>
                <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Điểm Tích Lũy</p><h2 className="text-2xl font-black text-slate-900">{dashboardData.gpa.current}</h2></div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><BookOpen size={24} /></div>
                <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tín Chỉ</p><div className="flex items-baseline gap-2"><h2 className="text-2xl font-black text-slate-900">{dashboardData.credits.earned}</h2><span className="text-xs font-semibold text-slate-400">/ {dashboardData.credits.total}</span></div></div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center"><CheckSquare size={24} /></div>
                <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Đang Học</p><div className="flex items-baseline gap-2"><h2 className="text-2xl font-black text-slate-900">{dashboardData.courses.current}</h2><span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded ml-1">Môn</span></div></div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded bg-rose-50 text-rose-500 flex items-center justify-center"><Clock size={24} /></div>
                <div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hạn Chót</p><h2 className="text-2xl font-black text-slate-900">{dashboardData.deadlines.upcoming}</h2></div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="col-span-2 space-y-8">
              
              {/* Row: GPA + Tuition */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div className="w-[55%]">
                      <p className="text-xs font-bold text-[#1C538E] uppercase tracking-wide flex items-center gap-2 mb-2">Tiến Độ Tích Lũy</p>
                      <div className="flex items-baseline gap-1 mt-4"><h2 className="text-4xl font-black text-slate-900">{dashboardData.gpa.current}</h2><span className="text-slate-400 font-bold">/ {dashboardData.gpa.max}</span></div>
                      <p className="text-xs text-slate-500 mt-2 font-medium">Xếp hạng: {dashboardData.gpa.rank}</p>
                    </div>
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                        <circle cx="56" cy="56" r="48" stroke="#1C538E" strokeWidth="8" fill="none" strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
                      </svg>
                      <div className="text-center z-10"><span className="block text-xl font-black text-[#1C538E]">{dashboardData.gpa.percent}%</span></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-xl border border-red-200 shadow-sm bg-red-50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                  <CardContent className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <p className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5 mb-2"><AlertCircle size={14} /> Cảnh Báo Công Nợ</p>
                      <h2 className="text-3xl font-black text-slate-900 mt-2">{dashboardData.tuition.totalOutstanding.toLocaleString('vi-VN')} đ</h2>
                    </div>
                    <button className="mt-4 w-fit bg-[#0059A7] hover:bg-[#004683] text-white font-bold px-5 py-2.5 rounded text-sm transition-all shadow-sm flex items-center gap-2">
                      Thanh toán ngay <ArrowRight size={14} />
                    </button>
                  </CardContent>
                </Card>
              </div>

              {/* ĐÃ THÊM LẠI: LỊCH HỌC HÔM NAY */}
              <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="font-bold text-[#1C538E] text-sm">Lịch học hôm nay</h3>
                  <span className="text-xs font-bold text-[#0059A7] cursor-pointer hover:underline">Xem tất cả</span>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {dashboardData.schedule.map((course) => (
                      <div key={course.id} className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC] flex justify-between items-center group hover:bg-[#E4EFFF] hover:border-[#0059A7] transition-all cursor-pointer">
                        <div className="flex gap-4 items-center">
                          <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-[#1C538E] text-xs shadow-sm">
                            {course.code.split('C')[1] || course.code} 
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-slate-800 text-sm">{course.name}</h4>
                            </div>
                            <div className="flex gap-4 text-[11px] text-slate-500 font-medium mt-1">
                              <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#0059A7]"/> {course.time}</span>
                              <span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#0059A7]"/> {course.location}</span>
                            </div>
                          </div>
                        </div>
                        <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#0059A7] transition-colors">
                          <ArrowRight size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

            </div>

            {/* ĐÃ THÊM LẠI: THÔNG BÁO (Bên cột phải) */}
            <div className="col-span-1">
               <Card className="rounded-xl border border-slate-200 shadow-sm h-full bg-white">
                <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
                  <h3 className="font-bold text-[#1C538E] text-sm">Thông báo</h3>
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-6">
                    <div className="relative pl-4 border-l-2 border-[#F2A900]">
                      <p className="text-[10px] font-bold text-slate-400 mb-1">05 THÁNG 1, 2026</p>
                      <h4 className="font-bold text-sm text-slate-800 mb-1">Nhắc nhở đóng học phí</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Sinh viên vui lòng hoàn tất học phí Học kỳ 2 trước ngày 15/01 để không bị hủy đăng ký môn học.</p>
                    </div>
                    <div className="relative pl-4 border-l-2 border-[#0059A7]">
                      <p className="text-[10px] font-bold text-slate-400 mb-1">02 THÁNG 1, 2026</p>
                      <h4 className="font-bold text-sm text-slate-800 mb-1">Lịch nghỉ Tết Nguyên Đán</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">Toàn trường nghỉ Tết từ ngày 28/01 đến hết 15/02. Các lớp học trực tuyến cũng tạm ngưng.</p>
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