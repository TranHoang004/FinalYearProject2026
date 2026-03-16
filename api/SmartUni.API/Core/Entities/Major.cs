using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Majors")]
    public class Major
    {
        [Key]
        public string MajorID { get; set; }    // VD: IT
        public string MajorName { get; set; }  // VD: Công nghệ thông tin
        public string CodeText { get; set; }   // VD: BOIT
        public string CodeNumber { get; set; } // VD: 5403
    }
}