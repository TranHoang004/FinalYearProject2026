namespace SmartUni.API.Application.DTOs
{
    // Cấu trúc Data Frontend gửi lên (Chỉ nhận đúng 2 trường này, chống truyền dữ liệu rác)
    public class LoginRequestDto
    {
        public string UserId { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }

    // Cấu trúc Data Backend trả về khi Login thành công
    public class AuthResponseDto
    {
        public string Message { get; set; } = string.Empty;
        public string Token { get; set; } = string.Empty;
        public string? Role { get; set; }
        public UserResponseDto? UserInfo { get; set; } // Chứa thông tin an toàn của User
    }
}