using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Invoices")]
    public class Invoice
    {
        [Key] public string InvoiceID { get; set; }
        public string StudentID { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public bool IsPaid { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}