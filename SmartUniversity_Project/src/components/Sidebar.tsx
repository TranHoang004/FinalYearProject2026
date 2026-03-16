import Link from "next/link";
import { 
  LayoutDashboard, BookOpen, CreditCard, 
  GraduationCap, Calendar, User, Settings, LogOut 
} from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#0D2B5E] text-white flex flex-col justify-between fixed left-0 top-0 shadow-2xl z-50">
      <div>
        {/* Logo & Branding */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F2A900] text-[#0D2B5E] font-black flex items-center justify-center rounded-lg text-2xl shadow-md">
              H
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight tracking-wide">Smart ERP</h1>
              <p className="text-[10px] text-gray-300 uppercase tracking-wider mt-1">HUTECH - OUM Joint</p>
            </div>
          </div>
        </div>

        {/* Menu ACADEMIC */}
        <div className="px-4 mt-6">
          <p className="text-xs text-gray-400 font-bold mb-3 px-2 uppercase tracking-widest">Academic</p>
          <nav className="space-y-2">
            {/* Nút Dashboard đang được active (Màu Vàng Gold) */}
            <Link href="/" className="flex items-center gap-3 px-3 py-3 bg-[#F2A900] text-[#0D2B5E] rounded-lg font-bold shadow-md transition-all">
              <LayoutDashboard size={20} />
              Dashboard
            </Link>
            <Link href="/courses" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <BookOpen size={20} />
              Course Registration
            </Link>
            <Link href="/tuition" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <CreditCard size={20} />
              Tuition & Invoices
            </Link>
            <Link href="/grades" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <GraduationCap size={20} />
              Grades
            </Link>
            <Link href="/schedule" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <Calendar size={20} />
              Schedule
            </Link>
          </nav>

          {/* Menu ACCOUNT */}
          <p className="text-xs text-gray-400 font-bold mb-3 mt-8 px-2 uppercase tracking-widest">Account</p>
          <nav className="space-y-2">
            <Link href="/profile" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <User size={20} />
              Profile
            </Link>
            <Link href="/settings" className="flex items-center gap-3 px-3 py-3 text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all">
              <Settings size={20} />
              Settings
            </Link>
          </nav>
        </div>
      </div>

      {/* Sign Out Button */}
      <div className="p-4 border-t border-white/10 mt-auto">
        <button className="flex items-center gap-3 px-3 py-3 w-full text-gray-300 hover:bg-white/10 hover:text-white rounded-lg font-medium transition-all text-left">
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );
}