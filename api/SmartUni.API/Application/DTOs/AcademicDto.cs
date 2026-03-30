namespace SmartUni.API.Application.DTOs
{
    // DTO dùng cho Giảng viên lưu điểm
    public class GradeUpdateDto
    {
        public string StudentId { get; set; } = string.Empty;
        public string ClassId { get; set; } = string.Empty;
        public decimal? ProcessGrade { get; set; }
        public decimal? ExamGrade { get; set; }
    }
    public class SubjectDto
    {
        public string SubjectId { get; set; } = string.Empty;
        public string SubjectName { get; set; } = string.Empty;
        public int Credits { get; set; }
    }

    public class UpdateStatusDto
    {
        public string Status { get; set; } = string.Empty; // VD: "Bảo lưu", "Thôi học", "Đã tốt nghiệp"
        public string Reason { get; set; } = string.Empty; // Lý do cụ thể
        public string PerformedBy { get; set; } = string.Empty; // Mã Giáo vụ thực hiện
    }
}