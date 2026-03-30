"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/card";
import { Bell, Lock, Unlock, Loader2, BookOpen, Search } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface ClassItem {
  classId: string;
  className: string;
  subjectId: string;
  lecturerId: string | null;
  semester: string;
  maxStudents: number;
  isGradebookLocked: boolean;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function ClassManagementPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  const fetchClasses = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get<ClassItem[]>("/Classes");
      setClasses(response.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách lớp:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isMounted) fetchClasses();
  }, [isMounted]);

  const handleToggleLock = async (classId: string, currentStatus: boolean) => {
    const actionName = currentStatus ? "MỞ KHÓA" : "KHÓA SỔ";
    if (
      !confirm(
        `Bạn có chắc chắn muốn ${actionName} bảng điểm của lớp ${classId} không?`,
      )
    )
      return;

    setProcessingId(classId);
    try {
      const response = await axiosClient.put(`/Classes/${classId}/toggle-lock`);
      // Cập nhật lại UI trực tiếp
      setClasses((prev) =>
        prev.map((c) =>
          c.classId === classId
            ? { ...c, isGradebookLocked: !c.isGradebookLocked }
            : c,
        ),
      );
    } catch (error) {
      const err = error as AxiosError<{ message?: string } | string>;
      let errorMsg = "Có lỗi xảy ra.";
      if (err.response?.data) {
        errorMsg =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || errorMsg;
      }
      alert(errorMsg);
    } finally {
      setProcessingId(null);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">
              Academic Portal
            </h2>
          </div>
          <div className="flex items-center gap-5">
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50">
              <Bell size={20} />
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">
                  {userInfo.fullName || "Giáo vụ"}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">
                  Academic Staff
                </p>
              </div>
              <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">
                AS
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-6xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">
              Quản Lý Lớp Học Phần
            </h1>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">
              Theo dõi danh sách lớp, kiểm tra phân công và thao tác khóa sổ
              bảng điểm.
            </p>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
              <div className="relative w-72">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Tìm mã lớp hoặc tên môn..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded text-sm focus:outline-none focus:border-[#0059A7]"
                />
              </div>
            </div>

            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 pl-6">Mã Lớp</th>
                    <th className="p-4">Tên Lớp (Môn)</th>
                    <th className="p-4">Giảng Viên</th>
                    <th className="p-4 text-center">Sĩ Số Max</th>
                    <th className="p-4 text-center">Sổ Điểm</th>
                    <th className="p-4 text-right pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        <Loader2
                          className="animate-spin inline-block mr-2"
                          size={24}
                        />{" "}
                        Đang tải danh sách lớp...
                      </td>
                    </tr>
                  ) : classes.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        Chưa có lớp học phần nào.
                      </td>
                    </tr>
                  ) : (
                    classes.map((cls) => (
                      <tr
                        key={cls.classId}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 pl-6 font-bold text-[#1C538E] text-sm">
                          {cls.classId}
                        </td>
                        <td className="p-4 font-bold text-slate-800 text-sm flex items-center gap-2">
                          <BookOpen size={16} className="text-slate-400" />{" "}
                          {cls.className || cls.subjectId}
                        </td>
                        <td className="p-4 text-sm font-medium text-slate-600">
                          {cls.lecturerId || (
                            <span className="text-rose-500 text-xs italic">
                              Chưa phân công
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-center font-semibold text-slate-700">
                          {cls.maxStudents}
                        </td>
                        <td className="p-4 text-center">
                          {cls.isGradebookLocked ? (
                            <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-600 text-[10px] font-bold border border-rose-200 flex items-center gap-1 justify-center w-fit mx-auto">
                              <Lock size={12} /> ĐÃ KHÓA
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 flex items-center gap-1 justify-center w-fit mx-auto">
                              <Unlock size={12} /> MỞ
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button
                            onClick={() =>
                              handleToggleLock(
                                cls.classId,
                                cls.isGradebookLocked,
                              )
                            }
                            disabled={processingId === cls.classId}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors flex items-center gap-1.5 ml-auto disabled:opacity-50 shadow-sm ${
                              cls.isGradebookLocked
                                ? "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                : "bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200"
                            }`}
                          >
                            {processingId === cls.classId ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : cls.isGradebookLocked ? (
                              <Unlock size={14} />
                            ) : (
                              <Lock size={14} />
                            )}
                            {cls.isGradebookLocked ? "Mở Khóa" : "Khóa Sổ"}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
