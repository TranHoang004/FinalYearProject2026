namespace SmartUni.API.Application.DTOs
{
    public class DashboardResponseDto
    {
        public StudentInfoDto Student { get; set; } = new();
        public GpaInfoDto Gpa { get; set; } = new();
        public CreditInfoDto Credits { get; set; } = new();
        public CourseSummaryDto Courses { get; set; } = new();
        public TuitionDto Tuition { get; set; } = new();
        public List<ScheduleDto> Schedule { get; set; } = new();
    }

    public class StudentInfoDto
    {
        public string FirstName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string Id { get; set; } = string.Empty;
        public string Major { get; set; } = string.Empty;
        public string Term { get; set; } = "Spring 2026"; // Có thể query từ config
        public int TodoCount { get; set; } = 0;
    }

    public class GpaInfoDto
    {
        public double Current { get; set; }
        public double Max { get; set; } = 4.0;
        public double Target { get; set; } = 3.5;
        public int Percent { get; set; }
        public string Trend { get; set; } = "+ 0.00";
        public string Rank { get; set; } = "Top 5%";
    }

    public class CreditInfoDto
    {
        public int Earned { get; set; }
        public int Total { get; set; } = 120;
        public string CompletedPercent { get; set; } = "0%";
    }

    public class CourseSummaryDto
    {
        public int Current { get; set; }
        public int TotalCredits { get; set; }
    }

    public class TuitionDto
    {
        public decimal TotalOutstanding { get; set; }
    }

    public class ScheduleDto
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Code { get; set; } = string.Empty;
        public string Time { get; set; } = string.Empty;
        public string Location { get; set; } = string.Empty;
    }
}