using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Application.Services
{
    public class StudentService : IStudentService
    {
        private readonly AppDbContext _context;
        private readonly IPrerequisiteService _prerequisiteService;

        public StudentService(AppDbContext context, IPrerequisiteService prerequisiteService)
        {
            _context = context;
            _prerequisiteService = prerequisiteService;
        }

        public async Task<string> RegisterCourseAsync(string studentId, string classId)
        {
            // 1. Kiểm tra lớp và môn học
            var targetClass = await _context.Classes.FindAsync(classId);
            if (targetClass == null) throw new Exception("Lớp học không tồn tại.");

            var subject = await _context.Subjects.FindAsync(targetClass.SubjectId);
            if (subject == null) throw new Exception("Môn học không tồn tại.");

            // 2. Check tiên quyết (Thuật toán đệ quy đã có)
            bool canRegister = await _prerequisiteService.CheckRecursivePrerequisitesAsync(studentId, targetClass.SubjectId);
            if (!canRegister) throw new Exception("Bạn chưa hoàn thành môn tiên quyết!");

            // 3. Thực hiện đăng ký
            _context.Enrollments.Add(new Enrollment { StudentId = studentId, ClassId = classId });

            // 4. LOGIC TÍNH TIỀN: Tạo hóa đơn tự động
            decimal unitPrice = 800000; // Giả sử 800k/tín chỉ
            decimal totalAmount = subject.Credits * unitPrice;

            var invoice = new Invoice
            {
                InvoiceID = "INV-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                StudentID = studentId,
                Amount = totalAmount,
                Description = $"Học phí môn: {subject.SubjectName}",
                IsPaid = false,
                CreatedDate = DateTime.Now
            };

            // 5. CẬP NHẬT CÔNG NỢ VÀO USER
            var student = await _context.Users.FindAsync(studentId);
            if (student != null)
            {
                student.TuitionDebt += totalAmount;
            }

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();

            return $"Đăng ký thành công {subject.SubjectName}. Số tiền phát sinh: {totalAmount:N0} VNĐ";
        }
    }
}