using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Subjects", Schema = "academic")]
    public class Subject
    {
        [Key]
        public string SubjectId { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public int Credits { get; set; }
        public bool IsActive { get; set; } = true;
    }
}