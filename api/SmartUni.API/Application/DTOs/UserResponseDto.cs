namespace SmartUni.API.Application.DTOs
{
    public class UserResponseDto
    {
        public string UserId { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }

        // Thay vì trả về nguyên object Role phức tạp, ta chỉ trả về Tên Quyền (Ví dụ: "Student")
        public string? RoleName { get; set; }

        public bool IsActive { get; set; }
        public decimal TuitionDebt { get; set; }
        public string? AdminClassId { get; set; }
        public string? MajorId { get; set; }
    }
}