using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Curriculums", Schema = "academic")]
    public class Curriculum
    {
        // Khóa chính 3 cột sẽ được cấu hình bằng Fluent API trong AppDbContext
        public string MajorId { get; set; } = string.Empty;
        public string SubjectId { get; set; } = string.Empty;
        public string Cohort { get; set; } = $"K{DateTime.Now.Year}";

        public string? KnowledgeBlock { get; set; }
        public bool IsCompulsory { get; set; } = true;
        public int? RecommendedSemester { get; set; }
    }
}