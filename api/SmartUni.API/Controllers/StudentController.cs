using Microsoft.AspNetCore.Mvc;
using SmartUni.API.Core.Interfaces;

[Route("api/[controller]")]
[ApiController]
public class StudentController : ControllerBase
{
    private readonly IStudentService _studentService;
    public StudentController(IStudentService studentService) { _studentService = studentService; }

    [HttpPost("register-course")]
    public async Task<IActionResult> RegisterCourse(string studentId, string classId)
    {
        try { return Ok(new { Message = await _studentService.RegisterCourseAsync(studentId, classId) }); }
        catch (Exception ex) { return BadRequest(ex.Message); }
    }
}