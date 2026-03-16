USE SmartUniversityERP;
GO

CREATE TABLE AttendanceRecords (
    RecordID INT IDENTITY(1,1) PRIMARY KEY,
    CourseID VARCHAR(20) NOT NULL,
    StudentID VARCHAR(20) NOT NULL,
    SessionDate DATETIME DEFAULT GETDATE(),
    Status VARCHAR(10) NOT NULL,
    Note NVARCHAR(500),
    RecordedBy VARCHAR(20)
);
GO