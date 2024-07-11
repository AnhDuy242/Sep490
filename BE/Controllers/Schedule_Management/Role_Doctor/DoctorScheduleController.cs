using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Schedule_Management.Role_Doctor
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DoctorScheduleController : ControllerBase
    {
        [HttpGet]
        public async Task<IActionResult> GetAllSchedulesByDoctorId([FromQuery] int? doctorId = null)
        {return BadRequest(); }
        }
}
