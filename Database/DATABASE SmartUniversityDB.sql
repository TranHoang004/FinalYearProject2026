-- 1. TẠO DATABASE
CREATE DATABASE SmartUniversityDB;
GO

USE SmartUniversityDB;
GO

-- 2. TẠO BẢNG LỚP HỌC (CLASSES)
CREATE TABLE Classes (
    ClassID VARCHAR(20) PRIMARY KEY, -- Mã lớp (VD: IT001)
    SubjectName NVARCHAR(100) NOT NULL,
    LecturerName NVARCHAR(50),
    TimeSlot NVARCHAR(50) -- VD: "Thu 2, Ca 1 (7h-9h)"
);
GO

-- 3. TẠO BẢNG SINH VIÊN (STUDENTS)
CREATE TABLE Students (
    StudentID VARCHAR(20) PRIMARY KEY, -- Mã SV (VD: SV001)
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100),
    ClassID VARCHAR(20) REFERENCES Classes(ClassID), -- Link tới bảng Lớp
    TuitionBalance DECIMAL(18, 0) DEFAULT 0 -- Công nợ học phí
);
GO

-- 4. TẠO BẢNG ĐIỂM DANH (ATTENDANCE) - QUAN TRỌNG NHẤT
CREATE TABLE AttendanceRecords (
    RecordID INT IDENTITY(1,1) PRIMARY KEY,
    SessionDate DATE NOT NULL, -- Ngày điểm danh
    StudentID VARCHAR(20) REFERENCES Students(StudentID),
    ClassID VARCHAR(20) REFERENCES Classes(ClassID),
    Status VARCHAR(10) CHECK (Status IN ('P', 'A', 'L', 'AP')), -- 4 Trạng thái
    CheckInTime DATETIME, -- Giờ bấm nút
    LateMinutes INT DEFAULT 0, -- Số phút đi muộn
    Note NVARCHAR(200) -- Lý do (nếu có)
);
GO

-- 5. THÊM VÀI DỮ LIỆU MẪU ĐỂ TEST
INSERT INTO Classes VALUES ('NET101', N'Lập trình .NET Core', N'Thầy Hoàng', 'T2-Ca1');
INSERT INTO Students VALUES ('SV01', N'Nguyễn Văn A', 'a@school.edu', 'NET101', 5000000);
INSERT INTO Students VALUES ('SV02', N'Trần Thị B', 'b@school.edu', 'NET101', 0);
INSERT INTO Students VALUES ('SV03', N'Lê C', 'c@school.edu', 'NET101', 2500000);

SELECT * FROM Students; -- Chạy thử xem có ra 3 dòng không