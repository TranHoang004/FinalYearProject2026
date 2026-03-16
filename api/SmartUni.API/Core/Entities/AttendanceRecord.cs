using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("AttendanceRecords")]
    public class AttendanceRecord
    {
        [Key]
        public int RecordId { get; set; }

        public string ClassId { get; set; }
        public string StudentId { get; set; }
        public DateTime SessionDate { get; set; } = DateTime.Now;

        // P=Present (Có mặt), A=Absent (Vắng), L=Late (Muộn), AP=Permitted (Có phép)
        public string Status { get; set; } 

        public string? Note { get; set; }
        public string? RecordedBy { get; set; }
    }
}