using BE.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

namespace BE.Controllers.User_And_Access_Management.Role_Receptionist
{
    [Route("api/[controller]")]
    [ApiController]
    public class OCR_API : ControllerBase
    {
        [HttpPost("extract-text")]
        public IActionResult ExtractText(IFormFile file)
        {
            if (file == null || file.Length == 0)
                return BadRequest("No file uploaded");

            try
            {
                using (var stream = file.OpenReadStream())
                {
                    var bitmap = new Bitmap(stream);

                    // Extract text using OCRHelper
                    var text = OCRHelper.GetFilterNumber(bitmap, 2, 190, 1);
                    OCRResult result = new OCRResult();
                    result = OCRHelper.ExtractInformation(text);
                    OCRResult rs = OCRHelper.ParseOCRText(text);
                    OCRResult rs2 = OCRHelper.ExtractInformation2(text);
                    return Ok(rs2);
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Error = ex.Message });
            }
        }
    }
}

