"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Download, Medal, BookOpen, TrendingUp, CheckCircle2, XCircle } from "lucide-react";

const gradesData = {
  summary: { cumulativeGpa: 3.85, totalCredits: 86, totalRequired: 120, termGpa: 3.90 },
  term: "Học kỳ 2 - 2025-2026",
  courses: [
    { code: "ML501", name: "Học máy nâng cao (Advanced ML)", credits: 3, process: 90, exam: 92, final: 91, status: "Pass" },
    { code: "SA402", name: "Bảo mật phần mềm doanh nghiệp", credits: 3, process: 85, exam: 88, final: 87, status: "Pass" },
    { code: "PM201", name: "Quản lý dự án Agile", credits: 3, process: 88, exam: 90, final: 89, status: "Pass" },
    { code: "DS301", name: "Nền tảng Khoa học Dữ liệu", credits: 3, process: 92, exam: 94, final: 93, status: "Pass" },
    { code: "NT201", name: "Mạng máy tính", credits: 3, process: 45, exam: 40, final: 42, status: "Retake" }, 
    { code: "WD402", name: "Phát triển Web nâng cao", credits: 3, process: 87, exam: 89, final: 88, status: "Pass" },
  ]
};

export default function GradesPage() {
  const percentCompleted = Math.round((gradesData.summary.totalCredits / gradesData.summary.totalRequired) * 100);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">{gradesData.term}</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="font-bold text-[#1C538E] text-sm leading-tight">Nguyen Van A.</p><p className="text-[10px] text-slate-500 font-medium">MSSV: 1911062948</p></div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">NA</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div><h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Bảng điểm học tập (Transcript)</h1><p className="text-sm text-slate-500 mt-1">Sinh viên: Nguyen Van A. • MSSV: 1911062948</p></div>
            <div className="flex gap-3">
              <select className="bg-white border border-slate-300 text-slate-700 text-sm font-bold py-2 px-4 rounded shadow-sm outline-none focus:ring-1 focus:ring-[#1C538E] cursor-pointer">
                <option>{gradesData.term}</option><option>Học kỳ 1 - 2025-2026</option><option>Tất cả học kỳ</option>
              </select>
              {/* Nút Tải PDF đổi sang Xanh Sáng HUTECH */}
              <button className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2 px-4 rounded shadow-sm transition-all flex items-center gap-2 text-sm">
                <Download size={16} /> Tải bản PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Điểm trung bình (GPA)</p><div className="flex items-baseline gap-1 mt-2"><h2 className="text-4xl font-black text-[#1C538E]">{gradesData.summary.cumulativeGpa}</h2><span className="text-slate-400 font-bold">/ 4.0</span></div></div>
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#1C538E]"><Medal size={20} /></div>
                </div>
                <div className="mt-4 flex gap-2"><span className="text-[10px] font-bold bg-blue-50 text-[#1C538E] border border-blue-100 px-2 py-0.5 rounded uppercase tracking-wider">Học bổng</span><span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider">Top 5% Khóa</span></div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div><p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Tín chỉ tích lũy</p><div className="flex items-baseline gap-1 mt-2"><h2 className="text-4xl font-black text-slate-900">{gradesData.summary.totalCredits}</h2><span className="text-slate-400 font-bold text-lg">/ {gradesData.summary.totalRequired}</span></div></div>
                  <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600"><BookOpen size={20} /></div>
                </div>
                {/* Đổi thanh tiến trình thành Xanh Lá Mạ (Emerald) */}
                <div className="mt-5 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percentCompleted}%` }}></div>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2">Hoàn thành {percentCompleted}% chương trình</p>
              </CardContent>
            </Card>

            <Card className="rounded-xl border-none shadow-md bg-[#1C538E]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div><p className="text-xs font-bold text-blue-200 uppercase tracking-widest">GPA Học kỳ này</p><div className="flex items-baseline gap-2 mt-2"><h2 className="text-4xl font-black text-white">{gradesData.summary.termGpa}</h2></div></div>
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-white"><TrendingUp size={20} /></div>
                </div>
                <p className="text-xs text-emerald-300 font-bold mt-5 flex items-center gap-1">↑ Tăng 0.05 so với kỳ trước</p>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-[#F8FAFC]">
              <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2"><Medal size={16} /> Kết quả học tập - {gradesData.term}</h3>
            </div>
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Mã MH</div><div className="col-span-4">Tên Môn Học</div><div className="col-span-1 text-center">Tín chỉ</div><div className="col-span-1 text-center">Quá trình</div><div className="col-span-1 text-center">Cuối kỳ</div><div className="col-span-2 text-center text-slate-800">Điểm Tổng</div><div className="col-span-1 text-right">Trạng thái</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {gradesData.courses.map((course, idx) => (
                <div key={idx} className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                  <div className="col-span-2 font-bold text-slate-800 text-sm">{course.code}</div>
                  <div className="col-span-4 text-slate-600 text-sm font-medium">{course.name}</div>
                  <div className="col-span-1 text-center text-slate-500 text-sm font-semibold">{course.credits}</div>
                  <div className="col-span-1 text-center text-slate-600 font-medium text-sm">{course.process}</div>
                  <div className="col-span-1 text-center text-slate-600 font-medium text-sm">{course.exam}</div>
                  <div className="col-span-2 text-center"><span className={`text-base font-black ${course.status === 'Pass' ? 'text-[#1C538E]' : 'text-red-600'}`}>{course.final}</span></div>
                  <div className="col-span-1 flex justify-end">
                    {course.status === 'Pass' ? <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1"><CheckCircle2 size={12} /> ĐẠT</span> : <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1"><XCircle size={12} /> HỌC LẠI</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-[#F8FAFC] px-6 py-4 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-600">Tổng kết học kỳ</span>
              <div className="flex gap-8">
                <div className="text-right"><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Tín chỉ đạt</p><p className="text-lg font-black text-[#1C538E]">15</p></div>
                <div className="text-right"><p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Điểm Trung Bình (GPA)</p><p className="text-lg font-black text-[#1C538E]">3.90</p></div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}