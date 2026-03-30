using Microsoft.EntityFrameworkCore;
using SmartUni.API.Core.Entities;

namespace SmartUni.API.Infrastructure.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // --- AUTH ---
        public DbSet<User> Users { get; set; }
        public DbSet<Role> Roles { get; set; }

        // --- SYSTEM ---
        public DbSet<DynamicConfig> DynamicConfigs { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        // --- ACADEMIC ---
        public DbSet<Major> Majors { get; set; }
        public DbSet<Invoice> Invoices { get; set; }
        public DbSet<AttendanceRecord> AttendanceRecords { get; set; }
        public DbSet<Enrollment> Enrollments { get; set; }
        public DbSet<CourseMaterial> CourseMaterials { get; set; }
        public DbSet<Subject> Subjects { get; set; }
        public DbSet<Prerequisite> Prerequisites { get; set; }
        public DbSet<Class> Classes { get; set; }
        public DbSet<Curriculum> Curriculums { get; set; }

        public DbSet<ClassSchedule> ClassSchedules { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Prerequisite>()
                .HasKey(p => new { p.SubjectId, p.PrerequisiteSubjectId });

            modelBuilder.Entity<Enrollment>()
                .HasKey(e => new { e.StudentId, e.ClassId });

            modelBuilder.Entity<Curriculum>()
                .HasKey(c => new { c.MajorId, c.SubjectId, c.Cohort });

            modelBuilder.Entity<Subject>()
                .HasQueryFilter(s => s.IsActive);
        }
    }
}