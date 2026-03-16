namespace SmartUni.API.Core.Interfaces
{
    public interface IStudentService
    {
        Task<string> RegisterCourseAsync(string studentId, string classId);
    }
}