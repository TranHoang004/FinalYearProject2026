using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Application.DTOs;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;
using System.Threading.Tasks;

namespace SmartUni.API.Controllers
{
    // ==========================================================
    // DTO HỨNG DỮ LIỆU TỪ FRONTEND KHI ĐỔI MẬT KHẨU
    // ==========================================================
    public class ChangePasswordDto
    {
        public string UserId { get; set; } = string.Empty;
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly AppDbContext _context; // Inject thêm DbContext để gọi DB

        // Cập nhật Constructor để nhận cả AuthService và AppDbContext
        public AuthController(IAuthService authService, AppDbContext context)
        {
            _authService = authService;
            _context = context;
        }

        // ==========================================================
        // 1. API ĐĂNG NHẬP (GIỮ NGUYÊN)
        // ==========================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
        {
            try
            {
                return Ok(await _authService.LoginAsync(request));
            }
            catch (Exception ex)
            {
                return Unauthorized(ex.Message);
            }
        }

        // ==========================================================
        // 2. API ÉP ĐỔI MẬT KHẨU LẦN ĐẦU (FIRST LOGIN)
        // ==========================================================
        [HttpPost("change-initial-password")]
        public async Task<IActionResult> ChangeInitialPassword([FromBody] ChangePasswordDto request)
        {
            // 1. Tìm user trong cơ sở dữ liệu
            var user = await _context.Users.FindAsync(request.UserId);
            if (user == null) return NotFound("Tài khoản không tồn tại.");

            // 2. Xác thực mật khẩu cũ (Mật khẩu mặc định Giáo vụ/Admin cấp)
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash);
            if (!isPasswordValid) return BadRequest("Mật khẩu hiện tại không chính xác.");

            // 3. Mã hóa mật khẩu mới và lưu vào database
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);

            // 4. TẮT CỜ IsFirstLogin (Bước chốt chặn để luồng Authenticate User cho phép vào hệ thống)
            user.IsFirstLogin = false;

            await _context.SaveChangesAsync();

            return Ok(new { Message = "Đổi mật khẩu thành công. Vui lòng đăng nhập lại bằng mật khẩu mới!" });
        }
    }
}