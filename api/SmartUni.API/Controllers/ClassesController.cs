using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClassesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Class>>> GetClasses(string? lecturerId = null, string? semester = null)
        {
            var query = _context.Classes.AsQueryable();

            if (!string.IsNullOrEmpty(lecturerId)) query = query.Where(c => c.LecturerId == lecturerId);
            if (!string.IsNullOrEmpty(semester)) query = query.Where(c => c.Semester == semester);

            return await query.ToListAsync();
        }

        // =========================================================================
        // API CHO GIÁO VỤ: KHÓA/MỞ KHÓA BẢNG ĐIỂM CỦA MỘT LỚP HỌC PHẦN
        // =========================================================================
        [HttpPut("{classId}/toggle-lock")]
        public async Task<IActionResult> ToggleGradebookLock(string classId)
        {
            var targetClass = await _context.Classes.FindAsync(classId);
            if (targetClass == null) return NotFound("Không tìm thấy lớp học phần.");

            // Đảo ngược trạng thái hiện tại (Đang khóa -> Mở, Đang mở -> Khóa)
            targetClass.IsGradebookLocked = !targetClass.IsGradebookLocked;

            // Tùy chọn: Có thể ghi thêm AuditLog ở đây để biết Giáo vụ nào đã khóa sổ

            await _context.SaveChangesAsync();

            string statusText = targetClass.IsGradebookLocked ? "ĐÃ KHÓA SỔ" : "ĐÃ MỞ KHÓA";
            return Ok(new
            {
                Message = $"Cập nhật thành công! Trạng thái bảng điểm lớp {targetClass.ClassId} hiện tại: {statusText}.",
                IsLocked = targetClass.IsGradebookLocked
            });
        }
    }
}