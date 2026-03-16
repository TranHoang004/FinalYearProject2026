using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Infrastructure.Data;
using System.Text.Json;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AttendanceController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AttendanceController(AppDbContext context) { _context = context; }

        [HttpPost]
        public async Task<IActionResult> SubmitAttendance(List<AttendanceRecord> records)
        {
            _context.AttendanceRecords.AddRange(records);

            var log = new AuditLog
            {
                Action = "SUBMIT_ATTENDANCE",
                TableName = "AttendanceRecords",
                // Đã đổi CourseID thành ClassId chuẩn xác
                NewValues = JsonSerializer.Serialize(new { Count = records.Count, Course = records.FirstOrDefault()?.ClassId }),
                Timestamp = DateTime.Now
            };
            _context.AuditLogs.Add(log);

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Điểm danh thành công và đã ghi Log hệ thống!" });
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttendanceRecord>>> GetHistory(string? studentId = null, string? classId = null)
        {
            var query = _context.AttendanceRecords.AsQueryable();

            // Đã đổi StudentID thành StudentId và CourseID thành ClassId
            if (!string.IsNullOrEmpty(studentId)) query = query.Where(a => a.StudentId == studentId);
            if (!string.IsNullOrEmpty(classId)) query = query.Where(a => a.ClassId == classId);

            return await query.OrderByDescending(a => a.SessionDate).ToListAsync();
        }
    }
}