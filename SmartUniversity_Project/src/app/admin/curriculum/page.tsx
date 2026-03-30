"use client";

import { useState, useEffect, useRef } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card } from "@/components/ui/card";
import { Plus, Book, Copy, Trash2, Loader2, UploadCloud, FileSpreadsheet, CheckCircle2 } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface SubjectInCurriculum {
  subjectId: string;
  subjectName: string;
  credits: number;
  knowledgeBlock: string;
  isCompulsory: boolean;
}

interface BackendError {
  message?: string;
}

export default function CurriculumManagement() {
  const [curriculum, setCurriculum] = useState<SubjectInCurriculum[]>([]);
  const [majorId, setMajorId] = useState("IT");
  const [cohort, setCohort] = useState("K2025");
  const [isLoading, setIsLoading] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  
  // State phục vụ Import Excel
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // LẤY DỮ LIỆU KHUNG CHƯƠNG TRÌNH
  const fetchCurriculum = async () => {
    setIsLoading(true);
    try {
      const response = await axiosClient.get<SubjectInCurriculum[]>("/Academic/curriculums", {
        params: { majorId, cohort }
      });
      setCurriculum(response.data);
    } catch (error) {
      console.error("Lỗi fetch khung chương trình:", error);
      setCurriculum([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchCurriculum(); }, [majorId, cohort]);

  // NHÂN BẢN KHUNG CHƯƠNG TRÌNH
  const handleCloneCurriculum = async () => {
    const newCohort = prompt("Nhập niên khóa mới (VD: K2026):");
    if (!newCohort) return;

    setIsCloning(true);
    try {
      await axiosClient.post("/Academic/clone-curriculum", null, {
        params: { majorId, oldCohort: cohort, newCohort }
      });
      alert(`Đã nhân bản thành công từ ${cohort} sang ${newCohort}`);
      setCohort(newCohort);
    } catch (error) {
      const err = error as AxiosError<BackendError>;
      const errorMessage = err.response?.data?.message || err.response?.data || "Lỗi nhân bản khung chương trình";
      alert(typeof errorMessage === 'string' ? errorMessage : "Có lỗi xảy ra");
    } finally {
      setIsCloning(false);
    }
  };

  // =========================================================
  // XỬ LÝ IMPORT FILE EXCEL LÊN BACKEND C#
  // =========================================================
  const handleImportExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng file cơ bản ở Frontend
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert("Vui lòng chọn file định dạng Excel (.xlsx hoặc .xls)");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsImporting(true);
    try {
      // Gửi file bằng form-data
      const response = await axiosClient.post("/Academic/import-subjects", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      alert(response.data.message || "Import thành công!");
      fetchCurriculum(); // Tải lại danh sách môn học ngay sau khi import xong
    } catch (error) {
      const err = error as AxiosError<BackendError | string>;
      let errorMsg = "Lỗi khi import file Excel.";
      if (err.response?.data) {
        errorMsg = typeof err.response.data === "string" ? err.response.data : (err.response.data.message || errorMsg);
      }
      alert(errorMsg);
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Xóa bộ nhớ đệm của input file để có thể chọn lại cùng 1 file
      }
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <h2 className="font-bold text-[#1C538E] text-lg">Academic Management</h2>
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded">Staff Mode</span>
            <div className="w-9 h-9 bg-slate-800 rounded-full flex items-center justify-center text-white font-bold text-sm">AS</div>
          </div>
        </header>

        <div className="p-8 pt-8 max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Curriculum Structure</h1>
              <p className="text-sm text-slate-500 mt-1.5 font-medium">Định nghĩa môn học, tải lên danh sách bằng Excel và nhân bản chương trình.</p>
            </div>
            
            <div className="flex gap-3">
              {/* NÚT CLONE */}
              <button 
                onClick={handleCloneCurriculum}
                disabled={isCloning}
                className="flex items-center gap-2 bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                {isCloning ? <Loader2 className="animate-spin" size={16}/> : <Copy size={16} />} Clone to New Cohort
              </button>

              {/* INPUT FILE ẨN VÀ NÚT IMPORT EXCEL */}
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImportExcel} 
                accept=".xlsx, .xls" 
                className="hidden" 
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="flex items-center gap-2 bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-emerald-100 active:scale-95 transition-all shadow-sm disabled:opacity-50"
              >
                {isImporting ? <Loader2 className="animate-spin" size={16}/> : <FileSpreadsheet size={16} />} 
                {isImporting ? "Đang xử lý..." : "Import Excel"}
              </button>

              {/* NÚT THÊM THỦ CÔNG */}
              <button className="flex items-center gap-2 bg-[#0059A7] text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:bg-[#004683] active:scale-95 transition-all shadow-sm">
                <Plus size={16} /> Thêm Thủ Công
              </button>
            </div>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm bg-white overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex gap-4 bg-[#F8FAFC]">
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Major (Ngành)</label>
                <select 
                  value={majorId} onChange={(e) => setMajorId(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-[#1C538E]/20"
                >
                  <option value="IT">Công nghệ thông tin</option>
                  <option value="BA">Quản trị kinh doanh</option>
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Cohort (Khóa)</label>
                <select 
                  value={cohort} onChange={(e) => setCohort(e.target.value)}
                  className="bg-white border border-slate-200 text-slate-700 text-sm font-bold py-2 px-4 rounded-lg outline-none focus:ring-2 focus:ring-[#1C538E]/20"
                >
                  <option value="K2025">K2025</option>
                  <option value="K2026">K2026</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 pl-6">Mã Môn</th>
                    <th className="p-4">Tên Môn Học</th>
                    <th className="p-4">Khối Kiến Thức</th>
                    <th className="p-4 text-center">Tín Chỉ</th>
                    <th className="p-4 text-center">Loại</th>
                    <th className="p-4 text-right pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={6} className="text-center py-20 text-slate-400"><Loader2 className="animate-spin inline-block mr-2" size={24}/> Đang tải danh sách...</td></tr>
                  ) : curriculum.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-20 text-slate-500">
                        <div className="flex flex-col items-center gap-3">
                          <UploadCloud size={40} className="text-slate-300"/>
                          <p>Chưa có dữ liệu cho Ngành và Khóa này.</p>
                          <p className="text-xs text-slate-400">Hãy dùng nút <strong>Import Excel</strong> phía trên để tải dữ liệu lên nhanh chóng.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    curriculum.map((item) => (
                      <tr key={item.subjectId} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-[#1C538E] text-sm">{item.subjectId}</td>
                        <td className="p-4 font-bold text-slate-800 text-sm">{item.subjectName}</td>
                        <td className="p-4 text-xs font-medium text-slate-500">{item.knowledgeBlock || "Chuyên ngành"}</td>
                        <td className="p-4 text-center font-bold text-slate-700">{item.credits}</td>
                        <td className="p-4 text-center">
                          {item.isCompulsory ? (
                            <span className="px-2 py-1 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-100">BẮT BUỘC</span>
                          ) : (
                            <span className="px-2 py-1 rounded bg-slate-50 text-slate-500 text-[10px] font-bold border border-slate-100">TỰ CHỌN</span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6">
                          <button className="text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={18} /></button>
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