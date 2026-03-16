using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;
using SmartUni.API.Infrastructure.Data;

namespace SmartUni.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClassesController : ControllerBase
    {
        private readonly AppDbContext _context;
        public ClassesController(AppDbContext context) { _context = context; }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Class>>> GetClasses(string? lecturerId = null, string? semester = null)
        {
            var query = _context.Classes.AsQueryable();

            if (!string.IsNullOrEmpty(lecturerId)) query = query.Where(c => c.LecturerId == lecturerId);
            if (!string.IsNullOrEmpty(semester)) query = query.Where(c => c.Semester == semester);

            return await query.ToListAsync();
        }
    }
}