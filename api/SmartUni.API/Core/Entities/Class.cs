using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Classes", Schema = "academic")]
    public class Class
    {
        [Key]
        public string ClassId { get; set; } = string.Empty;
        public string? ClassName { get; set; }
        public string SubjectId { get; set; } = string.Empty;
        public string? LecturerId { get; set; }
        public string Semester { get; set; } = string.Empty;
        public int Year { get; set; }
        public int MaxStudents { get; set; } = 40;
        public bool IsGradebookLocked { get; set; } = false;
    }
}