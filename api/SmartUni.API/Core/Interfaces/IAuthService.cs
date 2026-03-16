using SmartUni.API.Application.DTOs;

namespace SmartUni.API.Core.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    }
}