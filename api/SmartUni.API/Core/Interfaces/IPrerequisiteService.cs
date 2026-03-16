namespace SmartUni.API.Core.Interfaces
{
    public interface IPrerequisiteService
    {
        // Hàm kiểm tra đệ quy môn tiên quyết
        Task<bool> CheckRecursivePrerequisitesAsync(string studentId, string subjectId);
    }
}