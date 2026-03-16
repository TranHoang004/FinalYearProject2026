using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Application.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        public UserService(AppDbContext context) => _context = context;

        public async Task<object> GetUsersAsync(int? roleId, string? keyword, string? classId, bool isActive, int page, int pageSize)
        {
            var query = _context.Users
                .Include(u => u.Role)
                .Where(u => u.IsActive == isActive) // Lọc theo trạng thái hoạt động
                .AsQueryable();

            if (roleId.HasValue) query = query.Where(u => u.RoleId == roleId);
            if (!string.IsNullOrEmpty(classId)) query = query.Where(u => u.AdminClassId == classId);
            if (!string.IsNullOrEmpty(keyword))
                query = query.Where(u => u.UserId.Contains(keyword) || u.FullName.Contains(keyword));

            var total = await query.CountAsync();

            // SOLID: Phân trang luôn đi kèm OrderBy để đảm bảo dữ liệu không bị nhảy lộn xộn
            var data = await query
                .OrderBy(u => u.UserId)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return new { Total = total, Data = data, CurrentPage = page };
        }

        public async Task<bool> DeactivateUserAsync(string userId)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null) return false;

            user.IsActive = false; // Vô hiệu hóa thay vì xóa thật (Soft Delete)
            await _context.SaveChangesAsync();
            return true;
        }
    }
}