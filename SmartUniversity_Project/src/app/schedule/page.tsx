"use client";

import Sidebar from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/card";
import { Bell, Download, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, User, BookOpen } from "lucide-react";

// ============================================================================
// CẤU HÌNH CA HỌC CHUẨN HUTECH
// ============================================================================
const shifts = [
  { id: 1, name: "Ca 1", time: "06:45 - 08:30" },
  { id: 2, name: "Ca 2", time: "09:20 - 11:35" },
  { id: 3, name: "Ca 3", time: "12:30 - 14:45" },
  { id: 4, name: "Ca 4", time: "15:05 - 17:15" },
];

const daysOfWeek = ["THỨ 2", "THỨ 3", "THỨ 4", "THỨ 5", "THỨ 6", "THỨ 7"];

// ============================================================================
// MOCK DATA
// ============================================================================
const scheduleData = {
  currentWeek: "05/01/2026 - 11/01/2026",
  classes: [
    {
      id: 1, day: "THỨ 4", shiftId: 2, subjectCode: "CBEC3203", subjectName: "Networking Applications In E-Commerce",
      group: "I02", room: "B-07.06", lecturer: "Nguyễn Quang Anh", classCode: "22BOIT02", date: "07/01/2026", period: "4", numPeriods: "3", startTime: "09:20", endTime: "11:35"
    },
    {
      id: 2, day: "THỨ 5", shiftId: 3, subjectCode: "CBSU4103", subjectName: "Security of Mobile Communication",
      group: "I02", room: "B-07.11", lecturer: "Nguyễn Minh Thi", classCode: "22BOIT02", date: "08/01/2026", period: "7", numPeriods: "3", startTime: "12:30", endTime: "14:45"
    },
    {
      id: 3, day: "THỨ 6", shiftId: 3, subjectCode: "CBWT3103", subjectName: "Wireless Technology",
      group: "I02", room: "B-07.04", lecturer: "Nguyễn Ngọc Tân", classCode: "22BOIT02", date: "09/01/2026", period: "7", numPeriods: "3", startTime: "12:30", endTime: "14:45"
    }
  ]
};

