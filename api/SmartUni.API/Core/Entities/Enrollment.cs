using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Enrollments", Schema = "academic")] 
    public class Enrollment
    {

        public string StudentId { get; set; } 
        public string ClassId { get; set; }   
        public decimal? ProcessGrade { get; set; }
        public decimal? ExamGrade { get; set; }
        public decimal? FinalGrade { get; set; }
    }
}