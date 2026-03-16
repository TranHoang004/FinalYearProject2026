USE SmartUniversityERP;
GO

-- Thêm một môn học mồi để thỏa mãn Khóa ngoại (Foreign Key)
INSERT INTO [academic].[Subjects] (SubjectId, SubjectName, Credits)
VALUES ('S_IT', N'Môn học Đại cương IT', 3);
GO