using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Application.Services
{
    public class InvoiceService : IInvoiceService
    {
        private readonly AppDbContext _context;
        public InvoiceService(AppDbContext context) => _context = context;

        public async Task<Invoice> CreateInvoiceAsync(string studentId, decimal amount, string description)
        {
            var student = await _context.Users.FindAsync(studentId);
            if (student == null) throw new Exception("Không tìm thấy sinh viên.");

            var invoice = new Invoice
            {
                InvoiceID = "INV" + DateTime.Now.ToString("yyyyMMddHHmmss"),
                StudentID = studentId,
                Amount = amount,
                Description = description,
                IsPaid = false,
                CreatedDate = DateTime.Now
            };

            // Logic: Tạo hóa đơn là nợ tăng lên ngay lập tức
            student.TuitionDebt += amount;

            _context.Invoices.Add(invoice);
            await _context.SaveChangesAsync();
            return invoice;
        }

        public async Task<bool> PayInvoiceAsync(string invoiceId)
        {
            var invoice = await _context.Invoices.FirstOrDefaultAsync(i => i.InvoiceID == invoiceId);
            if (invoice == null || invoice.IsPaid) return false;

            var student = await _context.Users.FindAsync(invoice.StudentID);
            if (student != null)
            {
                // Logic: Đóng tiền thành công thì trừ nợ
                student.TuitionDebt -= invoice.Amount;
                if (student.TuitionDebt < 0) student.TuitionDebt = 0; // Tránh nợ âm
            }

            invoice.IsPaid = true;
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<decimal> GetTotalDebtAsync(string studentId)
        {
            var student = await _context.Users.FindAsync(studentId);
            return student?.TuitionDebt ?? 0;
        }
    }
}