namespace SmartUni.API.Core.Interfaces
{
    public interface IGpaCalculatorService
    {
        // Hàm tính GPA Real-time dựa trên Cấu hình động
        Task<double> CalculateRealtimeGpaAsync(string studentId);
    }
}