using SmartUni.API.Core.Entities;

namespace SmartUni.API.Core.Interfaces
{
    public interface IInvoiceService
    {
        Task<Invoice> CreateInvoiceAsync(string studentId, decimal amount, string description);
        Task<bool> PayInvoiceAsync(string invoiceId); // Thanh toán và trừ nợ
        Task<decimal> GetTotalDebtAsync(string studentId); // Check công nợ hiện tại
    }
}