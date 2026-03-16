using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Core.Interfaces; // Gọi Interface thay vì Class cụ thể
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AcademicController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IIdGeneratorService _idGen; // Dependency Inversion

        public AcademicController(AppDbContext context, IIdGeneratorService idGen)
        {
            _context = context;
            _idGen = idGen;
        }

        [HttpPost("create-class")]
        public async Task<IActionResult> CreateClass(string majorId, string className)
        {
            try
            {
                string newClassId = await _idGen.GenerateClassIdAsync(majorId);

                var newClass = new Class
                {
                    ClassId = newClassId,
                    ClassName = className,
                    SubjectId = "S_" + majorId, // Giả định
                    Semester = "HK1",
                    Year = DateTime.Now.Year
                };

                _context.Classes.Add(newClass);
                await _context.SaveChangesAsync();

                return Ok(new { Message = "Tạo lớp thành công", ClassId = newClassId });
            }
            catch (Exception ex) { return BadRequest(ex.Message); }
        }

        [HttpPost("enroll-student")]
        public async Task<IActionResult> EnrollStudent(string fullName, string personalEmail, string majorId)
        {
            // BỎ THAM SỐ classId Ở INPUT ĐI, VÌ CHÚNG TA SẼ PHÂN LỚP TỰ ĐỘNG!
            try
            {
                // 1. Khởi tạo mã sinh viên chuẩn (VD: 2654030001)
                string newStudentId = await _idGen.GenerateStudentIdAsync(majorId);

                // 2. THUẬT TOÁN PHÂN LỚP TỰ ĐỘNG (Auto-Class Assignment)
                string assignedClassId = "";
                int maxStudentsPerClass = 40; // Quy định 40 SV/lớp hành chính

                string year = DateTime.Now.ToString("yy");
                var major = await _context.Majors.FindAsync(majorId);
                string classPrefix = $"{year}{major?.CodeText}"; // VD: 26BOIT

                // 👇 THAY THẾ ĐOẠN LỖI BẰNG ĐOẠN NÀY 👇

                // 1. Tìm tên lớp hành chính mới nhất (VD: tìm ra "26BOIT01")
                var latestClassId = await _context.Users
                    .Where(u => u.RoleId == 4 && u.AdminClassId != null && u.AdminClassId.StartsWith(classPrefix))
                    .Select(u => u.AdminClassId)
                    .OrderByDescending(id => id)
                    .FirstOrDefaultAsync();

                if (string.IsNullOrEmpty(latestClassId))
                {
                    // Chưa có lớp nào khóa này -> TẠO MÃ LỚP MỚI ĐẦU TIÊN
                    assignedClassId = await _idGen.GenerateClassIdAsync(majorId);
                }
                else
                {
                    // 2. Đếm số lượng sinh viên đang học trong cái lớp mới nhất đó
                    int studentCount = await _context.Users.CountAsync(u => u.AdminClassId == latestClassId);

                    if (studentCount >= maxStudentsPerClass)
                    {
                        // Lớp mới nhất đã full 40 người -> TẠO MÃ LỚP MỚI (Tự động nhảy số 02, 03)
                        assignedClassId = await _idGen.GenerateClassIdAsync(majorId);
                    }
                    else
                    {
                        // Lớp mới nhất vẫn còn chỗ trống -> NHÉT VÀO LỚP CŨ
                        assignedClassId = latestClassId;
                    }
                }

                // 3. Tạo hồ sơ sinh viên
                string defaultPassHash = BCrypt.Net.BCrypt.HashPassword("123456");
                var student = new User
                {
                    UserId = newStudentId,
                    FullName = fullName,
                    RoleId = 4,
                    PasswordHash = defaultPassHash,
                    IsFirstLogin = true,
                    AdminClassId = assignedClassId, // Gán lớp hành chính vừa tính toán được
                    TuitionDebt = 0,
                    Email = personalEmail
                };

                _context.Users.Add(student);
                await _context.SaveChangesAsync();

                return Ok(new
                {
                    Message = "Nhập học & Phân lớp tự động thành công",
                    MSSV = newStudentId,
                    AssignedClass = assignedClassId
                });
            }
            catch (Exception ex) { return BadRequest("Lỗi: " + ex.Message); }
        }
        [HttpGet("curriculums")]
        public async Task<ActionResult<IEnumerable<object>>> GetCurriculum(string majorId, string cohort)
        {
            // Nhờ Global Query Filter trong AppDbContext, câu query này
            // sẽ TỰ ĐỘNG BỎ QUA các môn bị xóa mềm (IsActive = false)
            var curriculum = await _context.Curriculums
                .Where(c => c.MajorId == majorId && c.Cohort == cohort)
                .Join(_context.Subjects, // Nối với bảng Subjects để lấy Tên môn
                      c => c.SubjectId,
                      s => s.SubjectId,
                      (c, s) => new
                      {
                          c.SubjectId,
                          s.SubjectName,
                          c.KnowledgeBlock,
                          c.IsCompulsory,
                          s.Credits
                      })
                .ToListAsync();

            if (!curriculum.Any())
                return NotFound($"Không tìm thấy khung chương trình cho Ngành {majorId} - Khóa {cohort}");

            return Ok(curriculum);
        }

        // 2. TÍNH NĂNG ĐẮT GIÁ: Nhân bản (Clone) Khung chương trình sang năm mới
        // VD: Copy toàn bộ K2025 sang K2026
        [HttpPost("clone-curriculum")]
        public async Task<IActionResult> CloneCurriculum(string majorId, string oldCohort, string newCohort)
        {
            try
            {
                // Kiểm tra khóa mới đã tồn tại chưa
                var isExist = await _context.Curriculums
                    .AnyAsync(c => c.MajorId == majorId && c.Cohort == newCohort);

                if (isExist)
                    return BadRequest($"Khung chương trình {newCohort} đã tồn tại! Vui lòng không ghi đè.");

                // Lấy toàn bộ dữ liệu của khóa cũ
                var oldCurriculum = await _context.Curriculums
                    .Where(c => c.MajorId == majorId && c.Cohort == oldCohort)
                    .AsNoTracking() // Không track để tạo mới dễ dàng
                    .ToListAsync();

                if (!oldCurriculum.Any())
                    return NotFound($"Không tìm thấy dữ liệu gốc của khóa {oldCohort} để nhân bản.");

                // Đổi nhãn Cohort sang khóa mới và Insert
                var newCurriculum = oldCurriculum.Select(c => new Curriculum
                {
                    MajorId = c.MajorId,
                    SubjectId = c.SubjectId,
                    Cohort = newCohort,
                    KnowledgeBlock = c.KnowledgeBlock,
                    IsCompulsory = c.IsCompulsory,
                    RecommendedSemester = c.RecommendedSemester
                }).ToList();

                _context.Curriculums.AddRange(newCurriculum);
                await _context.SaveChangesAsync();

                return Ok(new { Message = $"Đã nhân bản thành công {newCurriculum.Count} môn học từ {oldCohort} sang {newCohort}." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }

        // 3. XÓA MỀM (Soft Delete) Môn học
        [HttpPut("deactivate-subject/{subjectId}")]
        public async Task<IActionResult> DeactivateSubject(string subjectId)
        {
            var subject = await _context.Subjects.FindAsync(subjectId);
            if (subject == null) return NotFound("Không tìm thấy môn học.");

            // Đổi cờ IsActive thành false thay vì xóa
            subject.IsActive = false;

            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Đã vô hiệu hóa môn {subject.SubjectName} thành công. Môn này sẽ không còn xuất hiện trong các lượt đăng ký mới." });
        }
    }
}