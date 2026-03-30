using Microsoft.EntityFrameworkCore;
using SmartUni.API.Application.Services;
using SmartUni.API.Core.Interfaces;
using SmartUni.API.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ==========================================================
// 1. CẤU HÌNH DATABASE (SQL SERVER)
// ==========================================================
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// ==========================================================
// 1.5 CẤU HÌNH CORS (BẢO MẬT HƠN CHO NEXT.JS)
// ==========================================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowNextJsApp", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // Chỉ cho phép Next.js gọi API
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // BẮT BUỘC phải có dòng này để gửi Token/Cookie
    });
});

// ==========================================================
// 2. ĐĂNG KÝ DEPENDENCY INJECTION (Chuẩn SOLID - Chữ D)
// ==========================================================
// Đăng ký các Service xử lý Logic cốt lõi (Business Logic Layers)
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IStudentService, StudentService>();
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

// Đăng ký các Service hỗ trợ thuật toán (Helper/Algorithm Services)
builder.Services.AddScoped<IIdGeneratorService, IdGeneratorService>();
builder.Services.AddScoped<IPrerequisiteService, PrerequisiteService>();
builder.Services.AddScoped<IGpaCalculatorService, GpaCalculatorService>();

// ==========================================================
// 3. CẤU HÌNH AUTHENTICATION & JWT BEARER
// ==========================================================
var jwtSettings = builder.Configuration.GetSection("JwtSettings");
var secretKey = Encoding.UTF8.GetBytes(jwtSettings["Secret"]!);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(secretKey)
    };
});

// ==========================================================
// 4. CẤU HÌNH CONTROLLERS & SWAGGER (CÓ HỖ TRỢ JWT)
// ==========================================================
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "SmartUni ERP API",
        Version = "v1",
        Description = "Hệ thống quản lý đại học thông minh chuẩn SOLID"
    });

    // Thêm nút "Authorize" (ổ khóa) lên giao diện Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Nhập Token theo định dạng: Bearer {your_token}",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference { Type = ReferenceType.SecurityScheme, Id = "Bearer" }
            },
            new List<string>()
        }
    });
});

var app = builder.Build();

// ==========================================================
// 5. CẤU HÌNH HTTP REQUEST PIPELINE (MIDDLEWARES)
// ==========================================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c => {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "SmartUni API v1");
    });
}

// SỬ DỤNG CORS ĐÃ CẤU HÌNH Ở TRÊN (Phải gọi trước UseAuthentication)
app.UseCors("AllowNextJsApp");

app.UseHttpsRedirection();

// QUAN TRỌNG: Thứ tự Auth phải nằm TRƯỚC MapControllers
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();