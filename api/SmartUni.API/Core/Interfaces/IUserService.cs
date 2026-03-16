using SmartUni.API.Application.DTOs;

namespace SmartUni.API.Core.Interfaces
{
    public interface IUserService
    {
        Task<object> GetUsersAsync(int? roleId, string? keyword, string? classId, bool isActive, int page, int pageSize);
        Task<bool> DeactivateUserAsync(string userId);
    }
}