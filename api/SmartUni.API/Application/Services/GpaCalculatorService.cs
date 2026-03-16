using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;
using System.Text.Json;

namespace SmartUni.API.Application.Services
{
    public class GpaCalculatorService : IGpaCalculatorService
    {
        private readonly AppDbContext _context;
        public GpaCalculatorService(AppDbContext context) { _context = context; }

        public async Task<double> CalculateRealtimeGpaAsync(string studentId)
        {
            // 1. Lấy toàn bộ điểm các môn đã có điểm thi
            var grades = await _context.Enrollments
                .Where(g => g.StudentId == studentId && g.ProcessGrade.HasValue && g.ExamGrade.HasValue)
                .ToListAsync();

            if (!grades.Any()) return 0.0;

            // 2. Lấy số Tín chỉ của từng lớp để tính trọng số
            var classIds = grades.Select(g => g.ClassId).ToList();
            var classes = await _context.Classes
                .Where(c => classIds.Contains(c.ClassId))
                .ToDictionaryAsync(c => c.ClassId, c => c.SubjectId);

            var subjectIds = classes.Values.Distinct().ToList();
            var subjects = await _context.Subjects
                .Where(s => subjectIds.Contains(s.SubjectId))
                .ToDictionaryAsync(s => s.SubjectId, s => s.Credits);

            // 3. Đọc cấu hình Động (Dynamic Config) từ Database xem trường đang dùng Thang điểm nào
            var config = await _context.DynamicConfigs.FirstOrDefaultAsync(c => c.ConfigKey == "GRADE_SCALE");
            bool isScale4 = config != null && config.ConfigValue.Contains("Scale4"); // Logic đọc JSON đơn giản hóa

            double totalPoints = 0;
            int totalCredits = 0;

            // 4. Bắt đầu tính toán
            foreach (var grade in grades)
            {
                string subjectId = classes[grade.ClassId];
                int credits = subjects[subjectId];

                double finalScore10 = (double)(grade.ProcessGrade.Value * 0.4m + grade.ExamGrade.Value * 0.6m);

                // Nếu trường cấu hình Thang 4, tự động quy đổi ở đây
                double finalScoreToCalc = isScale4 ? ConvertToScale4(finalScore10) : finalScore10;

                totalPoints += finalScoreToCalc * credits;
                totalCredits += credits;
            }

            return Math.Round(totalPoints / totalCredits, 2);
        }

        private double ConvertToScale4(double score10)
        {
            if (score10 >= 8.5) return 4.0;
            if (score10 >= 7.0) return 3.0;
            if (score10 >= 5.5) return 2.0;
            if (score10 >= 4.0) return 1.0;
            return 0.0;
        }
    }
}