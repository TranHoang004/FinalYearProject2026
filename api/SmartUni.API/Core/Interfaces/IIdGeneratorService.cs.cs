namespace SmartUni.API.Core.Interfaces
{
    public interface IIdGeneratorService
    {
        Task<string> GenerateStudentIdAsync(string majorId);
        Task<string> GenerateClassIdAsync(string majorId);
    }
}