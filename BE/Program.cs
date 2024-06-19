using BE.Service;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Đăng ký EmailService với các thông tin cấu hình SMTP
builder.Services.AddSingleton(new SendEmail(
    builder.Configuration["Email:SmtpServer"],
    int.Parse(builder.Configuration["Email:SmtpPort"]),
    builder.Configuration["Email:SmtpUser"],
    builder.Configuration["Email:SmtpPass"]
));
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
