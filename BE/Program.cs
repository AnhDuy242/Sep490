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
//using BE.Hub;
using BE;
using Hangfire;
using System.Configuration;

var builder = WebApplication.CreateBuilder(args);


// Add services to the container.

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.Preserve;
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
// Thêm dịch vụ vào container
builder.Services.AddControllers();

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

builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddSingleton<CloudinaryService>();
builder.Services.AddMemoryCache();

//Validate Service Configure
builder.Services.AddTransient<IValidateService, ValidateService>();
builder.Services.AddTransient<IDoctorService, DoctorService>();
//mail
builder.Services.Configure<EmailSettings>(builder.Configuration.GetSection("EmailSettings"));
builder.Services.AddTransient<IEmailService, EmailService>();
//builder.Services.AddTransient<IAccountService, AccountService>();
builder.Services.AddScoped<IValidateService, ValidateService>();

//remider
builder.Services.AddTransient<ReminderService>();

builder.Services.AddHangfire(config => config.UseSqlServerStorage(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddHangfireServer();
//auto mapper
builder.Services.AddAutoMapper(typeof(Program));
//otp service
builder.Services.AddSingleton<OtpService>();


builder.Services.AddDbContext<MedPalContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<AuthService>(); // Change to Scoped
builder.Services.AddScoped<IValidateService, ValidateService>();

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

builder.Services.AddSignalR();

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
builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("Cloudinary"));
builder.Services.AddSingleton<CloudinaryService>();
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
builder.Services.AddControllers();

app.MapControllers();
//app.MapHub<ChatHub>("/chatHub");
app.UseHangfireDashboard();
app.UseHangfireServer();

// Configure Hangfire job
using (var scope = app.Services.CreateScope())
{
    var reminderService = scope.ServiceProvider.GetRequiredService<ReminderService>();
    var recurringJobManager = scope.ServiceProvider.GetRequiredService<IRecurringJobManager>();

    var notificationTime = reminderService.GetNotificationTime();
    if (notificationTime.HasValue)
    {
        var cronExpression = $"{notificationTime.Value.Minutes} {notificationTime.Value.Hours} * * *";
        recurringJobManager.AddOrUpdate("send-reminders", () => reminderService.CheckAppointmentsAsync(), cronExpression);
    }
}

app.Run();
