"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Medal, BookOpen, CheckSquare, Clock, AlertCircle, MapPin, ArrowRight, Loader2, CheckCircle2 } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { useRouter } from "next/navigation";

// 1. CẬP NHẬT INTERFACE: Đã BỎ Deadlines, THÊM Announcements
interface DashboardData {
  student: { firstName: string; fullName: string; id: string; major: string; term: string; todoCount: number; };
  gpa: { current: number; max: number; target: number; percent: number; trend: string; rank: string; };
  credits: { earned: number; total: number; completedPercent: string };
  courses: { current: number; totalCredits: number };
  tuition: { totalOutstanding: number };
  schedule: Array<{ id: string; name: string; code: string; time: string; location: string; }>;
  announcements: Array<{ id: number; date: string; title: string; content: string; type: string; }>;
}

interface UserInfo { userId: string; fullName: string; }

export default function Home() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: "", fullName: "" });
  const [userRole, setUserRole] = useState<string | null>(null);
  
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    const storedRole = localStorage.getItem("userRole");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
    if (storedRole) setUserRole(storedRole);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    if (!userInfo.userId) { router.push("/login"); return; }

    const fetchDashboardData = async () => {
      try {
        const response = await axiosClient.get(`/Dashboard/student/${userInfo.userId}`);
        setData(response.data);
      } catch (error) {
        console.error("Lỗi tải dữ liệu Dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userRole === "Student") fetchDashboardData();
    else setIsLoading(false);
  }, [isMounted, userInfo.userId, userRole, router]);

  if (!isMounted) return null;

  if (userRole === "Admin" || userRole === "Staff") {
    return (
      <div className="flex min-h-screen bg-[#F5F7FA]">
        <Sidebar />
        <main className="flex-1 ml-64 flex items-center justify-center h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#1C538E]">Chào mừng {userInfo.fullName}</h2>
            <p className="text-slate-500 mt-2">Vui lòng sử dụng menu bên trái để truy cập các chức năng Quản trị.</p>
          </div>
        </main>
      </div>
    );
  }

  const circleCircumference = 301.6;
  const strokeDashoffset = data ? circleCircumference - (circleCircumference * data.gpa.percent) / 100 : circleCircumference;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">ERP System</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">{data?.student.term || "Loading..."}</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="font-bold text-[#1C538E] text-sm leading-tight">{userInfo.fullName}</p><p className="text-[10px] text-slate-500 font-medium">ID: {userInfo.userId}</p></div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">ST</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-7xl mx-auto w-full">
          {isLoading ? (
            <div className="flex justify-center items-center h-[60vh] text-[#1C538E]"><Loader2 className="animate-spin mr-3" size={32} /><span className="font-bold text-lg">Đang đồng bộ dữ liệu hệ thống...</span></div>
          ) : !data ? (
            <div className="text-center py-20 text-slate-500 font-medium">Không thể tải dữ liệu Dashboard. Vui lòng thử lại.</div>
          ) : (
            <>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Welcome back, {data.student.firstName}! 👋</h1>
                  <p className="text-sm text-slate-500 mt-1.5 font-medium">Here is your academic overview for the current semester.</p>
                </div>
              </div>

              {/* LƯỚI ĐÃ ĐƯỢC CHUYỂN XUỐNG 3 CỘT (Đã xóa thẻ Deadlines) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"><CardContent className="p-5 flex items-center gap-4"><div className="w-12 h-12 rounded bg-blue-50 text-[#0059A7] flex items-center justify-center"><Medal size={24} /></div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Cumulative GPA</p><h2 className="text-2xl font-black text-slate-900">{data.gpa.current}</h2></div></CardContent></Card>
                <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"><CardContent className="p-5 flex items-center gap-4"><div className="w-12 h-12 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center"><BookOpen size={24} /></div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Credits Earned</p><div className="flex items-baseline gap-2"><h2 className="text-2xl font-black text-slate-900">{data.credits.earned}</h2><span className="text-xs font-semibold text-slate-400">/ {data.credits.total}</span></div></div></CardContent></Card>
                <Card className="rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white"><CardContent className="p-5 flex items-center gap-4"><div className="w-12 h-12 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center"><CheckSquare size={24} /></div><div><p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Courses</p><div className="flex items-baseline gap-2"><h2 className="text-2xl font-black text-slate-900">{data.courses.current}</h2><span className="text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded ml-1">Classes</span></div></div></CardContent></Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="col-span-2 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                      <CardContent className="p-6 flex justify-between items-center">
                        <div className="w-[55%]">
                          <p className="text-xs font-bold text-[#1C538E] uppercase tracking-wide flex items-center gap-2 mb-2">Academic Standing</p>
                          <div className="flex items-baseline gap-1 mt-4"><h2 className="text-4xl font-black text-slate-900">{data.gpa.current}</h2><span className="text-slate-400 font-bold">/ {data.gpa.max}</span></div>
                          <p className="text-xs text-slate-500 mt-2 font-medium">Cohort Rank: {data.gpa.rank}</p>
                        </div>
                        <div className="relative w-28 h-28 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                            <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="none" />
                            <circle cx="56" cy="56" r="48" stroke="#1C538E" strokeWidth="8" fill="none" strokeDasharray={circleCircumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" className="transition-all duration-1000 ease-in-out" />
                          </svg>
                          <div className="text-center z-10"><span className="block text-xl font-black text-[#1C538E]">{data.gpa.percent}%</span></div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className={`rounded-xl border-2 shadow-sm relative overflow-hidden ${data.tuition.totalOutstanding > 0 ? "border-red-200 bg-red-50" : "border-emerald-200 bg-emerald-50"}`}>
                      <div className={`absolute top-0 left-0 w-1.5 h-full ${data.tuition.totalOutstanding > 0 ? "bg-red-500" : "bg-emerald-500"}`}></div>
                      <CardContent className="p-6 flex flex-col justify-between h-full">
                        <div>
                          <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 mb-2 ${data.tuition.totalOutstanding > 0 ? "text-red-600" : "text-emerald-600"}`}>
                            {data.tuition.totalOutstanding > 0 ? <><AlertCircle size={14} /> Tuition Alert</> : <><CheckCircle2 size={14} /> Tuition Cleared</>}
                          </p>
                          <h2 className="text-3xl font-black text-slate-900 mt-2">{data.tuition.totalOutstanding.toLocaleString("vi-VN")} đ</h2>
                        </div>
                        {data.tuition.totalOutstanding > 0 ? (
                          <Link href="/tuition" className="mt-4 w-fit font-bold px-5 py-2.5 rounded text-sm transition-all duration-200 active:scale-[0.98] shadow-sm flex items-center gap-2 bg-[#0059A7] hover:bg-[#004683] text-white">Pay Now <ArrowRight size={14} /></Link>
                        ) : (
                          <div className="mt-4 w-fit font-bold px-5 py-2.5 rounded text-sm bg-emerald-100 text-emerald-700 flex items-center gap-2">Đã hoàn thành <CheckCircle2 size={14} /></div>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center"><h3 className="font-bold text-[#1C538E] text-sm">Today&apos;s Classes</h3><Link href="/schedule" className="text-xs font-bold text-[#0059A7] hover:underline">View All</Link></div>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {data.schedule.length === 0 ? (
                          <p className="text-sm text-slate-500 italic text-center py-4">You have no classes scheduled for today.</p>
                        ) : (
                          data.schedule.map((course) => (
                            <Link href="/schedule" key={course.id} className="block">
                              <div className="p-4 rounded-xl border border-slate-100 bg-[#F8FAFC] flex justify-between items-center group hover:bg-[#E4EFFF] hover:border-[#0059A7] transition-all cursor-pointer">
                                <div className="flex gap-4 items-center">
                                  <div className="w-12 h-12 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-[#1C538E] text-xs shadow-sm">{course.code.split("C")[1] || course.code}</div>
                                  <div>
                                    <h4 className="font-bold text-slate-800 text-sm">{course.name}</h4>
                                    <div className="flex gap-4 text-[11px] text-slate-500 font-medium mt-1"><span className="flex items-center gap-1.5"><Clock size={12} className="text-[#0059A7]" /> {course.time}</span><span className="flex items-center gap-1.5"><MapPin size={12} className="text-[#0059A7]" /> {course.location}</span></div>
                                  </div>
                                </div>
                                <button className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 group-hover:text-[#0059A7] group-hover:translate-x-1 transition-all"><ArrowRight size={18} /></button>
                              </div>
                            </Link>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* THÔNG BÁO ĐỘNG TỪ BACKEND */}
                <div className="col-span-1">
                  <Card className="rounded-xl border border-slate-200 shadow-sm h-full bg-white">
                    <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
                      <h3 className="font-bold text-[#1C538E] text-sm">Announcements</h3>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex flex-col gap-6">
                        {data.announcements.length === 0 ? (
                          <p className="text-sm text-slate-500 italic text-center">Không có thông báo mới.</p>
                        ) : (
                          data.announcements.map(ann => (
                            <div key={ann.id} className={`relative pl-4 border-l-2 ${ann.type === 'warning' ? 'border-red-500' : 'border-[#0059A7]'}`}>
                              <p className="text-[10px] font-bold text-slate-400 mb-1">{ann.date}</p>
                              <h4 className="font-bold text-sm text-slate-800 mb-1">{ann.title}</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">{ann.content}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}