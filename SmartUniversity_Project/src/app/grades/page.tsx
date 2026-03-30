"use client";

import { useState, useEffect, useCallback } from "react";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Bell,
  Download,
  Medal,
  BookOpen,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import axiosClient from "@/lib/axiosClient";

interface GradeItem {
  code: string;
  name: string;
  credits: number;
  process: number | null;
  exam: number | null;
  final: number | null;
  status: string;
}

interface UserInfo {
  userId: string;
  fullName: string;
}

export default function GradesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    userId: "",
    fullName: "",
  });

  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [courses, setCourses] = useState<GradeItem[]>([]);

  const [summary, setSummary] = useState({
    cumulativeGpa: 0,
    totalCredits: 0,
    termGpa: 0,
  });

  useEffect(() => {
    setIsMounted(true);
    const storedUser = localStorage.getItem("userInfo");
    if (storedUser) setUserInfo(JSON.parse(storedUser));
  }, []);

  const fetchGrades = useCallback(async () => {
    if (!userInfo.userId) return;
    try {
      const response = await axiosClient.get(
        `/Academic/grades/${userInfo.userId}`,
      );
      const data: GradeItem[] = response.data;

      setCourses(data);

      let earnedCredits = 0;
      let totalPoints = 0;

      data.forEach((c) => {
        if (c.status === "Pass" && c.final !== null) {
          earnedCredits += c.credits;
          let score4 = 0;
          if (c.final >= 8.5) score4 = 4.0;
          else if (c.final >= 7.0) score4 = 3.0;
          else if (c.final >= 5.5) score4 = 2.0;
          else if (c.final >= 4.0) score4 = 1.0;

          totalPoints += score4 * c.credits;
        }
      });

      setSummary({
        cumulativeGpa:
          earnedCredits > 0
            ? Number((totalPoints / earnedCredits).toFixed(2))
            : 0,
        totalCredits: earnedCredits,
        termGpa:
          earnedCredits > 0
            ? Number((totalPoints / earnedCredits).toFixed(2))
            : 0,
      });
    } catch (error) {
      console.error("Lỗi lấy điểm:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userInfo.userId]);

  useEffect(() => {
    if (isMounted && userInfo.userId) {
      fetchGrades();
    }
  }, [isMounted, userInfo.userId, fetchGrades]);

  const percentCompleted = Math.round((summary.totalCredits / 120) * 100);

  const handleDownload = () => {
    setIsDownloading(true);
    setTimeout(() => setIsDownloading(false), 1000);
  };

  if (!isMounted) return null;

  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        <header className="sticky top-0 z-10 bg-white border-b border-slate-200 px-8 py-3 flex justify-between items-center shadow-sm">
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
                ST
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 pt-6 max-w-6xl mx-auto w-full">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h1 className="text-2xl font-bold text-[#1C538E] tracking-tight">
                Academic Transcript
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Student: {userInfo.fullName} • ID: {userInfo.userId}
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                disabled={isDownloading}
                className="bg-[#0059A7] hover:bg-[#004683] text-white font-bold py-2 px-4 rounded shadow-sm transition-all duration-200 active:scale-[0.98] flex items-center gap-2 text-sm disabled:opacity-70 disabled:active:scale-100"
              >
                {isDownloading ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Download size={16} />
                )}{" "}
                Download PDF
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Cumulative GPA
                    </p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <h2 className="text-4xl font-black text-[#1C538E]">
                        {summary.cumulativeGpa}
                      </h2>
                      <span className="text-slate-400 font-bold">/ 4.0</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded bg-blue-50 flex items-center justify-center text-[#1C538E]">
                    <Medal size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-xl border border-slate-200 shadow-sm bg-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      Credits Earned
                    </p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <h2 className="text-4xl font-black text-slate-900">
                        {summary.totalCredits}
                      </h2>
                      <span className="text-slate-400 font-bold text-lg">
                        / 120
                      </span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <BookOpen size={20} />
                  </div>
                </div>
                <div className="mt-5 w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${percentCompleted}%` }}
                  ></div>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-2">
                  Program Completion: {percentCompleted}%
                </p>
              </CardContent>
            </Card>
            <Card className="rounded-xl border-none shadow-md bg-[#1C538E]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-blue-200 uppercase tracking-widest">
                      Term GPA
                    </p>
                    <div className="flex items-baseline gap-2 mt-2">
                      <h2 className="text-4xl font-black text-white">
                        {summary.termGpa}
                      </h2>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center text-white">
                    <TrendingUp size={20} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-xl border border-slate-200 shadow-sm overflow-hidden bg-white">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-[#F8FAFC]">
              <h3 className="font-bold text-[#1C538E] text-sm flex items-center gap-2">
                <Medal size={16} /> Course Results
              </h3>
            </div>
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-white border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <div className="col-span-2">Course Code</div>
              <div className="col-span-4">Course Name</div>
              <div className="col-span-1 text-center">Credits</div>
              <div className="col-span-1 text-center">Process</div>
              <div className="col-span-1 text-center">Exam</div>
              <div className="col-span-2 text-center text-slate-800">
                Final Grade
              </div>
              <div className="col-span-1 text-right">Status</div>
            </div>
            <div className="divide-y divide-slate-100 bg-white">
              {isLoading ? (
                <div className="p-10 flex justify-center">
                  <Loader2 className="animate-spin text-[#1C538E]" />
                </div>
              ) : courses.length === 0 ? (
                <div className="p-10 text-center text-slate-500">
                  Chưa có dữ liệu điểm.
                </div>
              ) : (
                courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50/50 transition-colors"
                  >
                    <div className="col-span-2 font-bold text-slate-800 text-sm">
                      {course.code}
                    </div>
                    <div className="col-span-4 text-slate-600 text-sm font-medium">
                      {course.name}
                    </div>
                    <div className="col-span-1 text-center text-slate-500 text-sm font-semibold">
                      {course.credits}
                    </div>
                    <div className="col-span-1 text-center text-slate-600 font-medium text-sm">
                      {course.process ?? "-"}
                    </div>
                    <div className="col-span-1 text-center text-slate-600 font-medium text-sm">
                      {course.exam ?? "-"}
                    </div>
                    <div className="col-span-2 text-center">
                      <span
                        className={`text-base font-black ${course.status === "Pass" ? "text-[#1C538E]" : "text-red-600"}`}
                      >
                        {course.final ?? "-"}
                      </span>
                    </div>
                    <div className="col-span-1 flex justify-end">
                      {course.status === "Pass" ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                          <CheckCircle2 size={12} /> PASS
                        </span>
                      ) : (
                        <span className="bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold px-2.5 py-1 rounded flex items-center gap-1">
                          <XCircle size={12} /> RETAKE
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}
