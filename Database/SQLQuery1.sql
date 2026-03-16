-- 1. TẠO DATABASE
CREATE DATABASE SmartUniversityERP;
GO

USE SmartUniversityERP;
GO

-- 2. TẠO SCHEMA ĐỂ PHÂN VÙNG DỮ LIỆU (Clean Database)
CREATE SCHEMA [auth];
GO
CREATE SCHEMA [system];
GO
CREATE SCHEMA [academic];
GO

-- ==========================================
-- PHÂN HỆ AUTHENTICATION (auth)
-- ==========================================
CREATE TABLE [auth].[Roles] (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    RoleName NVARCHAR(50) UNIQUE NOT NULL -- Admin, Academic, Lecturer, Student
);

CREATE TABLE [auth].[Users] (
    UserId VARCHAR(20) PRIMARY KEY, -- Chính là MSSV, Mã GV, Mã Admin
    FullName NVARCHAR(100) NOT NULL,
    Email VARCHAR(100) UNIQUE,
    PasswordHash NVARCHAR(MAX) NOT NULL,
    RoleId INT REFERENCES [auth].[Roles](Id),
    IsFirstLogin BIT DEFAULT 1, -- Ép đổi mật khẩu lần đầu
    IsActive BIT DEFAULT 1
);

-- ==========================================
-- PHÂN HỆ SYSTEM (system) - THAY THẾ ELK
-- ==========================================
CREATE TABLE [system].[DynamicConfigs] (
    ConfigKey VARCHAR(50) PRIMARY KEY, -- VD: 'GRADE_SCALE', 'MAX_CREDITS'
    ConfigValue NVARCHAR(MAX) NOT NULL, -- Lưu chuỗi JSON cấu hình
    Description NVARCHAR(255),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

CREATE TABLE [system].[AuditLogs] (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Timestamp DATETIME DEFAULT GETDATE(),
    UserId VARCHAR(20) REFERENCES [auth].[Users](UserId),
    Action NVARCHAR(50) NOT NULL, -- VD: UPDATE_GRADE, ENROLL_STUDENT
    TableName NVARCHAR(50),
    OldValues NVARCHAR(MAX), -- Chuỗi JSON
    NewValues NVARCHAR(MAX)  -- Chuỗi JSON
);

-- ==========================================
-- PHÂN HỆ ACADEMIC (academic) - NGHIỆP VỤ LÕI
-- ==========================================
CREATE TABLE [academic].[Subjects] (
    SubjectId VARCHAR(20) PRIMARY KEY,
    SubjectName NVARCHAR(150) NOT NULL,
    Credits INT NOT NULL CHECK (Credits > 0)
);

-- Bảng lưu Điều kiện tiên quyết (Recursive Logic)
CREATE TABLE [academic].[Prerequisites] (
    SubjectId VARCHAR(20) REFERENCES [academic].[Subjects](SubjectId),
    PrerequisiteSubjectId VARCHAR(20) REFERENCES [academic].[Subjects](SubjectId),
    PRIMARY KEY (SubjectId, PrerequisiteSubjectId)
);

CREATE TABLE [academic].[Classes] (
    ClassId VARCHAR(20) PRIMARY KEY, -- Auto-ID: 26BOIT01
    SubjectId VARCHAR(20) REFERENCES [academic].[Subjects](SubjectId),
    LecturerId VARCHAR(20) REFERENCES [auth].[Users](UserId),
    Semester VARCHAR(20) NOT NULL,
    Year INT NOT NULL,
    MaxStudents INT DEFAULT 40,
    IsGradebookLocked BIT DEFAULT 0 -- Giáo vụ khóa bảng điểm
);

CREATE TABLE [academic].[Enrollments] (
    StudentId VARCHAR(20) REFERENCES [auth].[Users](UserId),
    ClassId VARCHAR(20) REFERENCES [academic].[Classes](ClassId),
    EnrollmentDate DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (StudentId, ClassId)
);

CREATE TABLE [academic].[Grades] (
    StudentId VARCHAR(20) REFERENCES [auth].[Users](UserId),
    ClassId VARCHAR(20) REFERENCES [academic].[Classes](ClassId),
    ProcessGrade FLOAT CHECK (ProcessGrade >= 0 AND ProcessGrade <= 10),
    ExamGrade FLOAT CHECK (ExamGrade >= 0 AND ExamGrade <= 10),
    -- FinalGrade và GPA sẽ không lưu cứng ở đây mà tính Real-time dựa trên system.DynamicConfigs
    PRIMARY KEY (StudentId, ClassId)
);
GO