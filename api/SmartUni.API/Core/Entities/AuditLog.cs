using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("AuditLogs", Schema = "system")]
    public class AuditLog
    {
        [Key]
        public int Id { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string? UserId { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? TableName { get; set; }
        public string? OldValues { get; set; }
        public string? NewValues { get; set; }
    }
}