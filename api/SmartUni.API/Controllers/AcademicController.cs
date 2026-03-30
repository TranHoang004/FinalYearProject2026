using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Core.Interfaces; // Gọi Interface thay vì Class cụ thể
using SmartUni.API.Infrastructure.Data;
using Microsoft.AspNetCore.Http; 
using OfficeOpenXml; 
using SmartUni.API.Application.DTOs;

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
                    SubjectId = "S_" + majorId,
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
        [HttpGet("grades/{studentId}")]
        public async Task<IActionResult> GetStudentGrades(string studentId, string? semester = null)
        {
            var query = _context.Enrollments
                .Where(e => e.StudentId == studentId)
                .Join(_context.Classes, e => e.ClassId, c => c.ClassId, (e, c) => new { e, c })
                .Join(_context.Subjects, ec => ec.c.SubjectId, s => s.SubjectId, (ec, s) => new { ec.e, ec.c, s })
                .AsQueryable();

            if (!string.IsNullOrEmpty(semester))
            {
                query = query.Where(x => x.c.Semester == semester);
            }

            var grades = await query.Select(x => new
            {
                code = x.s.SubjectId,
                name = x.s.SubjectName,
                credits = x.s.Credits,
                process = x.e.ProcessGrade,
                exam = x.e.ExamGrade,
                final = x.e.FinalGrade,
                status = (x.e.FinalGrade.HasValue && x.e.FinalGrade.Value >= 4.0m) ? "Pass" : "Retake"
            }).ToListAsync();

            return Ok(grades);
        }

        // =========================================================================
        // 3. API MỚI CHO TRANG ĐĂNG KÝ MÔN (COURSES) TRÊN NEXT.JS
        // =========================================================================
        [HttpGet("available-classes/{semester}")]
        public async Task<IActionResult> GetAvailableClasses(string semester)
        {
            var classes = await _context.Classes
                .Where(c => c.Semester == semester)
                .Join(_context.Subjects, c => c.SubjectId, s => s.SubjectId, (c, s) => new { c, s })
                .ToListAsync();

            // Tính số lượng sinh viên đã đăng ký vào mỗi lớp
            var classIds = classes.Select(x => x.c.ClassId).ToList();
            var enrolledCounts = await _context.Enrollments
                .Where(e => classIds.Contains(e.ClassId))
                .GroupBy(e => e.ClassId)
                .Select(g => new { ClassId = g.Key, Count = g.Count() })
                .ToDictionaryAsync(k => k.ClassId, v => v.Count);

            var result = classes.Select(x => new
            {
                id = x.c.ClassId,
                name = x.s.SubjectName,
                credits = x.s.Credits,
                tuition = x.s.Credits * 800000, // 800k / tín chỉ
                enrolled = enrolledCounts.ContainsKey(x.c.ClassId) ? enrolledCounts[x.c.ClassId] : 0,
                capacity = x.c.MaxStudents,
                status = (enrolledCounts.ContainsKey(x.c.ClassId) && enrolledCounts[x.c.ClassId] >= x.c.MaxStudents) ? "full" : "available",
                prereq = "" // Cần thêm join bảng Prerequisite nếu muốn show
            });

            return Ok(result);
        }

        // =========================================================================
        // 4. API CHO GIẢNG VIÊN: LẤY DANH SÁCH SINH VIÊN VÀ ĐIỂM CỦA LỚP
        // =========================================================================
        [HttpGet("class-grades/{classId}")]
        public async Task<IActionResult> GetClassGrades(string classId)
        {
            // Join bảng Enrollments và Users để lấy tên sinh viên
            var grades = await _context.Enrollments
                .Where(e => e.ClassId == classId)
                .Join(_context.Users,
                      e => e.StudentId,
                      u => u.UserId,
                      (e, u) => new
                      {
                          studentId = u.UserId,
                          fullName = u.FullName,
                          processGrade = e.ProcessGrade,
                          examGrade = e.ExamGrade,
                          finalGrade = e.FinalGrade
                      })
                .OrderBy(x => x.studentId) // Sắp xếp theo MSSV
                .ToListAsync();

            return Ok(grades);
        }

        // =========================================================================
        // 5. API CHO GIẢNG VIÊN: CẬP NHẬT ĐIỂM HÀNG LOẠT
        // =========================================================================
        [HttpPut("update-grades")]
        public async Task<IActionResult> UpdateGrades([FromBody] List<SmartUni.API.Application.DTOs.GradeUpdateDto> request)
        {
            if (request == null || !request.Any()) return BadRequest("Dữ liệu điểm trống.");

            string classId = request.First().ClassId;

            // Kiểm tra xem Giáo vụ đã khóa sổ bảng điểm lớp này chưa
            var targetClass = await _context.Classes.FindAsync(classId);
            if (targetClass != null && targetClass.IsGradebookLocked)
            {
                return BadRequest("Bảng điểm của lớp này đã bị Giáo vụ khóa, không thể chỉnh sửa!");
            }

            foreach (var item in request)
            {
                var enrollment = await _context.Enrollments
                    .FirstOrDefaultAsync(e => e.StudentId == item.StudentId && e.ClassId == item.ClassId);

                if (enrollment != null)
                {
                    // Cập nhật điểm thành phần
                    enrollment.ProcessGrade = item.ProcessGrade;
                    enrollment.ExamGrade = item.ExamGrade;

                    // TỰ ĐỘNG TÍNH ĐIỂM TỔNG KẾT (Quá trình 40% - Thi 60%)
                    if (item.ProcessGrade.HasValue && item.ExamGrade.HasValue)
                    {
                        decimal final = (item.ProcessGrade.Value * 0.4m) + (item.ExamGrade.Value * 0.6m);
                        enrollment.FinalGrade = Math.Round(final, 1); // Làm tròn 1 chữ số thập phân
                    }
                    else
                    {
                        enrollment.FinalGrade = null; // Nếu thiếu 1 trong 2 cột điểm, chưa có tổng kết
                    }
                }
            }

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Đã lưu bảng điểm thành công!" });
        }

        // =========================================================================
        // 6. API CHO GIÁO VỤ: IMPORT EXCEL MÔN HỌC HÀNG LOẠT
        // =========================================================================
        [HttpPost("import-subjects")]
        public async Task<IActionResult> ImportSubjects(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("Vui lòng tải lên file Excel (.xlsx).");

            var addedSubjects = new List<Subject>();

            // EPPlus yêu cầu set LicenseContext
            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;

            using (var stream = new MemoryStream())
            {
                await file.CopyToAsync(stream);
                using (var package = new ExcelPackage(stream))
                {
                    // Lấy Sheet đầu tiên trong file Excel
                    var worksheet = package.Workbook.Worksheets.FirstOrDefault();
                    if (worksheet == null) return BadRequest("File Excel không có dữ liệu.");

                    int rowCount = worksheet.Dimension.Rows;

                    // Giả định: Cột 1 = Mã Môn, Cột 2 = Tên Môn, Cột 3 = Số Tín Chỉ
                    for (int row = 2; row <= rowCount; row++) // Bắt đầu từ dòng 2 (bỏ qua dòng Tiêu đề)
                    {
                        var subjectId = worksheet.Cells[row, 1].Value?.ToString()?.Trim();
                        var subjectName = worksheet.Cells[row, 2].Value?.ToString()?.Trim();
                        var creditsStr = worksheet.Cells[row, 3].Value?.ToString()?.Trim();

                        if (string.IsNullOrEmpty(subjectId) || string.IsNullOrEmpty(subjectName))
                            continue; // Bỏ qua dòng trống

                        int.TryParse(creditsStr, out int credits);

                        // Kiểm tra môn học này đã tồn tại trong Database chưa
                        bool isExist = await _context.Subjects.AnyAsync(s => s.SubjectId == subjectId);
                        if (!isExist)
                        {
                            addedSubjects.Add(new Subject
                            {
                                SubjectId = subjectId,
                                SubjectName = subjectName,
                                Credits = credits > 0 ? credits : 3, // Nếu cột tín chỉ rỗng/lỗi thì mặc định là 3
                                IsActive = true
                            });
                        }
                    }
                }
            }

            if (addedSubjects.Any())
            {
                _context.Subjects.AddRange(addedSubjects);
                await _context.SaveChangesAsync();
                return Ok(new { Message = $"Đã Import thành công {addedSubjects.Count} môn học mới vào hệ thống!" });
            }

            return BadRequest("Không có môn học nào được thêm (Có thể dữ liệu trống hoặc các môn đã tồn tại hết).");
        }

        // =========================================================================
        // 7. API CHO GIÁO VỤ: THÊM MÔN HỌC THỦ CÔNG
        // =========================================================================
        [HttpPost("subjects")]
        public async Task<IActionResult> AddSubject([FromBody] SubjectDto request)
        {
            if (string.IsNullOrEmpty(request.SubjectId) || string.IsNullOrEmpty(request.SubjectName))
                return BadRequest("Mã môn và tên môn không được để trống.");

            if (await _context.Subjects.AnyAsync(s => s.SubjectId == request.SubjectId))
                return BadRequest($"Mã môn {request.SubjectId} đã tồn tại trong hệ thống.");

            var subject = new Subject
            {
                SubjectId = request.SubjectId.Trim(),
                SubjectName = request.SubjectName.Trim(),
                Credits = request.Credits,
                IsActive = true
            };

            _context.Subjects.Add(subject);
            await _context.SaveChangesAsync();

            return Ok(new { Message = "Đã thêm môn học thành công." });
        }

        // =========================================================================
        // 8. API CHO GIÁO VỤ: SỬA MÔN HỌC THỦ CÔNG
        // =========================================================================
        [HttpPut("subjects/{subjectId}")]
        public async Task<IActionResult> UpdateSubject(string subjectId, [FromBody] SubjectDto request)
        {
            var subject = await _context.Subjects.FindAsync(subjectId);
            if (subject == null) return NotFound("Không tìm thấy môn học.");

            // Cập nhật thông tin (Không cho phép đổi Mã môn học vì nó là Khóa chính)
            subject.SubjectName = request.SubjectName;
            subject.Credits = request.Credits;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Cập nhật thông tin môn học thành công." });
        }
        // =========================================================================
        // 9. API LẤY THỜI KHÓA BIỂU DỰA TRÊN ROLE (STUDENT / LECTURER / STAFF)
        // =========================================================================
        [HttpGet("schedule")]
        public async Task<IActionResult> GetTimetable([FromQuery] string userId, [FromQuery] string role)
        {
            if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(role))
                return BadRequest("Thiếu thông tin người dùng hoặc quyền.");

            try
            {
                List<object> scheduleData = new List<object>();

                // ---------------------------------------------------------
                // GÓC NHÌN 1: SINH VIÊN (Lấy lịch các lớp đã đăng ký)
                // ---------------------------------------------------------
                if (role == "Student")
                {
                    var studentQuery = from e in _context.Enrollments
                                       where e.StudentId == userId
                                       join c in _context.Classes on e.ClassId equals c.ClassId
                                       join cs in _context.ClassSchedules on c.ClassId equals cs.ClassId
                                       join s in _context.Subjects on c.SubjectId equals s.SubjectId
                                       join u in _context.Users on c.LecturerId equals u.UserId into lecturerGroup
                                       from u in lecturerGroup.DefaultIfEmpty()
                                       select new
                                       {
                                           // Tạo ID giả lập duy nhất cho giao diện ghép từ Mã Lớp + Ca học
                                           id = c.ClassId + "_" + cs.ShiftId,
                                           day = cs.DayOfWeek,
                                           shiftId = cs.ShiftId,
                                           subjectCode = s.SubjectId,
                                           subjectName = s.SubjectName,
                                           // KHÔNG HARD-CODE: Lấy trực tiếp mã lớp làm Tên Nhóm
                                           @group = c.ClassId,
                                           room = cs.Room,
                                           lecturer = u != null ? u.FullName : "Chưa phân công",
                                           classCode = c.ClassId,
                                           // Lịch học ĐH thường là định kỳ hàng tuần, nên ta không cần cột Date fix cứng
                                           date = "Học hàng tuần",
                                           // KHÔNG HARD-CODE: Tự động suy luận Tiết học từ Ca học (ShiftId)
                                           period = cs.ShiftId == 1 ? "1" : (cs.ShiftId == 2 ? "4" : (cs.ShiftId == 3 ? "7" : "10")),
                                           numPeriods = "3", // Mặc định hệ thống CĐ/ĐH 1 ca = 3 tiết
                                           startTime = cs.ShiftId == 1 ? "06:45" : (cs.ShiftId == 2 ? "09:20" : (cs.ShiftId == 3 ? "12:30" : "15:05")),
                                           endTime = cs.ShiftId == 1 ? "08:30" : (cs.ShiftId == 2 ? "11:35" : (cs.ShiftId == 3 ? "14:45" : "17:15"))
                                       };

                    scheduleData = await studentQuery.Cast<object>().ToListAsync();
                }

                // ---------------------------------------------------------
                // GÓC NHÌN 2: GIẢNG VIÊN (Lấy lịch các lớp được phân công dạy)
                // ---------------------------------------------------------
                else if (role == "Lecturer")
                {
                    var lecturerQuery = from c in _context.Classes
                                        where c.LecturerId == userId
                                        join cs in _context.ClassSchedules on c.ClassId equals cs.ClassId
                                        join s in _context.Subjects on c.SubjectId equals s.SubjectId
                                        join u in _context.Users on c.LecturerId equals u.UserId into lecturerGroup
                                        from u in lecturerGroup.DefaultIfEmpty()
                                        select new
                                        {
                                            id = c.ClassId + "_" + cs.ShiftId,
                                            day = cs.DayOfWeek,
                                            shiftId = cs.ShiftId,
                                            subjectCode = s.SubjectId,
                                            subjectName = s.SubjectName,
                                            @group = c.ClassId, // KHÔNG HARD-CODE
                                            room = cs.Room,
                                            lecturer = u != null ? u.FullName : "Chưa phân công",
                                            classCode = c.ClassId,
                                            date = "Học hàng tuần",
                                            period = cs.ShiftId == 1 ? "1" : (cs.ShiftId == 2 ? "4" : (cs.ShiftId == 3 ? "7" : "10")),
                                            numPeriods = "3",
                                            startTime = cs.ShiftId == 1 ? "06:45" : (cs.ShiftId == 2 ? "09:20" : (cs.ShiftId == 3 ? "12:30" : "15:05")),
                                            endTime = cs.ShiftId == 1 ? "08:30" : (cs.ShiftId == 2 ? "11:35" : (cs.ShiftId == 3 ? "14:45" : "17:15"))
                                        };

                    scheduleData = await lecturerQuery.Cast<object>().ToListAsync();
                }

                // ---------------------------------------------------------
                // GÓC NHÌN 3: GIÁO VỤ / ADMIN (Tra cứu chéo)
                // ---------------------------------------------------------
                else if (role == "Staff" || role == "Admin")
                {
                    var targetUser = await _context.Users.FindAsync(userId);

                    if (targetUser == null)
                        return NotFound("Không tìm thấy thông tin của đối tượng cần tra cứu.");

                    if (targetUser.RoleId == 4) // Là Sinh viên
                    {
                        var targetStudentQuery = from e in _context.Enrollments
                                                 where e.StudentId == userId
                                                 join c in _context.Classes on e.ClassId equals c.ClassId
                                                 join cs in _context.ClassSchedules on c.ClassId equals cs.ClassId
                                                 join s in _context.Subjects on c.SubjectId equals s.SubjectId
                                                 join u in _context.Users on c.LecturerId equals u.UserId into lecturerGroup
                                                 from u in lecturerGroup.DefaultIfEmpty()
                                                 select new
                                                 {
                                                     id = c.ClassId + "_" + cs.ShiftId,
                                                     day = cs.DayOfWeek,
                                                     shiftId = cs.ShiftId,
                                                     subjectCode = s.SubjectId,
                                                     subjectName = s.SubjectName,
                                                     @group = c.ClassId,
                                                     room = cs.Room,
                                                     lecturer = u != null ? u.FullName : "Chưa phân công",
                                                     classCode = c.ClassId,
                                                     date = "Học hàng tuần",
                                                     period = cs.ShiftId == 1 ? "1" : (cs.ShiftId == 2 ? "4" : (cs.ShiftId == 3 ? "7" : "10")),
                                                     numPeriods = "3",
                                                     startTime = cs.ShiftId == 1 ? "06:45" : (cs.ShiftId == 2 ? "09:20" : (cs.ShiftId == 3 ? "12:30" : "15:05")),
                                                     endTime = cs.ShiftId == 1 ? "08:30" : (cs.ShiftId == 2 ? "11:35" : (cs.ShiftId == 3 ? "14:45" : "17:15"))
                                                 };
                        scheduleData = await targetStudentQuery.Cast<object>().ToListAsync();
                    }
                    else if (targetUser.RoleId == 3) // Là Giảng viên
                    {
                        var targetLecturerQuery = from c in _context.Classes
                                                  where c.LecturerId == userId
                                                  join cs in _context.ClassSchedules on c.ClassId equals cs.ClassId
                                                  join s in _context.Subjects on c.SubjectId equals s.SubjectId
                                                  join u in _context.Users on c.LecturerId equals u.UserId into lecturerGroup
                                                  from u in lecturerGroup.DefaultIfEmpty()
                                                  select new
                                                  {
                                                      id = c.ClassId + "_" + cs.ShiftId,
                                                      day = cs.DayOfWeek,
                                                      shiftId = cs.ShiftId,
                                                      subjectCode = s.SubjectId,
                                                      subjectName = s.SubjectName,
                                                      @group = c.ClassId,
                                                      room = cs.Room,
                                                      lecturer = u != null ? u.FullName : "Chưa phân công",
                                                      classCode = c.ClassId,
                                                      date = "Học hàng tuần",
                                                      period = cs.ShiftId == 1 ? "1" : (cs.ShiftId == 2 ? "4" : (cs.ShiftId == 3 ? "7" : "10")),
                                                      numPeriods = "3",
                                                      startTime = cs.ShiftId == 1 ? "06:45" : (cs.ShiftId == 2 ? "09:20" : (cs.ShiftId == 3 ? "12:30" : "15:05")),
                                                      endTime = cs.ShiftId == 1 ? "08:30" : (cs.ShiftId == 2 ? "11:35" : (cs.ShiftId == 3 ? "14:45" : "17:15"))
                                                  };
                        scheduleData = await targetLecturerQuery.Cast<object>().ToListAsync();
                    }
                }

                return Ok(scheduleData);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Lỗi hệ thống khi tải thời khóa biểu: " + ex.Message);
            }
        }
        // =========================================================================
        // 10. API CHO ADMIN/GIÁO VỤ: MỞ / ĐÓNG CỔNG ĐĂNG KÝ MÔN HỌC
        // =========================================================================
        private static bool _isRegistrationOpen = false; // Mặc định là KHÓA CỔNG

        [HttpGet("registration-status")]
        public IActionResult GetRegistrationStatus()
        {
            return Ok(new
            {
                isOpen = _isRegistrationOpen,
                semester = "HK1",
                message = _isRegistrationOpen ? "Cổng đăng ký đang mở." : "Cổng đăng ký đã đóng."
            });
        }

        // Sau này ở giao diện Giáo Vụ, bạn chỉ cần gọi API này truyền status = true/false
        [HttpPost("toggle-registration")]
        public IActionResult ToggleRegistration([FromQuery] bool status)
        {
            _isRegistrationOpen = status;
            return Ok(new { Message = $"Đã {(status ? "MỞ" : "ĐÓNG")} cổng đăng ký môn học thành công." });
        }
    }
}
    