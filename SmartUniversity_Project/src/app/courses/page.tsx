"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, ShoppingCart, Lock, Plus, Trash2, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface Course { 
  id: string; name: string; credits: number; tuition: number; 
  enrolled: number; capacity: number; status: "available" | "full" | "locked"; prereq?: string; 
}
interface UserInfo { userId: string; fullName: string; }

export default function CourseRegistration() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: "", fullName: "" });

  // STATE ĐỂ NHẬN DỮ LIỆU MỞ/ĐÓNG TỪ API
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false); 
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  const [availableCourses, setAvailableCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  // KIỂM TRA TRẠNG THÁI CỔNG ĐĂNG KÝ TRƯỚC
  const checkRegistrationStatus = useCallback(async () => {
    try {
      const response = await axiosClient.get("/Academic/registration-status");
      setIsRegistrationOpen(response.data.isOpen);
    } catch (error) {
      console.error("Lỗi kiểm tra cổng đăng ký:", error);
    } finally {
      setIsCheckingStatus(false);
    }
  }, []);

  const fetchCourses = useCallback(async () => {
    if (!isRegistrationOpen) return; // Đóng cửa thì không tải môn
    setIsLoading(true);
    try {
      const response = await axiosClient.get<Course[]>("/Academic/available-classes/HK1");
      setAvailableCourses(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách lớp:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isRegistrationOpen]);

  // Luồng chạy: Kiểm tra trạng thái cổng -> Cổng mở thì Fetch Lớp học
  useEffect(() => {
    if (isMounted) checkRegistrationStatus();
  }, [isMounted, checkRegistrationStatus]);

  useEffect(() => {
    if (isMounted && !isCheckingStatus && isRegistrationOpen) {
      fetchCourses();
    }
  }, [isMounted, isCheckingStatus, isRegistrationOpen, fetchCourses]);

  const addToCart = (course: Course) => { 
    if (!cart.find(c => c.id === course.id)) setCart([...cart, course]); 
  };
  const removeFromCart = (courseId: string) => setCart(cart.filter(c => c.id !== courseId));
  
  const totalCredits = cart.reduce((sum, course) => sum + course.credits, 0);
  const totalTuition = cart.reduce((sum, course) => sum + course.tuition, 0);

  const handleSubmitRegistration = async () => {
    if (!userInfo.userId) return alert("Vui lòng đăng nhập!");
    setIsSubmitting(true);
    setMessage(null);

    try {
      const registrationPromises = cart.map(course => 
        axiosClient.post("/Student/register-course", null, {
          params: { studentId: userInfo.userId, classId: course.id }
        })
      );
      await Promise.all(registrationPromises);
      setMessage({ type: 'success', text: `Đăng ký thành công ${cart.length} môn học! Hóa đơn đã được tạo.` });
      setCart([]); 
      fetchCourses(); 
    } catch (error) {
      const err = error as AxiosError<{message?: string} | string>;
      let errorText = "Lỗi hệ thống khi đăng ký môn. Vui lòng kiểm tra lại.";
      if (err.response?.data) errorText = typeof err.response.data === "string" ? err.response.data : (err.response.data.message || errorText);
      setMessage({ type: 'error', text: errorText });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">ERP System</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">Spring 2026</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">{userInfo.fullName}</p>
                <p className="text-[10px] text-slate-500 font-medium">ID: {userInfo.userId}</p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">ST</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-7xl mx-auto w-full">
          <div className="mb-8 border-b pb-4 border-slate-200">
            <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Course Registration</h1>
            <p className="text-sm text-slate-500 mt-1">Lựa chọn các môn học cho học kỳ sắp tới.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} className="mt-0.5 shrink-0"/> : <AlertCircle size={20} className="mt-0.5 shrink-0"/>}
              <p className="font-semibold text-sm">{message.text}</p>
            </div>
          )}

          {/* HIỂN THỊ CĂN CỨ VÀO TRẠNG THÁI TỪ API */}
          {isCheckingStatus ? (
            <div className="flex justify-center items-center h-40 text-[#1C538E]"><Loader2 className="animate-spin mr-2"/> Đang kiểm tra hệ thống...</div>
          ) : !isRegistrationOpen ? (
            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white py-24">
              <div className="flex flex-col items-center justify-center text-slate-500">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6"><Lock size={32} className="text-slate-400" /></div>
                <h3 className="text-2xl font-bold text-[#1C538E] mb-2">Cổng Đăng Ký Đã Khóa</h3>
                <p className="text-sm text-center max-w-md font-medium leading-relaxed">Hệ thống đăng ký học phần hiện chưa tới thời gian mở hoặc đã kết thúc. Vui lòng theo dõi thông báo từ Phòng Đào Tạo.</p>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
                  <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-[#F8FAFC] border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                    <div className="col-span-5">Course Details</div><div className="col-span-2 text-center">Credits</div><div className="col-span-2 text-right">Fee</div><div className="col-span-2 text-center">Capacity</div><div className="col-span-1 text-right">Action</div>
                  </div>
                  
                  <div className="divide-y divide-slate-100">
                    {isLoading ? (
                      <div className="py-20 flex justify-center items-center text-slate-400"><Loader2 className="animate-spin mr-2" size={24}/> Đang tải lớp học...</div>
                    ) : availableCourses.length === 0 ? (
                      <div className="py-20 text-center text-slate-400 font-medium">Không có lớp nào đang mở trong học kỳ này.</div>
                    ) : (
                      availableCourses.map((course) => {
                        const isAdded = cart.find(c => c.id === course.id);
                        const percentFull = course.capacity > 0 ? (course.enrolled / course.capacity) * 100 : 0;
                        let barColor = "bg-emerald-500";
                        if (percentFull > 80) barColor = "bg-orange-400";
                        if (percentFull >= 100) barColor = "bg-red-500";

                        return (
                          <div key={course.id} className={`grid grid-cols-12 gap-4 px-6 py-5 items-center hover:bg-slate-50/50 transition-colors ${isAdded ? 'bg-blue-50/30' : ''}`}>
                            <div className="col-span-5">
                              <h4 className="font-bold text-slate-800 text-sm leading-tight">{course.name}</h4>
                              <p className="text-xs text-slate-500 font-medium mt-0.5">{course.id}</p>
                            </div>
                            <div className="col-span-2 text-center font-semibold text-slate-600 text-sm">{course.credits}</div>
                            <div className="col-span-2 text-right font-bold text-slate-800 text-sm">{course.tuition.toLocaleString('vi-VN')} đ</div>
                            <div className="col-span-2 px-2">
                              <div className="flex justify-between items-center mb-1.5"><span className="text-xs font-bold text-slate-600">{course.enrolled}/{course.capacity}</span></div>
                              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full ${barColor} rounded-full`} style={{ width: `${percentFull}%` }}></div></div>
                            </div>
                            <div className="col-span-1 flex justify-end">
                              {course.status === "full" ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed">Full</button>
                              : course.status === "locked" ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed flex items-center gap-1"><Lock size={12}/> Locked</button>
                              : isAdded ? <button disabled className="px-4 py-2 bg-slate-100 text-slate-400 font-bold rounded text-xs cursor-not-allowed">Added</button>
                              : <button onClick={() => addToCart(course)} className="px-4 py-2 bg-[#0059A7] hover:bg-[#004683] text-white font-bold rounded text-xs transition-all duration-200 active:scale-95 shadow-sm flex items-center gap-1"><Plus size={14}/> Add</button>}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </Card>
              </div>
              
              <div className="lg:col-span-1">
                <Card className="rounded-xl border border-slate-200 shadow-sm sticky top-24 bg-white">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-100">
                      <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2">Selected Courses</h3>
                      <span className="bg-[#1C538E] text-white text-xs font-bold px-2.5 py-0.5 rounded">{cart.length}</span>
                    </div>
                    {cart.length === 0 ? (
                      <div className="py-8 flex flex-col items-center text-center"><ShoppingCart size={32} className="text-slate-200 mb-3" /><p className="text-slate-400 font-medium text-xs">No courses selected yet.</p></div>
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
                      <div className="flex justify-between items-center text-sm"><span className="text-slate-500 font-medium">Total Credits:</span><span className="font-bold text-slate-800">{totalCredits}</span></div>
                      <div className="flex justify-between items-center text-sm mb-6"><span className="text-slate-500 font-medium">Estimated Fee:</span><span className="font-black text-[#1C538E] text-lg">{totalTuition.toLocaleString('vi-VN')} đ</span></div>
                      <button 
                        onClick={handleSubmitRegistration}
                        disabled={cart.length === 0 || isSubmitting} 
                        className={`w-full font-bold py-3 flex justify-center items-center gap-2 rounded text-sm transition-all duration-200 shadow-sm ${cart.length > 0 && !isSubmitting ? "bg-[#0059A7] hover:bg-[#004683] text-white active:scale-[0.98]" : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
                      >
                        {isSubmitting ? <><Loader2 size={16} className="animate-spin"/> Processing...</> : "Submit Registration"}
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}