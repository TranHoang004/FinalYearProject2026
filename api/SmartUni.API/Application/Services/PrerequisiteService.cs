using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Application.Services
{
    public class PrerequisiteService : IPrerequisiteService
    {
        private readonly AppDbContext _context;
        public PrerequisiteService(AppDbContext context) { _context = context; }

        public async Task<bool> CheckRecursivePrerequisitesAsync(string studentId, string subjectId)
        {
            // 1. Lấy danh sách các môn tiên quyết trực tiếp của môn học này
            var requiredSubjects = await _context.Prerequisites
                .Where(p => p.SubjectId == subjectId)
                .Select(p => p.PrerequisiteSubjectId)
                .ToListAsync();

            // Điểm dừng đệ quy: Nếu không yêu cầu môn tiên quyết nào -> Trả về true (Được học)
            if (!requiredSubjects.Any()) return true;

            // 2. Lấy các Lớp mà Sinh viên đã PASS (Điểm tổng kết >= 4.0)
            var passedClassIds = await _context.Enrollments
                .Where(g => g.StudentId == studentId &&
                            g.ProcessGrade.HasValue && g.ExamGrade.HasValue &&
                            (g.ProcessGrade * 0.4m + g.ExamGrade * 0.6m) >= 4.0m)
                .Select(g => g.ClassId)
                .ToListAsync();

            var passedSubjectIds = await _context.Classes
                .Where(c => passedClassIds.Contains(c.ClassId))
                .Select(c => c.SubjectId)
                .ToListAsync();

            // 3. Gọi ĐỆ QUY để kiểm tra
            foreach (var reqSubject in requiredSubjects)
            {
                // Nếu môn yêu cầu chưa có trong danh sách đã PASS -> Tạch ngay
                if (!passedSubjectIds.Contains(reqSubject))
                    return false;

                // ĐỆ QUY: Kiểm tra xem bản thân môn reqSubject có môn tiên quyết nào của nó chưa PASS không
                bool isDeepPrerequisitePassed = await CheckRecursivePrerequisitesAsync(studentId, reqSubject);
                if (!isDeepPrerequisitePassed)
                    return false;
            }

            return true;
        }
    }
}