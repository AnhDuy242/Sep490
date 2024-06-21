using BE.Service;
using Twilio.Clients;
using Twilio;
using Microsoft.Extensions.Options;
using BE.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Thêm dịch vụ vào container
builder.Services.AddControllers();
// Thêm Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký DbContext
builder.Services.AddDbContext<Alo2Context>(options =>
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

// Cấu hình AutoMapper
builder.Services.AddAutoMapper(typeof(Program));

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

var app = builder.Build();

// Cấu hình middleware của ứng dụng
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Áp dụng chính sách CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
