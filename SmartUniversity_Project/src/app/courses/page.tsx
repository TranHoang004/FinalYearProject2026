"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ShoppingCart, Lock, Plus, Trash2 } from "lucide-react";

interface Course {
  id: string; name: string; credits: number; tuition: number; enrolled: number; capacity: number; status: string; prereq?: string;
}

const availableCourses: Course[] = [
  { id: "ML501", name: "Học máy nâng cao", credits: 3, tuition: 3500000, enrolled: 35, capacity: 40, status: "available" },
  { id: "CC405", name: "Kiến trúc Điện toán đám mây", credits: 4, tuition: 4200000, enrolled: 40, capacity: 40, status: "full" },
  { id: "SA410", name: "Bảo mật phần mềm doanh nghiệp", credits: 3, tuition: 3500000, enrolled: 12, capacity: 30, status: "locked", prereq: "Yêu cầu: IT310" },
  { id: "PM201", name: "Quản lý dự án IT", credits: 3, tuition: 3000000, enrolled: 25, capacity: 50, status: "available" },
];

export default function CourseRegistration() {
  const [cart, setCart] = useState<Course[]>([]);
  const addToCart = (course: Course) => { if (!cart.find(c => c.id === course.id)) setCart([...cart, course]); };
  const removeFromCart = (courseId: string) => { setCart(cart.filter(c => c.id !== courseId)); };
  const totalCredits = cart.reduce((sum, course) => sum + course.credits, 0);
  const totalTuition = cart.reduce((sum, course) => sum + course.tuition, 0);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
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
          <div className="mb-8 border-b pb-4 border-slate-200">
            <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Đăng ký học phần</h1>
            <p className="text-sm text-slate-500 mt-1">Lựa chọn các môn học cho học kỳ sắp tới.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  <div className="col-span-5">Môn học</div><div className="col-span-2 text-center">Tín chỉ</div><div className="col-span-2 text-right">Học phí</div><div className="col-span-2 text-center">Sĩ số</div><div className="col-span-1 text-right">Thao tác</div>
                </div>
                <div className="divide-y divide-slate-100">
                  {availableCourses.map((course) => {
                    const isAdded = cart.find(c => c.id === course.id);
                    const percentFull = (course.enrolled / course.capacity) * 100;
                    let barColor = "bg-emerald-500";
                    if (percentFull > 80) barColor = "bg-orange-400";
                    if (percentFull === 100) barColor = "bg-red-500";

                    return (
                      <div key={course.id} className={`grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors ${isAdded ? 'bg-blue-50/30' : ''}`}>
                        <div className="col-span-5">
                          <h4 className="font-bold text-slate-800 text-sm leading-tight">{course.name}</h4>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{course.id}</p>
                          {course.prereq && <p className="text-[10px] text-red-600 font-bold mt-1 bg-red-50 inline-block px-1.5 py-0.5 rounded tracking-wider">{course.prereq}</p>}
                        </div>
                        <div className="col-span-2 text-center font-semibold text-slate-600 text-sm">{course.credits}</div>
                        <div className="col-span-2 text-right font-bold text-slate-800 text-sm">{course.tuition.toLocaleString()} đ</div>
                        <div className="col-span-2 px-2">
                          <div className="flex justify-between items-center mb-1.5"><span className="text-xs font-bold text-slate-600">{course.enrolled}/{course.capacity}</span></div>
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentFull}%` }}></div></div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          {course.status === "full" ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed">Đầy</button>
                          : course.status === "locked" ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed flex items-center gap-1"><Lock size={12}/> Khóa</button>
                          : isAdded ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed">Đã chọn</button>
                          : <button onClick={() => addToCart(course)} className="px-4 py-2 bg-[#0059A7] hover:bg-[#004683] text-white font-bold rounded text-xs transition-colors shadow-sm flex items-center gap-1"><Plus size={14}/> Chọn</button>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
            
            {/* GIỎ HÀNG */}
            <div className="lg:col-span-1">
              <Card className="rounded-xl border border-slate-200 shadow-sm sticky top-24 bg-white">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                    <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2">Môn đã chọn</h3>
                    <span className="bg-[#1C538E] text-white text-xs font-bold px-2.5 py-0.5 rounded">{cart.length}</span>
                  </div>
                  {cart.length === 0 ? (
                    <div className="py-8 flex flex-col items-center text-center"><ShoppingCart size={32} className="text-slate-200 mb-3" /><p className="text-slate-400 font-medium text-xs">Chưa có môn học nào được chọn.</p></div>
                  ) : (
                    <div className="space-y-3 mb-6">
                      {cart.map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-3 rounded border border-slate-100 bg-slate-50">
                          <div><h4 className="font-bold text-slate-800 text-xs">{item.id}</h4><p className="text-[10px] text-slate-500 font-medium">{item.name}</p></div>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-medium">Tổng tín chỉ:</span><span className="font-bold text-slate-800">{totalCredits}</span></div>
                    <div className="flex justify-between items-center text-sm mb-6"><span className="text-slate-500 font-medium">Tạm tính:</span><span className="font-black text-[#1C538E] text-lg">{totalTuition.toLocaleString()} đ</span></div>
                    <button disabled={cart.length === 0} className={`w-full font-bold py-3 rounded text-sm transition-all shadow-sm ${cart.length > 0 ? "bg-[#1C538E] hover:bg-[#154070] text-white" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}>Gửi đăng ký</button>
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