export default function SchedulePage() {
  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER */}
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">Học kỳ 2 (2025-2026)</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="font-bold text-[#1C538E] text-sm leading-tight">Nguyen Van A.</p><p className="text-[10px] text-slate-500 font-medium">MSSV: 1911062948</p></div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">NA</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-6 border-b pb-4 border-slate-200">
            <div>
              <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Lịch học / Lịch thi</h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded shadow-sm">
                  <button className="text-slate-400 hover:text-[#1C538E] p-1"><ChevronLeft size={16}/></button>
                  <span className="text-xs font-bold text-slate-700 px-3">{scheduleData.currentWeek}</span>
                  <button className="text-slate-400 hover:text-[#1C538E] p-1"><ChevronRight size={16}/></button>
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded shadow-sm hover:bg-slate-50 transition-all text-sm">Tuần này</button>
              <button className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2 px-4 rounded shadow-sm transition-all flex items-center gap-2 text-sm"><Download size={16} /> Xuất lịch</button>
            </div>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-visible">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-[#F8FAFC]">
              <CalendarIcon size={18} className="text-[#1C538E]"/>
              <h3 className="font-bold text-[#1C538E] text-sm">Thời khóa biểu trong tuần</h3>
            </div>
            
            <div className="overflow-x-auto pb-40 pt-2 px-2"> 
              <div className="min-w-[1100px]">
                
                {/* Header Ngày */}
                <div className="grid grid-cols-7 mb-2">
                  <div className="p-3 text-center text-xs font-bold text-slate-400 uppercase">Ca học</div>
                  {daysOfWeek.map((day, idx) => (
                    <div key={idx} className="p-3 text-center text-xs font-bold text-[#1C538E] uppercase bg-slate-50/50 rounded-t-lg mx-1">{day}</div>
                  ))}
                </div>

                {/* Body Lịch học */}
                <div className="relative space-y-2">
                  {shifts.map((shift, idx) => (
                    /* Thêm hover:z-40 cho dòng để đảm bảo nó luôn đè lên các dòng bên dưới khi được rê chuột vào */
                    <div key={idx} className="grid grid-cols-7 min-h-[130px] relative hover:z-40">
                      
                      <div className="p-2 flex flex-col items-center justify-center border-r border-dashed border-slate-200">
                        <span className="text-sm font-bold text-[#1C538E] bg-blue-50 px-3 py-1 rounded-full">{shift.name}</span>
                        <span className="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-1"><Clock size={12}/> {shift.time}</span>
                      </div>
                      
                      {daysOfWeek.map((day, dIdx) => {
                        const classItem = scheduleData.classes.find(c => c.day === day && c.shiftId === shift.id);
                        
                        // THUẬT TOÁN CANH LỀ TOOLTIP: Cột 1,2,3 canh trái. Cột 4,5,6 canh phải.
                        const tooltipAlignClass = dIdx >= 3 ? "right-0" : "left-0";
                        
                        return (
                          /* LỖI Z-INDEX FIXED: hover:z-50 ở chính cái ô bọc ngoài cùng này */
                          <div key={dIdx} className="p-1 border-r border-dashed border-slate-200 last:border-r-0 relative hover:z-50">
                            {classItem && (
                              /* GIAO DIỆN KHỐI: Mềm mại, bo góc lớn, màu dịu mắt chuẩn SaaS */
                              <div className="w-full h-full bg-[#F0F6FF] border-l-[3px] border-[#0059A7] rounded-md p-3 flex flex-col justify-start relative group cursor-pointer hover:bg-[#E0EEFF] transition-all duration-200 shadow-sm hover:shadow-md">
                                
                                <p className="font-bold text-[#0A2540] text-xs leading-tight mb-2 line-clamp-2">
                                  {classItem.subjectName}
                                </p>
                                <div className="space-y-1 text-[11px] text-slate-600 mt-1">
                                  <p className="flex items-center gap-1.5"><MapPin size={12} className="text-[#0059A7]"/> {classItem.room}</p>
                                  <p className="flex items-center gap-1.5 truncate"><User size={12} className="text-[#0059A7]"/> {classItem.lecturer}</p>
                                </div>
                                <div className="mt-auto pt-3 flex justify-between items-end">
                                  <span className="text-[10px] font-bold text-white bg-[#0059A7] px-2 py-0.5 rounded">{classItem.subjectCode}</span>
                                </div>

                                {/* TOOLTIP: Thiết kế lại thành dạng Card bay lơ lửng, hiệu ứng trượt lên, không dùng màu đen tuyền nữa */}
                                <div className={`absolute top-[calc(100%+8px)] ${tooltipAlignClass} w-[300px] bg-white text-slate-700 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[100] pointer-events-none flex flex-col gap-2`}>
                                  
                                  <div className="border-b border-slate-100 pb-2 mb-1">
                                    <h4 className="font-extrabold text-[#1C538E] text-sm leading-tight">{classItem.subjectName}</h4>
                                    <p className="text-xs font-bold text-slate-500 mt-1">{classItem.subjectCode} • Nhóm {classItem.group}</p>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Giảng viên</span><span className="font-semibold text-slate-800">{classItem.lecturer}</span></div>
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Phòng học</span><span className="font-semibold text-slate-800">{classItem.room}</span></div>
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Thời gian</span><span className="font-semibold text-[#0059A7]">{classItem.startTime} - {classItem.endTime}</span></div>
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Ngày học</span><span className="font-semibold text-slate-800">{classItem.date}</span></div>
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Tiết</span><span className="font-semibold text-slate-800">{classItem.period} (Số tiết: {classItem.numPeriods})</span></div>
                                    <div><span className="text-slate-400 block text-[9px] uppercase">Lớp</span><span className="font-semibold text-slate-800">{classItem.classCode}</span></div>
                                  </div>
                                </div>

                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}