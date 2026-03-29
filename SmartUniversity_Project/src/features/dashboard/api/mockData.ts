export const dashboardData = {
  student: {
    firstName: "Nguyen",
    fullName: "Nguyen Van A.",
    id: "1911062948",
    major: "IT Major",
    term: "Spring 2026",
    todoCount: 3,
    notificationCount: 3,
  },
  gpa: { current: 3.85, max: 4.0, target: 3.5, percent: 96, trend: "+ 0.05", rank: "Top 5% of cohort" },
  credits: { earned: 86, total: 120, completedPercent: "71%" },
  courses: { current: 5, totalCredits: 15 },
  deadlines: { upcoming: 3, nextTask: "ML Project" },
  tuition: { totalOutstanding: 1250.00 },
  schedule: [
    { id: 1, name: "Advanced Machine Learning (OUM-ML501)", time: "08:30 AM - 11:30 AM", location: "Lab B2-05 / E-Campus", type: "Live", color: "#F2A900" },
    { id: 2, name: "Enterprise Software Architecture", time: "01:00 PM - 03:00 PM", location: "Hall A4", type: "Offline", color: "#60A5FA" },
  ],
  announcements: [
    { id: 1, title: "Registration for Summer 2026 Opens", date: "Mar 15, 2026", desc: "Early course registration begins next week. Please clear any outstanding balances before enrolling.", color: "border-[#F2A900]" },
    { id: 2, title: "Library System Maintenance", date: "Mar 14, 2026", desc: "The OUM digital library portal will undergo scheduled maintenance this Sunday.", color: "border-blue-400" },
  ]
};