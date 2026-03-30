using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Application.DTOs; 
using SmartUni.API.Core.Entities;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    public class CreateInternalUserDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int RoleId { get; set; } // 2: Staff, 3: Lecturer
    }

    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<object>> GetUsers(
            int? roleId = null, string? keyword = null, string? classId = null, bool isActive = true, int page = 1, int pageSize = 10)
        {
            var query = _context.Users.Include(u => u.Role).AsQueryable();

            query = query.Where(u => u.IsActive == isActive);

            if (roleId.HasValue) query = query.Where(u => u.RoleId == roleId);
            if (!string.IsNullOrEmpty(classId)) query = query.Where(u => u.AdminClassId == classId);
            if (!string.IsNullOrEmpty(keyword)) query = query.Where(u => u.UserId.Contains(keyword) || u.FullName.Contains(keyword));

            var totalRecords = await query.CountAsync();

            // SỬ DỤNG DTO TẠI ĐÂY: Ánh xạ từ User sang UserResponseDto
            var data = await query.OrderBy(u => u.UserId)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(u => new UserResponseDto
                {
                    UserId = u.UserId,
                    FullName = u.FullName,
                    Email = u.Email,
                    RoleName = u.Role != null ? u.Role.RoleName : "Chưa phân quyền",
                    IsActive = u.IsActive,
                    TuitionDebt = u.TuitionDebt,
                    AdminClassId = u.AdminClassId,
                    MajorId = u.MajorId
                })
                .ToListAsync();

            return Ok(new { TotalRecords = totalRecords, Page = page, PageSize = pageSize, Data = data });
        }

        // PUT: Vô hiệu hóa (Khóa/Xóa mềm) người dùng
        [HttpPut("deactivate/{userId}")]
        public async Task<IActionResult> DeactivateUser(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            if (!user.IsActive) return BadRequest("Tài khoản này đã bị khóa từ trước.");

            // Đổi cờ IsActive thành false thay vì xóa thẳng khỏi DB
            user.IsActive = false;

            // Tự động ghi Log hệ thống
            var log = new AuditLog
            {
                UserId = userId, // ID người bị khóa
                Action = "DEACTIVATE_USER",
                TableName = "Users",
                Timestamp = DateTime.Now,
                NewValues = "IsActive: false"
            };
            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Đã khóa tài khoản {user.FullName} ({userId}) thành công!" });
        }

        // PUT: Cập nhật trạng thái học vụ (Soft Delete an toàn)
        [HttpPut("{userId}/academic-status")]
        public async Task<IActionResult> UpdateAcademicStatus(string userId, [FromBody] UpdateStatusDto request)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return NotFound("Không tìm thấy người dùng.");

            // 1. Chuyển trạng thái IsActive (Soft Delete để cấm đăng nhập)
            // Nếu là "Đang học" thì mở lại, còn lại các trạng thái khác đều khóa tài khoản
            user.IsActive = request.Status == "Đang học";

            // 2. Ghi nhận dữ liệu cũ vào Log (Đúng chuẩn sao lưu trước khi cập nhật)
            string oldDataBackup = System.Text.Json.JsonSerializer.Serialize(new
            {
                Status = user.IsActive ? "Đang hoạt động" : "Đã khóa",
                Debt = user.TuitionDebt,
                Class = user.AdminClassId
            });

            // 3. Khởi tạo Audit Log kèm Lý do thay đổi
            var log = new AuditLog
            {
                UserId = request.PerformedBy, // Người thực hiện (Staff/Admin)
                Action = "UPDATE_ACADEMIC_STATUS",
                TableName = "Users",
                Timestamp = DateTime.Now,
                OldValues = oldDataBackup,
                NewValues = $"TargetUser: {userId} | NewStatus: {request.Status} | Reason: {request.Reason}"
            };

            _context.AuditLogs.Add(log);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Message = $"Đã cập nhật trạng thái của {user.FullName} thành '{request.Status}'.",
                LogRecorded = true
            });
        }

        // =========================================================================
        // API CHO IT ADMIN: TẠO TÀI KHOẢN GIÁO VỤ / GIẢNG VIÊN
        // =========================================================================
        [HttpPost("create-internal")]
        public async Task<IActionResult> CreateInternalUser([FromBody] CreateInternalUserDto request)
        {
            if (await _context.Users.AnyAsync(u => u.UserId == request.UserId))
                return BadRequest("Mã đăng nhập này đã tồn tại trong hệ thống.");

            var user = new User
            {
                UserId = request.UserId.Trim(),
                FullName = request.FullName.Trim(),
                Email = request.Email.Trim(),
                RoleId = request.RoleId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("123456"), // Mật khẩu mặc định
                IsFirstLogin = true, // BẮT BUỘC ĐỔI MẬT KHẨU LẦN ĐẦU
                IsActive = true,
                TuitionDebt = 0
            };

            _context.Users.Add(user);

            // Ghi Log hệ thống
            _context.AuditLogs.Add(new AuditLog
            {
                UserId = "admin", // IT Admin thực hiện
                Action = "CREATE_INTERNAL_USER",
                TableName = "Users",
                Timestamp = DateTime.Now,
                NewValues = $"Created: {user.UserId} | Role: {user.RoleId}"
            });

            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Đã cấp tài khoản {user.UserId} thành công! Mật khẩu mặc định là 123456." });
        }
    }
}