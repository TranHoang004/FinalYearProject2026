"use client";

import { useState } from "react";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay (1.5 seconds)
    setTimeout(() => {
      setIsLoading(false);
      // Temporary redirect to dashboard (will be replaced with actual API call)
      window.location.href = "/";
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      
      {/* Left section: Branding display (desktop only) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Gradient background effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0D2B5E] to-slate-900 opacity-90 z-0"></div>
        
        {/* Decorative elements */}
        <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-[#F2A900] rounded-full blur-[120px] opacity-20 z-0"></div>
        <div className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full blur-[100px] opacity-20 z-0"></div>

        <div className="relative z-10 p-16 flex flex-col items-start max-w-lg">
          <div className="w-14 h-14 bg-[#F2A900] text-slate-900 font-black flex items-center justify-center rounded-xl text-3xl shadow-lg mb-8">
            H
          </div>
          <h1 className="text-4xl font-black text-white leading-tight mb-6">
            Smart University <br/> ERP System.
          </h1>
          <p className="text-slate-300 text-lg font-medium leading-relaxed mb-10">
            A modern, data-centric platform empowering the academic journey of HUTECH & OUM Joint Program students.
          </p>
          
          <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-5 py-3 rounded-lg border border-white/10">
            <ShieldCheck className="text-green-400" size={24} />
            <span className="text-sm font-semibold text-slate-200">Enterprise-grade Security (JWT Authenticated)</span>
          </div>
        </div>
      </div>

      {/* Right section: Login form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-slate-50">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-slate-100">
          
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Welcome Back</h2>
            <p className="text-sm text-slate-500 font-medium mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Input Student ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Student ID / Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="text" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium" 
                  placeholder="e.g. 1911062948"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Password</label>
                <a href="#" className="text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors">Forgot password?</a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </div>
                <input 
                  type="password" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-900 font-medium" 
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Ghi nhớ đăng nhập */}
            <div className="flex items-center pt-2">
              <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              <label htmlFor="remember" className="ml-2 block text-sm text-slate-600 font-medium cursor-pointer">
                Remember me for 30 days
              </label>
            </div>

            {/* Nút Submit */}
            <Button 
              type="submit" 
              className="w-full mt-6 bg-[#F2A900] hover:bg-[#d99700] text-slate-900 font-extrabold py-6 rounded-xl text-sm transition-all shadow-md flex justify-center items-center gap-2 disabled:opacity-70"
              disabled={isLoading}
            >
              {isLoading ? "Authenticating..." : (
                <>Sign In <ArrowRight size={18} /></>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 font-medium">
              Don&apos;t have an account? <span className="text-slate-900 font-bold">Contact Academic Staff</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}