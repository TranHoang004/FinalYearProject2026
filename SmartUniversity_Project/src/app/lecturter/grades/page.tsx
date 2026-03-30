"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Save,
  CheckCircle2,
  Loader2,
  BookOpen,
  Users,
  AlertCircle,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface ClassItem {
  classId: string;
  className: string;
  semester: string;
}

interface GradeRecord {
  studentId: string;
  fullName: string;
  processGrade: number | string;
  examGrade: number | string;
  finalGrade?: number | string;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function LecturerGradebookPage() {
  // 1. STATE FIX HYDRATION
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [students, setStudents] = useState<GradeRecord[]>([]);

  const [isLoadingClasses, setIsLoadingClasses] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 2. ĐỌC LOCAL STORAGE SAU KHI MOUNT
  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  // 3. FETCH LỚP HỌC CỦA GIẢNG VIÊN NÀY
  const fetchClasses = useCallback(async () => {
    if (!userInfo.userId) return;
    setIsLoadingClasses(true);
    try {
      const response = await axiosClient.get<ClassItem[]>("/Classes", {
        params: { lecturerId: userInfo.userId },
      });
      setClasses(response.data);
      if (response.data.length > 0) {
        setSelectedClass(response.data[0].classId);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách lớp:", error);
    } finally {
      setIsLoadingClasses(false);
    }
  }, [userInfo.userId]);

  useEffect(() => {
    if (isMounted && userInfo.userId) {
      fetchClasses();
    }
  }, [isMounted, userInfo.userId, fetchClasses]);

  // 4. FETCH DANH SÁCH SINH VIÊN TRONG LỚP
  useEffect(() => {
    const fetchStudentsInClass = async () => {
      if (!selectedClass) return;
      setIsLoadingStudents(true);
      setMessage(null);
      try {
        const response = await axiosClient.get<GradeRecord[]>(
          `/Academic/class-grades/${selectedClass}`,
        );
        // Chuyển đổi null thành chuỗi rỗng để hiển thị ô input trống
        const formattedData = response.data.map((s) => ({
          ...s,
          processGrade: s.processGrade ?? "",
          examGrade: s.examGrade ?? "",
          finalGrade: s.finalGrade ?? "",
        }));
        setStudents(formattedData);
      } catch (error) {
        console.error("Lỗi lấy danh sách sinh viên:", error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudentsInClass();
  }, [selectedClass]);

  const handleGradeChange = (
    studentId: string,
    field: "processGrade" | "examGrade",
    value: string,
  ) => {
    if (
      value !== "" &&
      (Number(value) < 0 || Number(value) > 10 || isNaN(Number(value)))
    )
      return;

    setStudents((prev) =>
      prev.map((student) => {
        if (student.studentId === studentId) {
          return { ...student, [field]: value };
        }
        return student;
      }),
    );
  };

  const handleSaveGrades = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      const payload = students.map((s) => ({
        studentId: s.studentId,
        classId: selectedClass,
        processGrade: s.processGrade !== "" ? Number(s.processGrade) : null,
        examGrade: s.examGrade !== "" ? Number(s.examGrade) : null,
      }));

      await axiosClient.put("/Academic/update-grades", payload);
      setMessage({ type: "success", text: "Đã lưu bảng điểm thành công!" });

      // Tải lại để lấy điểm FinalGrade do Backend tính
      const response = await axiosClient.get<GradeRecord[]>(
        `/Academic/class-grades/${selectedClass}`,
      );
      setStudents(
        response.data.map((s) => ({
          ...s,
          processGrade: s.processGrade ?? "",
          examGrade: s.examGrade ?? "",
          finalGrade: s.finalGrade ?? "",
        })),
      );
    } catch (error) {
      const err = error as AxiosError<{ message?: string } | string>;
      let errorText = "Lỗi khi lưu bảng điểm. Vui lòng thử lại.";
      if (err.response?.data) {
        errorText =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message || errorText;
      }
      setMessage({ type: "error", text: errorText });
    } finally {
      setIsSaving(false);
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
              Faculty Portal
            </h2>
          </div>
          <div className="flex items-center gap-5">
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
                GV
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-5xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">
                Quản Lý Bảng Điểm
              </h1>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">
                Cập nhật điểm số cho các lớp học phần được phân công.
              </p>
            </div>

            <button
              onClick={handleSaveGrades}
              disabled={isSaving || students.length === 0}
              className="flex items-center gap-2 bg-[#0059A7] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-[#004683] active:scale-95 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}{" "}
              Lưu Bảng Điểm
            </button>
          </div>

          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-start gap-3 border shadow-sm ${message.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-rose-50 border-rose-200 text-rose-700"}`}
            >
              {message.type === "success" ? (
                <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
              ) : (
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
              )}
              <p className="font-semibold text-sm">{message.text}</p>
            </div>
          )}

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden mb-6">
            <div className="p-5 flex gap-6 items-center bg-[#F8FAFC] border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-[#1C538E] shadow-sm">
                  <BookOpen size={20} />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Chọn lớp học phần
                  </label>
                  {isLoadingClasses ? (
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-2">
                      <Loader2 size={14} className="animate-spin" /> Đang tải...
                    </span>
                  ) : classes.length === 0 ? (
                    <span className="text-sm font-bold text-rose-500">
                      Chưa có lớp phân công
                    </span>
                  ) : (
                    <select
                      value={selectedClass}
                      onChange={(e) => setSelectedClass(e.target.value)}
                      className="bg-transparent text-[#1C538E] font-extrabold text-base outline-none cursor-pointer"
                    >
                      {classes.map((c) => (
                        <option key={c.classId} value={c.classId}>
                          {c.className || c.classId}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              </div>
              <div className="h-10 w-px bg-slate-200"></div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border border-slate-200 rounded-lg flex items-center justify-center text-slate-500 shadow-sm">
                  <Users size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-0.5">
                    Sĩ số lớp
                  </p>
                  <p className="font-extrabold text-slate-800 text-base">
                    {students.length}{" "}
                    <span className="text-sm font-semibold text-slate-500">
                      sinh viên
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 pl-6 w-16 text-center">STT</th>
                    <th className="p-4 w-32">Mã Sinh Viên</th>
                    <th className="p-4">Họ và Tên</th>
                    <th className="p-4 w-32 text-center">Điểm Quá Trình</th>
                    <th className="p-4 w-32 text-center">Điểm Thi</th>
                    <th className="p-4 w-32 text-center pr-6">Tổng Kết</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoadingStudents ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        <Loader2
                          className="animate-spin inline-block mr-2"
                          size={24}
                        />{" "}
                        Đang tải danh sách sinh viên...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center py-20 text-slate-400"
                      >
                        Không có sinh viên nào trong lớp này.
                      </td>
                    </tr>
                  ) : (
                    students.map((student, index) => (
                      <tr
                        key={student.studentId}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="p-4 pl-6 text-center font-semibold text-slate-400 text-sm">
                          {index + 1}
                        </td>
                        <td className="p-4 font-bold text-[#1C538E] text-sm">
                          {student.studentId}
                        </td>
                        <td className="p-4 font-bold text-slate-800 text-sm">
                          {student.fullName}
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={student.processGrade}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "processGrade",
                                e.target.value,
                              )
                            }
                            className="w-20 text-center py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0059A7]/30 focus:border-[#0059A7] font-bold text-slate-700 bg-white shadow-inner"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-4 text-center">
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="10"
                            value={student.examGrade}
                            onChange={(e) =>
                              handleGradeChange(
                                student.studentId,
                                "examGrade",
                                e.target.value,
                              )
                            }
                            className="w-20 text-center py-1.5 border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0059A7]/30 focus:border-[#0059A7] font-bold text-slate-700 bg-white shadow-inner"
                            placeholder="-"
                          />
                        </td>
                        <td className="p-4 text-center pr-6 font-black text-slate-800 text-base">
                          {student.finalGrade !== "" ? student.finalGrade : "-"}
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
