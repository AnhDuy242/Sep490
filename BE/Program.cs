using BE.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


using CloudinaryDotNet;
using Twilio.Clients;
using Twilio;
using Microsoft.Extensions.Options;
using BE.Models;
using Microsoft.EntityFrameworkCore;
using CloudinaryDotNet;
using BE.Service.IService;
using BE.DTOs;
using BE.Service;
using BE.Service.ImplService;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// Thêm dịch vụ vào container
builder.Services.AddControllers();
builder.Services.AddScoped<IAccountService, AccountService>();

// Thêm Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext
builder.Services.AddDbContext<MedPalContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Cấu hình Twilio
builder.Services.AddSingleton<ISMSService>(provider =>
{
    var configuration = provider.GetRequiredService<IConfiguration>();
    return new SMSService(
        configuration["Twilio:AccountSid"],
        configuration["Twilio:AuthToken"],
        configuration["Twilio:PhoneNumber"]);
});
//Validate Service Configure
builder.Services.AddTransient<IValidateService, ValidateService>();
//mail
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();
//builder.Services.AddTransient<IAccountService, AccountService>();
//auto mapper
builder.Services.AddAutoMapper(typeof(Program));
//otp service
builder.Services.AddSingleton<OtpService>();



builder.Services.AddScoped<AuthService>(); // Change to Scoped

// Cấu hình JWT
var key = Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"]);
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
        builder =>
        {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});
builder.Services.AddAuthorization();



// Cấu hình AutoMapper

// Configure Cloudinary
var cloudinaryAccount = new CloudinaryDotNet.Account(
    builder.Configuration["Cloudinary:CloudName"],
    builder.Configuration["Cloudinary:ApiKey"],
    builder.Configuration["Cloudinary:ApiSecret"]
);
var cloudinary = new Cloudinary(cloudinaryAccount);
builder.Services.AddSingleton(cloudinary);
// Cấu hình CORS cho phép tất cả mọi thứ
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policyBuilder =>
    {
        policyBuilder.AllowAnyOrigin()    // Cho phép mọi nguồn gốc
                      .AllowAnyMethod()    // Cho phép mọi phương thức HTTP
                      .AllowAnyHeader();   // Cho phép mọi loại header
    });
});
builder.Services.AddAutoMapper(typeof(Program));

var app = builder.Build();

// Cấu hình middleware của ứng dụng
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("AllowAllOrigins");

// Áp dụng chính sách CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
