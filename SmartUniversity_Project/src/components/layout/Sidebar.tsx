"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, BookOpen, CreditCard, GraduationCap, Calendar, User, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const isActive = (path: string) => pathname === path;

  const activeClass = "flex items-center gap-3 px-4 py-3 bg-[#0059A7] border-l-4 border-white text-white rounded-r-lg font-bold shadow-md transition-all";
  const inactiveClass = "flex items-center gap-3 px-4 py-3 text-white/70 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all border-l-4 border-transparent";

  return (
    <div className="w-64 min-h-screen bg-[#1C538E] text-white flex flex-col justify-between fixed left-0 top-0 z-50 shadow-2xl">
      <div>
        <div className="p-6 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white text-[#1C538E] font-black flex items-center justify-center rounded-lg text-xl shadow-md">H</div>
            <div>
              <h1 className="font-bold text-lg leading-tight tracking-wide text-white">Smart ERP</h1>
              <p className="text-[10px] text-white/70 uppercase tracking-wider mt-0.5 font-semibold">OUM Joint Program</p>
            </div>
          </div>
        </div>

        <div className="px-4">
          <p className="text-[10px] text-white/50 font-bold mb-3 px-2 uppercase tracking-widest">Academic</p>
          <nav className="space-y-1">
            <Link href="/" className={isActive('/') ? activeClass : inactiveClass}><LayoutDashboard size={18} /> Dashboard</Link>
            <Link href="/courses" className={isActive('/courses') ? activeClass : inactiveClass}><BookOpen size={18} /> Course Registration</Link>
            <Link href="/tuition" className={isActive('/tuition') ? activeClass : inactiveClass}><CreditCard size={18} /> Tuition & Invoices</Link>
            <Link href="/grades" className={isActive('/grades') ? activeClass : inactiveClass}><GraduationCap size={18} /> Transcript</Link>
            <Link href="/schedule" className={isActive('/schedule') ? activeClass : inactiveClass}><Calendar size={18} /> Schedule</Link>
          </nav>

          <p className="text-[10px] text-white/50 font-bold mb-3 mt-8 px-2 uppercase tracking-widest">Account</p>
          <nav className="space-y-1">
            <Link href="/profile" className={isActive('/profile') ? activeClass : inactiveClass}><User size={18} /> My Profile</Link>
            <Link href="/settings" className={isActive('/settings') ? activeClass : inactiveClass}><Settings size={18} /> Settings</Link>
          </nav>
        </div>
      </div>

      <div className="p-4 mt-auto border-t border-white/10">
        <Link href="/login" className="flex items-center gap-3 px-4 py-3 w-full text-white/80 hover:bg-red-500/20 hover:text-red-300 rounded-lg font-medium transition-all text-left">
          <LogOut size={18} /> Sign Out
        </Link>
      </div>
    </div>
  );
}