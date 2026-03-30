using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IGpaCalculatorService _gpaService;
        private readonly IInvoiceService _invoiceService;

        public DashboardController(
            AppDbContext context,
            IGpaCalculatorService gpaService,
            IInvoiceService invoiceService)
        {
            _context = context;
            _gpaService = gpaService;
            _invoiceService = invoiceService;
        }

        [HttpGet("student/{studentId}")]
        public async Task<IActionResult> GetStudentDashboard(string studentId)
        {
            // 1. User Info
            var student = await _context.Users.FindAsync(studentId);
            if (student == null) return NotFound("Không tìm thấy sinh viên.");

            string majorName = "N/A";
            if (!string.IsNullOrEmpty(student.MajorId))
            {
                var major = await _context.Majors.FindAsync(student.MajorId);
                if (major != null) majorName = major.MajorName;
            }

            var nameParts = student.FullName.Split(' ');
            string firstName = nameParts.Length > 0 ? nameParts.Last() : student.FullName;

            // 2. NGHIỆP VỤ (GPA & NỢ)
            double currentGpa = await _gpaService.CalculateRealtimeGpaAsync(studentId);
            decimal tuitionDebt = await _invoiceService.GetTotalDebtAsync(studentId);

            // 3. TÍN CHỈ & MÔN HỌC HIỆN TẠI
            var currentEnrollments = await _context.Enrollments
                .Where(e => e.StudentId == studentId && e.FinalGrade == null) // Đang học
                .Join(_context.Classes, e => e.ClassId, c => c.ClassId, (e, c) => new { e, c })
                .Join(_context.Subjects, ec => ec.c.SubjectId, s => s.SubjectId, (ec, s) => new { ec.c, s })
                .ToListAsync();

            int currentCoursesCount = currentEnrollments.Count;
            int currentCredits = currentEnrollments.Sum(x => x.s.Credits);

            var earnedCredits = await _context.Enrollments
                .Where(g => g.StudentId == studentId && g.FinalGrade >= 4.0m)
                .Join(_context.Classes, e => e.ClassId, c => c.ClassId, (e, c) => new { c })
                .Join(_context.Subjects, ec => ec.c.SubjectId, s => s.SubjectId, (ec, s) => s.Credits)
                .SumAsync();

            // 4. LỊCH HỌC TRONG NGÀY
            // (Giả lập lấy 3 môn đầu tiên vì cần join với bảng ClassSchedule mới tạo)
            var schedule = currentEnrollments.Select(x => new
            {
                id = x.c.ClassId,
                name = x.s.SubjectName,
                code = x.s.SubjectId,
                time = "TBA",
                location = "TBA"
            }).Take(3).ToList();

            // 5. TRẢ VỀ JSON KHỚP 100% VỚI NEXT.JS
            var announcements = new List<object>
            {
                new {
                    id = 1,
                    date = DateTime.Now.ToString("MMM dd, yyyy").ToUpper(),
                    title = "Tuition Payment Reminder",
                    content = "Please complete your Spring Semester tuition payment before Jan 15th to avoid class cancellation.",
                    type = "warning" // Loại warning sẽ có viền đỏ
                },
                new {
                    id = 2,
                    date = DateTime.Now.AddDays(-3).ToString("MMM dd, yyyy").ToUpper(),
                    title = "Lunar New Year Break",
                    content = "The campus will be closed from Jan 28th to Feb 15th. All online sessions are suspended.",
                    type = "info" // Loại info viền xanh dương
                }
            };

            // TRẢ VỀ JSON KHỚP 100% VỚI NEXT.JS (Đã xóa Deadlines, thêm Announcements)
            return Ok(new
            {
                student = new { firstName = firstName, fullName = student.FullName, id = student.UserId, major = majorName, term = "Spring 2026", todoCount = 2 },
                gpa = new { current = currentGpa, max = 4.0, target = 3.5, percent = (int)Math.Round((currentGpa / 4.0) * 100), trend = "+ 0.05", rank = "Top 5%" },
                credits = new { earned = earnedCredits, total = 120, completedPercent = Math.Round(((double)earnedCredits / 120) * 100) + "%" },
                courses = new { current = currentCoursesCount, totalCredits = currentCredits },
                tuition = new { totalOutstanding = tuitionDebt },
                schedule = schedule,
                announcements = announcements // <--- Đưa dữ liệu thông báo vào đây
            });
        }
    }
}