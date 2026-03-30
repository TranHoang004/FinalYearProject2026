"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/card";
import {
  Bell,
  Download,
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  User,
  Search,
  Loader2,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

const shifts = [
  { id: 1, name: "Shift 1", time: "06:45 - 08:30" },
  { id: 2, name: "Shift 2", time: "09:20 - 11:35" },
  { id: 3, name: "Shift 3", time: "12:30 - 14:45" },
  { id: 4, name: "Shift 4", time: "15:05 - 17:15" },
];
const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface ScheduleClass {
  id: string;
  day: string;
  shiftId: number;
  subjectCode: string;
  subjectName: string;
  group: string;
  room: string;
  lecturer: string;
  classCode: string;
  date: string;
  period: string;
  numPeriods: string;
  startTime: string;
  endTime: string;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function SchedulePage() {
  // 1. STATE HYDRATION FIX
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });
  const [userRole, setUserRole] = useState<string>("Student");

  const [classes, setClasses] = useState<ScheduleClass[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTargetId, setSearchTargetId] = useState("");

  // 2. ĐỌC DỮ LIỆU TỪ LOCAL STORAGE
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));

    const role = localStorage.getItem("userRole");
    if (role) setUserRole(role);
  }, []);

  const fetchSchedule = useCallback(
    async (targetId: string, currentRole: string) => {
      if (!targetId) return;
      setIsLoading(true);
      try {
        const response = await axiosClient.get<ScheduleClass[]>(
          "/Academic/schedule",
          {
            params: { userId: targetId, role: currentRole },
          },
        );
        setClasses(response.data);
      } catch (error) {
        console.error("Lỗi lấy thời khóa biểu:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    if (isMounted && userInfo.userId) {
      fetchSchedule(userInfo.userId, userRole);
    }
  }, [isMounted, userInfo.userId, userRole, fetchSchedule]);

  const handleStaffSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSchedule(searchTargetId, userRole);
  };

  // 3. CHẶN RENDER ĐẦU TIÊN
  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-20 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">
              ERP System
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">
              Spring 2026
            </div>
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
                {userRole === "Staff"
                  ? "AS"
                  : userRole === "Lecturer"
                    ? "GV"
                    : "ST"}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6 border-b pb-4 border-slate-200 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">
                {userRole === "Lecturer"
                  ? "Lịch Trình Giảng Dạy"
                  : userRole === "Staff" || userRole === "Admin"
                    ? "Quản Lý Lịch Trình"
                    : "Thời Khóa Biểu"}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {(userRole === "Staff" || userRole === "Admin") && (
                <form onSubmit={handleStaffSearch} className="relative flex">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={16}
                  />
                  <input
                    type="text"
                    placeholder="Nhập MSSV / Mã GV..."
                    value={searchTargetId}
                    onChange={(e) => setSearchTargetId(e.target.value)}
                    className="pl-9 pr-4 py-2 border border-slate-300 rounded-l shadow-sm text-sm focus:outline-none focus:border-[#1C538E]"
                  />
                  <button
                    type="submit"
                    className="bg-[#1C538E] text-white px-3 py-2 rounded-r font-bold text-sm"
                  >
                    Tìm
                  </button>
                </form>
              )}

              <button className="bg-white border border-slate-300 text-slate-700 font-bold py-2 px-4 rounded shadow-sm hover:bg-slate-50 transition-all text-sm">
                This Week
              </button>
              <button className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2 px-4 rounded shadow-sm transition-all flex items-center gap-2 text-sm">
                <Download size={16} /> Export
              </button>
            </div>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-visible">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2 bg-[#F8FAFC]">
              <CalendarIcon size={18} className="text-[#1C538E]" />
              <h3 className="font-bold text-[#1C538E] text-sm">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Đang tải dữ
                    liệu...
                  </span>
                ) : (
                  "Weekly Timetable"
                )}
              </h3>
            </div>

            <div className="overflow-x-auto pb-40 pt-2 px-2">
              <div className="min-w-[1100px]">
                <div className="grid grid-cols-7 mb-2">
                  <div className="p-3 text-center text-xs font-bold text-slate-400 uppercase">
                    Shift
                  </div>
                  {daysOfWeek.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-3 text-center text-xs font-bold text-[#1C538E] uppercase bg-slate-50/50 rounded-t-lg mx-1"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                <div className="relative space-y-2">
                  {shifts.map((shift, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-7 min-h-[130px] relative hover:z-40"
                    >
                      <div className="p-2 flex flex-col items-center justify-center border-r border-dashed border-slate-200">
                        <span className="text-sm font-bold text-[#1C538E] bg-blue-50 px-3 py-1 rounded-full">
                          {shift.name}
                        </span>
                        <span className="text-[11px] font-medium text-slate-500 mt-2 flex items-center gap-1">
                          <Clock size={12} /> {shift.time}
                        </span>
                      </div>

                      {daysOfWeek.map((day, dIdx) => {
                        const classItem = classes.find(
                          (c) => c.day === day && c.shiftId === shift.id,
                        );
                        const tooltipAlignClass =
                          dIdx >= 3 ? "right-0" : "left-0";

                        return (
                          <div
                            key={dIdx}
                            className="p-1 border-r border-dashed border-slate-200 last:border-r-0 relative hover:z-50"
                          >
                            {classItem && (
                              <div
                                className={`w-full h-full border-l-[3px] rounded-md p-3 flex flex-col justify-start relative group cursor-pointer transition-all duration-200 shadow-sm hover:shadow-md
                                ${userRole === "Lecturer" ? "bg-[#FFF5F5] border-rose-500 hover:bg-[#FFEBEB]" : "bg-[#F0F6FF] border-[#0059A7] hover:bg-[#E0EEFF]"}`}
                              >
                                <p className="font-bold text-[#0A2540] text-xs leading-tight mb-2 line-clamp-2">
                                  {classItem.subjectName}
                                </p>
                                <div className="space-y-1 text-[11px] text-slate-600 mt-1">
                                  <p className="flex items-center gap-1.5">
                                    <MapPin
                                      size={12}
                                      className={
                                        userRole === "Lecturer"
                                          ? "text-rose-500"
                                          : "text-[#0059A7]"
                                      }
                                    />{" "}
                                    {classItem.room}
                                  </p>
                                  <p className="flex items-center gap-1.5 truncate">
                                    <User
                                      size={12}
                                      className={
                                        userRole === "Lecturer"
                                          ? "text-rose-500"
                                          : "text-[#0059A7]"
                                      }
                                    />{" "}
                                    {classItem.lecturer}
                                  </p>
                                </div>
                                <div className="mt-auto pt-3 flex justify-between items-end">
                                  <span
                                    className={`text-[10px] font-bold text-white px-2 py-0.5 rounded ${userRole === "Lecturer" ? "bg-rose-500" : "bg-[#0059A7]"}`}
                                  >
                                    {classItem.subjectCode}
                                  </span>
                                </div>

                                <div
                                  className={`absolute top-[calc(100%+8px)] ${tooltipAlignClass} w-[300px] bg-white text-slate-700 p-4 rounded-xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border border-slate-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-[100] pointer-events-none flex flex-col gap-2`}
                                >
                                  <div className="border-b border-slate-100 pb-2 mb-1">
                                    <h4 className="font-extrabold text-[#1C538E] text-sm leading-tight">
                                      {classItem.subjectName}
                                    </h4>
                                    <p className="text-xs font-bold text-slate-500 mt-1">
                                      {classItem.subjectCode} • Lớp{" "}
                                      {classItem.group}
                                    </p>
                                  </div>
                                  <div className="grid grid-cols-2 gap-y-2 text-[11px]">
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase">
                                        Lecturer
                                      </span>
                                      <span className="font-semibold text-slate-800">
                                        {classItem.lecturer}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase">
                                        Room
                                      </span>
                                      <span className="font-semibold text-slate-800">
                                        {classItem.room}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase">
                                        Time
                                      </span>
                                      <span className="font-semibold text-[#0059A7]">
                                        {classItem.startTime} -{" "}
                                        {classItem.endTime}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase">
                                        Date
                                      </span>
                                      <span className="font-semibold text-slate-800">
                                        {classItem.date}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-slate-400 block text-[9px] uppercase">
                                        Class
                                      </span>
                                      <span className="font-semibold text-slate-800">
                                        {classItem.classCode}
                                      </span>
                                    </div>
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
