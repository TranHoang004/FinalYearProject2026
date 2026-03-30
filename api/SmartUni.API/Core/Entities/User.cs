using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SmartUni.API.Core.Entities
{
    [Table("Users", Schema = "auth")]
    public class User
    {
        [Key]
        public string UserId { get; set; } = string.Empty; // MSSV, Mã GV
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string PasswordHash { get; set; } = string.Empty;
        public int? RoleId { get; set; }
        public bool IsFirstLogin { get; set; } = true;
        public bool IsActive { get; set; } = true;
        public decimal TuitionDebt { get; set; } = 0;
        public string? AdminClassId { get; set; }
        public string? MajorId { get; set; }
        public string? AvatarUrl { get; set; }
        public string? Phone { get; set; }
        public string? Address { get; set; }

        [ForeignKey("RoleId")]
        public virtual Role? Role { get; set; }
    }
}