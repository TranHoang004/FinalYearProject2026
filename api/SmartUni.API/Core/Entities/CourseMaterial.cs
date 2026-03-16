using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("CourseMaterials")]
    public class CourseMaterial
    {
        [Key]
        public int MaterialID { get; set; }
        public string CourseID { get; set; }
        public string? UploadedBy { get; set; }
        public string Title { get; set; }
        public string? FileUrl { get; set; } // Link file (PDF/Doc)

        // Slide, Assignment (Bài tập), Announce (Thông báo)
        public string Type { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}