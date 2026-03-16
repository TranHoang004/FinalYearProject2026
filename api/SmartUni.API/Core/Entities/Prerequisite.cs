using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Prerequisites", Schema = "academic")]
    public class Prerequisite
    {
        // Bảng này dùng Composite Key (Khóa chính kép) nên sẽ config ở AppDbContext
        public string SubjectId { get; set; } = string.Empty;
        public string PrerequisiteSubjectId { get; set; } = string.Empty;
    }
}