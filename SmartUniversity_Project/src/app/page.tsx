import Sidebar from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Bell, Medal, BookOpen, CheckSquare, Clock, AlertCircle, CreditCard, MapPin, Check } from "lucide-react";

// ============================================================================
// 1. MÔ PHỎNG DỮ LIỆU TỪ API BACKEND (Tránh Hard-code)
// Sau này kết nối C#, bạn chỉ cần thay biến này bằng dữ liệu fetch từ API
// ============================================================================
const dashboardData = {
  student: {
    firstName: "Nguyen",
    fullName: "Nguyen Van A.",
    id: "1911062948",
    major: "IT Major",
    term: "Spring 2026",
    todoCount: 3,
    notificationCount: 3,
  },
  gpa: {
    current: 3.85,
    max: 4.0,
    target: 3.5,
    percent: 96, // Dùng để vẽ vòng tròn
    trend: "+ 0.05",
    rank: "Top 5% of cohort",
  },
  credits: {
    earned: 86,
    total: 120,
    completedPercent: "71%",
  },
  courses: {
    current: 5,
    totalCredits: 15,
  },
  deadlines: {
    upcoming: 3,
    nextTask: "ML Project",
  },
  tuition: {
    totalOutstanding: 1250.00,
  },
  schedule: [
    { id: 1, name: "Advanced Machine Learning (OUM-ML501)", time: "08:30 AM - 11:30 AM", location: "Lab B2-05 / E-Campus", type: "Live", color: "#F2A900" },
    { id: 2, name: "Enterprise Software Architecture", time: "01:00 PM - 03:00 PM", location: "Hall A4", type: "Offline", color: "#60A5FA" },
  ],
  announcements: [
    { id: 1, title: "Registration for Summer 2026 Opens", date: "Mar 15, 2026", desc: "Early course registration begins next week. Please clear any outstanding balances before enrolling.", color: "border-[#F2A900]" },
    { id: 2, title: "Library System Maintenance", date: "Mar 14, 2026", desc: "The OUM digital library portal will undergo scheduled maintenance this Sunday.", color: "border-blue-400" },
  ]
};

