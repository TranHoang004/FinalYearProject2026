using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Application.Services
{
    public class IdGeneratorService : IIdGeneratorService
    {
        private readonly AppDbContext _context;
        public IdGeneratorService(AppDbContext context) { _context = context; }

        public async Task<string> GenerateStudentIdAsync(string majorId)
        {
            // 1. Lấy thông tin ngành để lấy CodeNumber (VD: 5403)
            var major = await _context.Majors.FindAsync(majorId);
            if (major == null) throw new Exception("Ngành học không tồn tại trong hệ thống!");

            // 2. Format: [Năm 2 số] + [Mã số ngành] + [STT 4 số] -> VD: 2654030001
            string year = DateTime.Now.ToString("yy");
            string prefix = $"{year}{major.CodeNumber}";

            var lastStudent = await _context.Users
                .Where(u => u.RoleId == 4 && u.UserId.StartsWith(prefix))
                .OrderByDescending(u => u.UserId)
                .FirstOrDefaultAsync();

            int nextNum = 1;
            if (lastStudent != null)
            {
                string numPart = lastStudent.UserId.Substring(prefix.Length);
                if (int.TryParse(numPart, out int currentNum)) nextNum = currentNum + 1;
            }
            return $"{prefix}{nextNum:D4}";
        }

        public async Task<string> GenerateClassIdAsync(string majorId)
        {
            // 1. Lấy thông tin ngành để lấy CodeText (VD: BOIT)
            var major = await _context.Majors.FindAsync(majorId);
            if (major == null) throw new Exception("Ngành học không tồn tại trong hệ thống!");

            // 2. Format: [Năm 2 số] + [Mã chữ ngành] + [STT 2 số] -> VD: 26BOIT01
            string year = DateTime.Now.ToString("yy");
            string prefix = $"{year}{major.CodeText}";

            // LƯU Ý: Ở đây ta truy vấn vào AdminClassId của Users (hoặc bảng AdministrativeClass nếu bạn tạo lại)
            // Tạm thời query user để đếm số lượng lớp hành chính đã có
            var lastStudentInMaxClass = await _context.Users
                .Where(u => u.AdminClassId != null && u.AdminClassId.StartsWith(prefix))
                .OrderByDescending(u => u.AdminClassId)
                .FirstOrDefaultAsync();

            int nextNum = 1;
            if (lastStudentInMaxClass != null && lastStudentInMaxClass.AdminClassId != null)
            {
                string numPart = lastStudentInMaxClass.AdminClassId.Substring(prefix.Length);
                if (int.TryParse(numPart, out int currentNum)) nextNum = currentNum + 1;
            }
            return $"{prefix}{nextNum:D2}";
        }
    }
}