"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CreditCard, Receipt, Wallet, AlertCircle, CheckCircle2, Loader2, CalendarClock } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { AxiosError } from "axios";

interface Invoice {
  invoiceID: string; studentID: string; amount: number;
  description: string; isPaid: boolean; createdDate: string; dueDate: string | null;
}
interface UserInfo { userId: string; fullName: string; }
interface DebtResponse { totalDebt: number; }

export default function TuitionPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({ userId: "", fullName: "" });

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [totalDebt, setTotalDebt] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // STATE CHO POPUP THANH TOÁN
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [invoiceToPay, setInvoiceToPay] = useState<Invoice | null>(null);

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  const fetchBillingData = useCallback(async () => {
    if (!userInfo.userId) return;
    setIsLoading(true);
    try {
      const invoiceRes = await axiosClient.get<Invoice[]>(`/Invoices/student/${userInfo.userId}`);
      setInvoices(invoiceRes.data);

      const debtRes = await axiosClient.get<DebtResponse>(`/Invoices/debt/${userInfo.userId}`);
      setTotalDebt(debtRes.data.totalDebt || 0);
    } catch (error) {
      console.error("Lỗi lấy dữ liệu học phí:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo.userId]);

  useEffect(() => {
    if (isMounted && userInfo.userId) fetchBillingData();
  }, [isMounted, userInfo.userId, fetchBillingData]);

  // Mở Popup thanh toán
  const openPaymentGateway = (invoice: Invoice) => {
    setInvoiceToPay(invoice);
    setIsModalOpen(true);
  };

  // Xác nhận thanh toán từ Popup
  const confirmPayment = async () => {
    if (!invoiceToPay) return;
    setProcessingId(invoiceToPay.invoiceID);
    setIsModalOpen(false);
    setMessage(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Delay giả lập mạng
      const response = await axiosClient.post(`/Invoices/pay/${invoiceToPay.invoiceID}`);
      setMessage({ type: 'success', text: response.data.message || "Thanh toán thành công!" });
      fetchBillingData();
    } catch (error) {
      const err = error as AxiosError<string>;
      setMessage({ type: 'error', text: err.response?.data || "Thanh toán thất bại." });
    } finally {
      setProcessingId(null);
    }
  };

  if (!isMounted) return null;

  const totalPaid = invoices.filter(i => i.isPaid).reduce((sum, i) => sum + i.amount, 0);

  return (
    <div className="flex min-h-screen bg-[#F5F7FA] relative">
      <Sidebar />

      {/* POPUP CỔNG THANH TOÁN (MÔ PHỎNG) */}
      {isModalOpen && invoiceToPay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center"><Wallet size={20}/></div>
              <h2 className="text-xl font-bold text-[#1C538E]">Cổng Thanh Toán Điện Tử</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Mô phỏng kết nối VNPay / MoMo Gateway.</p>
            
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 mb-6 space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Mã Hóa Đơn</span>
                <span className="font-bold text-slate-800">{invoiceToPay.invoiceID}</span>
              </div>
              <div className="flex justify-between items-start pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase mt-1">Nội dung</span>
                <span className="font-semibold text-slate-700 text-right w-2/3">{invoiceToPay.description}</span>
              </div>
              <div className="flex justify-between items-center pt-1">
                <span className="text-xs font-bold text-slate-500 uppercase">Số tiền cần thanh toán</span>
                <span className="font-black text-[#1C538E] text-lg">{invoiceToPay.amount.toLocaleString('vi-VN')} đ</span>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-colors">Hủy giao dịch</button>
              <button onClick={confirmPayment} className="px-5 py-2.5 bg-[#0059A7] text-white font-bold rounded-lg hover:bg-[#004683] flex items-center gap-2 transition-all active:scale-95 shadow-md">
                Xác Nhận Chuyển Tiền
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
          <div className="flex items-center gap-2"><h2 className="font-bold text-[#1C538E] text-lg hidden sm:block">ERP System</h2></div>
          <div className="flex items-center gap-5">
            <div className="bg-slate-50 px-3 py-1.5 rounded text-xs font-bold border border-slate-200 text-slate-600">Financial Portal</div>
            <button className="relative p-2 text-slate-400 hover:text-[#1C538E] transition-colors rounded hover:bg-slate-50"><Bell size={20} /></button>
            <div className="flex items-center gap-3 pl-5 border-l border-slate-200">
              <div className="text-right hidden sm:block"><p className="font-bold text-[#1C538E] text-sm leading-tight">{userInfo.fullName}</p><p className="text-[10px] text-slate-500 font-medium">ID: {userInfo.userId}</p></div>
              <div className="w-9 h-9 bg-[#1C538E] rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm">ST</div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-6xl mx-auto w-full">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-[#1C538E] tracking-tight">Tuition & Billing</h1>
            <p className="text-sm text-slate-500 mt-1.5 font-medium">Quản lý hóa đơn và thanh toán học phí trực tuyến.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg flex items-start gap-3 border shadow-sm ${message.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
              {message.type === 'success' ? <CheckCircle2 size={20} className="mt-0.5 shrink-0"/> : <AlertCircle size={20} className="mt-0.5 shrink-0"/>}
              <p className="font-semibold text-sm">{message.text}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card className={`rounded-xl border-2 shadow-sm relative overflow-hidden ${totalDebt > 0 ? 'border-red-200 bg-red-50' : 'border-emerald-200 bg-emerald-50'}`}>
              <div className={`absolute left-0 top-0 w-1.5 h-full ${totalDebt > 0 ? 'bg-red-500' : 'bg-emerald-500'}`}></div>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className={`text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 ${totalDebt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                      {totalDebt > 0 ? <><AlertCircle size={14}/> Total Outstanding</> : <><CheckCircle2 size={14}/> All Cleared</>}
                    </p>
                    <h2 className="text-3xl font-black text-slate-900 mt-2">{totalDebt.toLocaleString('vi-VN')} đ</h2>
                  </div>
                  <div className={`w-10 h-10 rounded flex items-center justify-center ${totalDebt > 0 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}><Wallet size={20} /></div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Paid (Semester)</p>
                    <h2 className="text-3xl font-black text-[#1C538E] mt-2">{totalPaid.toLocaleString('vi-VN')} đ</h2>
                  </div>
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#1C538E]"><CheckCircle2 size={20} /></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100 bg-[#F8FAFC] flex items-center gap-2">
              <Receipt size={18} className="text-[#1C538E]"/>
              <h3 className="font-bold text-[#1C538E] text-sm">Statement of Account</h3>
            </div>
            
            <div className="overflow-x-auto min-h-[300px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] uppercase tracking-wider text-slate-500 font-bold">
                    <th className="p-4 pl-6">Mã Hóa Đơn</th>
                    <th className="p-4">Nội Dung</th>
                    <th className="p-4 text-center">Ngày Lập</th>
                    <th className="p-4 text-center">Hạn Nộp</th>
                    <th className="p-4 text-right">Số Tiền</th>
                    <th className="p-4 text-center">Trạng Thái</th>
                    <th className="p-4 text-right pr-6">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {isLoading ? (
                    <tr><td colSpan={7} className="text-center py-16 text-slate-400"><Loader2 className="animate-spin inline-block mr-2" size={24}/> Đang tải dữ liệu hóa đơn...</td></tr>
                  ) : invoices.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-16 text-slate-500 font-medium">Bạn không có hóa đơn học phí nào.</td></tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr key={inv.invoiceID} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-6 font-bold text-slate-600 text-xs">{inv.invoiceID}</td>
                        <td className="p-4 font-bold text-slate-800 text-sm">{inv.description}</td>
                        <td className="p-4 text-center text-xs font-medium text-slate-500">{new Date(inv.createdDate).toLocaleDateString('vi-VN')}</td>
                        <td className="p-4 text-center">
                          {inv.dueDate 
                            ? <span className="text-xs font-medium text-slate-500 flex items-center justify-center gap-1.5"><CalendarClock size={12}/> {new Date(inv.dueDate).toLocaleDateString('vi-VN')}</span>
                            : <span className="text-xs text-slate-400 italic">N/A</span>}
                        </td>
                        <td className="p-4 text-right font-black text-[#1C538E]">{inv.amount.toLocaleString('vi-VN')} đ</td>
                        <td className="p-4 text-center">
                          {inv.isPaid ? (
                            <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-600 text-[10px] font-bold border border-emerald-200 inline-block">ĐÃ THANH TOÁN</span>
                          ) : (
                            <span className="px-2.5 py-1 rounded bg-orange-50 text-orange-600 text-[10px] font-bold border border-orange-200 inline-block">CHƯA THANH TOÁN</span>
                          )}
                        </td>
                        <td className="p-4 text-right pr-6">
                          {inv.isPaid ? (
                            <button disabled className="px-4 py-2 rounded text-xs font-bold bg-slate-100 text-slate-400 cursor-not-allowed">Đã Thu</button>
                          ) : (
                            <button 
                              onClick={() => openPaymentGateway(inv)}
                              disabled={processingId === inv.invoiceID}
                              className="px-4 py-2 rounded text-xs font-bold transition-all flex items-center gap-2 ml-auto shadow-sm disabled:shadow-none bg-[#0059A7] text-white hover:bg-[#004683] active:scale-95"
                            >
                              {processingId === inv.invoiceID ? <Loader2 size={14} className="animate-spin"/> : <CreditCard size={14} />}
                              Thanh Toán
                            </button>
                          )}
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