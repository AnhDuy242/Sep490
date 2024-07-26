using BE.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace BE.Controllers.Appointment_Management.Role_Admin
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class NotificationTimeController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IOptionsSnapshot<EmailSettings> _emailSettings;
        private readonly IWebHostEnvironment _env;

        public NotificationTimeController(IConfiguration configuration, IOptionsSnapshot<EmailSettings> emailSettings, IWebHostEnvironment env)
        {
            _configuration = configuration;
            _emailSettings = emailSettings;
            _env = env;
        }

        [HttpGet]
        public IActionResult GetNotificationTime()
        {
            var time = _configuration["NotificationTime:Time"];
            if (string.IsNullOrEmpty(time))
            {
                return NotFound();
            }
            return Ok(new { time });
        }

        [HttpPost]
        public IActionResult SetNotificationTime([FromBody] string time)
        {
            if (!TimeSpan.TryParse(time, out TimeSpan parsedTime))
            {
                return BadRequest("Invalid time format");
            }

            var configFilePath = Path.Combine(_env.ContentRootPath, "appsettings.json");
            var json = System.IO.File.ReadAllText(configFilePath);
            dynamic jsonObj = Newtonsoft.Json.JsonConvert.DeserializeObject(json);
            jsonObj["NotificationTime"]["Time"] = time;

            string output = Newtonsoft.Json.JsonConvert.SerializeObject(jsonObj, Newtonsoft.Json.Formatting.Indented);
            System.IO.File.WriteAllText(configFilePath, output);

            return Ok();
        }
    }

}
