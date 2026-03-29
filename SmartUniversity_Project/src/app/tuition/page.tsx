"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, AlertCircle, Download, ArrowRight, Loader2, Receipt } from "lucide-react";

export default function TuitionAndInvoices() {
  // State quản lý hiệu ứng Loading khi bấm Thanh toán
  const [isProcessing, setIsProcessing] = useState(false);

  // Hàm xử lý Thanh toán (Chuẩn bị cho API Sandbox)
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Giả lập thời gian chờ gọi API Backend (2 giây)
    setTimeout(() => {
      setIsProcessing(false);
      
      // Đoạn này sau này bạn sẽ thay bằng mã:
      // const response = await axios.post('/api/payments/create-url', { amount: 16500000 });
      // window.location.href = response.data.checkoutUrl;
      
      alert("🔗 [Mô phỏng API]: Đã nhận URL từ Backend. Đang chuyển hướng sang cổng VNPay/MoMo Sandbox...");
    }, 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        
        {/* HEADER TỐI GIẢN (Đã xóa thanh Search) */}
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">Hệ thống Quản lý ERP</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">Học kỳ 2 (2025-2026)</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="font-bold text-[#1C538E] text-sm leading-tight">Nguyen Van A.</p>
                <p className="text-[10px] text-slate-500 font-medium">MSSV: 1911062948</p>
              </div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">NA</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-6xl mx-auto w-full">
          <div className="mb-8 border-b pb-4 border-slate-200">
            <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">Học phí & Hóa đơn</h1>
            <p className="text-sm text-slate-500 mt-1">Quản lý tài chính học vụ và lịch sử thanh toán.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* THẺ NỢ HỌC PHÍ */}
            <Card className="rounded-xl border border-red-200 bg-white shadow-sm overflow-hidden">
              <CardContent className="p-6 relative flex flex-col justify-between h-full">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500"></div>
                <div className="mb-6">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertCircle size={14} /> Tổng dư nợ hiện tại
                  </p>
                  <h2 className="text-4xl font-black text-slate-900 mt-3 tracking-tight">16,500,000 VNĐ</h2>
                </div>
                
                {/* NÚT THANH TOÁN CÓ HIỆU ỨNG LOADING */}
                <button 
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className={`w-fit px-8 py-3 rounded text-sm font-bold transition-all shadow-sm flex justify-center items-center gap-2 
                    ${isProcessing 
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200" 
                      : "bg-[#0059A7] hover:bg-[#004683] text-white"
                    }`}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Đang khởi tạo giao dịch...
                    </>
                  ) : (
                    <>
                      Thanh toán qua cổng điện tử <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-slate-200 bg-white shadow-sm">
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lịch sử thanh toán</p>
                  <div className="mt-5 space-y-4">
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-medium">Tổng đã nộp</span>
                      <span className="text-lg font-bold text-[#1C538E]">13,650,000 VNĐ</span>
                    </div>
                    <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-medium">Số giao dịch thành công</span>
                      <span className="text-lg font-bold text-[#1C538E]">3</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-[#F8FAFC]">
              <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2">
                <Receipt size={16} /> Hóa đơn gần đây
              </h3>
              <button className="text-xs font-bold text-[#0059A7] hover:text-[#004683] flex items-center gap-1.5 transition-colors">
                <Download size={14} /> Tải sao kê
              </button>
            </div>
            
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Chi tiết hóa đơn</div><div className="col-span-3">Hạn nộp</div><div className="col-span-2 text-right">Số tiền</div><div className="col-span-2 text-center">Trạng thái</div>
            </div>

            <div className="divide-y divide-slate-100 bg-white">
              <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-5">
                  <h4 className="font-bold text-slate-800 text-sm">Học phí HK2 2025-2026</h4>
                  <p className="text-xs text-slate-500 mt-0.5">INV-2026-001</p>
                </div>
                <div className="col-span-3"><p className="text-sm text-slate-700 font-medium">01/02/2026</p></div>
                <div className="col-span-2 text-right font-bold text-slate-900">12,500,000 đ</div>
                <div className="col-span-2 flex justify-center">
                  <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded">CHƯA NỘP</span>
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors">
                <div className="col-span-5">
                  <h4 className="font-bold text-slate-800 text-sm">Bảo hiểm y tế 2026</h4>
                  <p className="text-xs text-slate-500 mt-0.5">INV-2026-002</p>
                </div>
                <div className="col-span-3"><p className="text-sm text-slate-700 font-medium">15/01/2026</p></div>
                <div className="col-span-2 text-right font-bold text-slate-900">850,000 đ</div>
                <div className="col-span-2 flex justify-center">
                  <span className="bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold px-2.5 py-1 rounded">ĐÃ NỘP</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}