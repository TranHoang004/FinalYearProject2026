using Microsoft.AspNetCore.Mvc;
using SmartUni.API.Application.DTOs;
using SmartUni.API.Core.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    public AuthController(IAuthService authService) { _authService = authService; }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDto request)
    {
        try { return Ok(await _authService.LoginAsync(request)); }
        catch (Exception ex) { return Unauthorized(ex.Message); }
    }
}