export default function Home() {
  // Tính toán chu vi vòng tròn SVG (Bán kính r=48 => Chu vi = 2 * PI * 48 = ~301.6)
  const circleCircumference = 301.6;
  const strokeDashoffset = circleCircumference - (circleCircumference * dashboardData.gpa.percent) / 100;

  return (
    <div className="flex min-h-screen bg-[#F4F7FE]">
      <Sidebar />

      <main className="flex-1 ml-64 flex flex-col h-screen overflow-y-auto">
        
        {/* TOP HEADER */}
        <header className="sticky top-0 z-10 bg-[#F4F7FE]/80 backdrop-blur-md px-8 py-4 flex justify-between items-center">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search courses, resources, etc..." 
              className="w-full pl-12 pr-4 py-2.5 bg-white border-0 rounded-full shadow-sm text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#0D2B5E]/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-white px-4 py-1.5 rounded-full shadow-sm text-xs font-bold border border-gray-100">
              <span className="text-gray-400 uppercase tracking-wider">Current Term:</span>
              <span className="text-[#0D2B5E]">{dashboardData.student.term}</span>
            </div>
            
            <button className="relative text-gray-400 hover:text-[#0D2B5E] transition-colors">
              <Bell size={22} />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-[#F2A900] ring-2 ring-[#F4F7FE]"></span>
            </button>
            
            <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
              <div className="text-right">
                <p className="font-bold text-[#0D2B5E] text-sm leading-tight">{dashboardData.student.fullName}</p>
                <p className="text-[10px] text-gray-500">ID: {dashboardData.student.id} • {dashboardData.student.major}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#0D2B5E] to-[#1a4a9c] rounded-full shadow-md flex items-center justify-center text-white font-bold text-sm">
                {dashboardData.student.firstName.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {/* NỘI DUNG DASHBOARD */}
        <div className="p-8 pt-2 max-w-7xl mx-auto w-full">
          
          <div className="flex justify-between items-end mb-6">
            <div>
              <h1 className="text-3xl font-extrabold text-[#0D2B5E] flex items-center gap-2">
                Welcome back, {dashboardData.student.firstName}! <span className="text-2xl">👋</span>
              </h1>
              <p className="text-sm text-gray-500 mt-1 font-medium">Here is your academic overview for {dashboardData.student.term}.</p>
            </div>
            <button className="flex items-center gap-2 bg-white text-[#0D2B5E] border border-gray-200 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-gray-50 transition-all">
              <CheckSquare size={16} />
              To-Do List
              <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">{dashboardData.student.todoCount}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Thẻ 1: GPA */}
            <Card className="rounded-2xl border-0 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cumulative GPA</p>
                    <h2 className="text-4xl font-black text-[#0D2B5E] mt-3 mb-1">{dashboardData.gpa.current}</h2>
                    <p className="text-xs font-semibold text-green-500">↑ {dashboardData.gpa.trend} {dashboardData.gpa.rank}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 shadow-sm"><Medal size={18} /></div>
                </div>
              </CardContent>
            </Card>

            {/* Thẻ 2: Credits */}
            <Card className="rounded-2xl border-0 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Credits Earned</p>
                    <h2 className="text-4xl font-black text-[#0D2B5E] mt-3 mb-1">{dashboardData.credits.earned} <span className="text-xl text-gray-300">/ {dashboardData.credits.total}</span></h2>
                    <p className="text-xs font-semibold text-gray-500">{dashboardData.credits.completedPercent} completed</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 shadow-sm"><BookOpen size={18} /></div>
                </div>
              </CardContent>
            </Card>

            {/* Thẻ 3: Courses */}
            <Card className="rounded-2xl border-0 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Current Courses</p>
                    <h2 className="text-4xl font-black text-[#0D2B5E] mt-3 mb-1">{dashboardData.courses.current}</h2>
                    <p className="text-xs font-semibold text-gray-500">{dashboardData.courses.totalCredits} Total Credits</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 shadow-sm"><CheckSquare size={18} /></div>
                </div>
              </CardContent>
            </Card>

            {/* Thẻ 4: Deadlines */}
            <Card className="rounded-2xl border-0 shadow-sm overflow-hidden relative group">
              <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-50 rounded-full group-hover:bg-gray-100 transition-colors duration-500"></div>
              <CardContent className="p-6 relative z-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Upcoming Deadlines</p>
                    <h2 className="text-4xl font-black text-[#0D2B5E] mt-3 mb-1">{dashboardData.deadlines.upcoming}</h2>
                    <p className="text-xs font-semibold text-red-500">High Priority Next: {dashboardData.deadlines.nextTask}</p>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-gray-100 bg-white flex items-center justify-center text-gray-400 shadow-sm"><Clock size={18} /></div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* THẺ REAL-TIME GPA ĐÃ ĐƯỢC FIX LỖI */}
                <Card className="rounded-2xl border-0 shadow-sm">
                  <CardContent className="p-6 flex justify-between items-center">
                    <div className="w-1/2">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                        <Medal size={14} /> Real-Time GPA
                      </p>
                      <p className="text-xs text-gray-500 mb-4 pr-2">Your academic standing for the current program.</p>
                      <div className="flex items-baseline gap-1">
                        <h2 className="text-4xl font-black text-[#0D2B5E]">{dashboardData.gpa.current}</h2>
                        <span className="text-gray-400 font-bold">/ {dashboardData.gpa.max}</span>
                      </div>
                      
                      {/* Đường gạch dưới màu xanh chuẩn Figma */}
                      <div className="mt-5 border-b-2 border-green-500 pb-1.5 flex justify-between items-end pr-1">
                        <span className="text-xs text-gray-500 font-medium">Dean&apos;s List Target ({dashboardData.gpa.target})</span>
                        <span className="text-xs text-green-500 font-bold flex items-center gap-1">Achieved <Check size={14}/></span>
                      </div>
                    </div>

                    {/* Vòng tròn SVG xịn xò chuẩn Figma */}
                    <div className="relative w-28 h-28 flex items-center justify-center">
                      <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                        {/* Vòng tròn nền (màu nhạt) */}
                        <circle cx="56" cy="56" r="48" stroke="#F4F7FE" strokeWidth="8" fill="none" />
                        {/* Vòng tròn phần trăm (màu đậm, nét bo tròn) */}
                        <circle 
                          cx="56" cy="56" r="48" 
                          stroke="#0D2B5E" strokeWidth="8" fill="none"
                          strokeDasharray={circleCircumference}
                          strokeDashoffset={strokeDashoffset}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-in-out"
                        />
                      </svg>
                      <div className="text-center z-10">
                        <span className="block text-xl font-black text-[#0D2B5E]">{dashboardData.gpa.percent}%</span>
                        <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest">Perfect</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* THẺ HỌC PHÍ */}
                <Card className="rounded-2xl border-0 shadow-sm bg-gradient-to-br from-red-50 to-white relative overflow-hidden">
                  <div className="absolute right-[-20%] top-[-20%] text-red-100 opacity-50 transform rotate-12">
                    <CreditCard size={180} />
                  </div>
                  <CardContent className="p-6 relative z-10">
                    <p className="text-[10px] font-bold text-red-600 uppercase tracking-widest flex items-center gap-1.5 mb-2">
                      <AlertCircle size={14} /> Tuition Debt Alert
                    </p>
                    <p className="text-xs text-red-500/80 font-medium mb-6">
                      You have an outstanding balance that needs attention.
                    </p>
                    <p className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest">Total Outstanding</p>
                    <h2 className="text-4xl font-black text-red-600 mt-1 mb-4">
                      ${dashboardData.tuition.totalOutstanding.toLocaleString('en-US')}<span className="text-xl">.00</span>
                    </h2>
                    <button className="w-full bg-[#F2A900] hover:bg-[#d99700] text-[#0D2B5E] font-extrabold py-3.5 rounded-xl text-sm transition-all shadow-md flex justify-center items-center gap-2">
                      Pay Now <span className="text-lg leading-none">→</span>
                    </button>
                  </CardContent>
                </Card>
              </div>

              {/* LỊCH HỌC TỰ ĐỘNG LOAD TỪ DATA */}
              <Card className="rounded-2xl border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-[#0D2B5E] text-lg">Today&apos;s Schedule</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">March 16, 2026</p>
                    </div>
                    <button className="text-sm font-bold border px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-50">View Full Week</button>
                  </div>
                  
                  <div className="space-y-4">
                    {dashboardData.schedule.map((course) => (
                      <div key={course.id} className="flex flex-col p-4 rounded-xl border border-gray-100 bg-white shadow-sm" style={{ borderLeftWidth: '4px', borderLeftColor: course.color }}>
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-[#0D2B5E] text-sm">{course.name}</h4>
                          {course.type === "Live" && (
                            <span className="bg-[#F2A900] text-[#0D2B5E] text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider">Live</span>
                          )}
                        </div>
                        <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
                          <span className="flex items-center gap-1.5"><Clock size={14}/> {course.time}</span>
                          <span className="flex items-center gap-1.5"><MapPin size={14}/> {course.location}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* THÔNG BÁO TỰ ĐỘNG LOAD TỪ DATA */}
            <div className="col-span-1">
              <Card className="rounded-2xl border-0 shadow-sm h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-extrabold text-[#0D2B5E] text-lg">Announcements</h3>
                      <p className="text-xs text-gray-500 font-medium mt-1">Latest from Administration</p>
                    </div>
                    <button className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1 hover:text-[#0D2B5E]">
                      View All <span className="text-lg leading-none mb-0.5">↗</span>
                    </button>
                  </div>

                  <div className="space-y-6">
                    {dashboardData.announcements.map((news) => (
                      <div key={news.id} className={`relative pl-4 border-l-2 ${news.color}`}>
                        <div className="flex justify-between items-start mb-1">
                          <h4 className="font-bold text-sm text-[#0D2B5E] pr-2">{news.title}</h4>
                          <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full whitespace-nowrap">{news.date}</span>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed">{news.desc}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}