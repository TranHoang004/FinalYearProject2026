using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("ClassSchedules", Schema = "academic")]
    public class ClassSchedule
    {
        [Key]
        public int Id { get; set; }
        public string ClassId { get; set; } = string.Empty;
        public string Room { get; set; } = string.Empty; // VD: B-07.06
        public string DayOfWeek { get; set; } = string.Empty; // VD: THỨ 4, THỨ 5
        public int ShiftId { get; set; } // 1, 2, 3, 4
        public string Period { get; set; } = string.Empty; // VD: 4-6
    }
}