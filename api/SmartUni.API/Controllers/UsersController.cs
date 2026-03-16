using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Application.DTOs; // Thêm using DTO
using SmartUni.API.Core.Entities;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
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
    }
}