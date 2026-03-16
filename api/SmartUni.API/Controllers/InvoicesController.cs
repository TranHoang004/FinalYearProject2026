using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InvoicesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IInvoiceService _invoiceService;

        public InvoicesController(AppDbContext context, IInvoiceService invoiceService)
        {
            _context = context;
            _invoiceService = invoiceService;
        }

        /// <summary>
        /// Lấy danh sách toàn bộ hóa đơn của một sinh viên (Đã đóng và chưa đóng)
        /// </summary>
        [HttpGet("student/{studentId}")]
        public async Task<ActionResult<IEnumerable<Invoice>>> GetStudentInvoices(string studentId)
        {
            var invoices = await _context.Invoices
                .Where(i => i.StudentID == studentId)
                .OrderByDescending(i => i.CreatedDate)
                .ToListAsync();

            if (invoices == null || !invoices.Any())
            {
                return NotFound($"Không tìm thấy hóa đơn nào cho sinh viên ID: {studentId}");
            }

            return Ok(invoices);
        }

        /// <summary>
        /// Kiểm tra tổng số tiền nợ học phí hiện tại của sinh viên
        /// </summary>
        [HttpGet("debt/{studentId}")]
        public async Task<IActionResult> GetTotalDebt(string studentId)
        {
            try
            {
                var totalDebt = await _invoiceService.GetTotalDebtAsync(studentId);
                return Ok(new
                {
                    StudentId = studentId,
                    TotalDebt = totalDebt,
                    Currency = "VND",
                    Status = totalDebt > 0 ? "Còn nợ" : "Đã hoàn thành học phí"
                });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Tạo hóa đơn thủ công (Dùng cho các khoản phí phát sinh ngoài học phí môn học)
        /// </summary>
        [HttpPost("create")]
        public async Task<IActionResult> CreateManualInvoice(string studentId, decimal amount, string description)
        {
            try
            {
                var invoice = await _invoiceService.CreateInvoiceAsync(studentId, amount, description);
                return Ok(new { Message = "Tạo hóa đơn thành công", Invoice = invoice });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Thanh toán hóa đơn: Cập nhật trạng thái IsPaid và tự động trừ nợ trong bảng Users
        /// </summary>
        [HttpPost("pay/{invoiceId}")]
        public async Task<IActionResult> PayInvoice(string invoiceId)
        {
            try
            {
                var isSuccess = await _invoiceService.PayInvoiceAsync(invoiceId);

                if (isSuccess)
                {
                    return Ok(new
                    {
                        Message = "Thanh toán thành công!",
                        Time = DateTime.Now,
                        Status = "Học phí đã được khấu trừ vào tổng nợ."
                    });
                }

                return BadRequest("Thanh toán thất bại. Hóa đơn có thể không tồn tại hoặc đã được thanh toán trước đó.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Lỗi hệ thống: {ex.Message}");
            }
        }
    }
}