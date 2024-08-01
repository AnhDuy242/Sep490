using AutoMapper;
using BE.DTOs.PatientDto;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]/[action]")]
[ApiController]
public class PatientProfileController : ControllerBase
{
    private readonly MedPalContext _context;
    private readonly IMapper _mapper;

    public PatientProfileController(MedPalContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    // Update patient profile
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdatePatientProfile(int id, [FromBody] UpdatePatientProfile updateDto)
    {
        // Ensure the id in the route matches the id in the DTO
        if (id != updateDto.PatientId)
        {
            return BadRequest("Không tìm thấy bệnh nhân với id này");
        }

        var patient = await _context.Patients
            .Include(p => p.PatientNavigation) // Include related entities if needed
            .FirstOrDefaultAsync(p => p.PatientId == id);

        if (patient == null)
        {
            return NotFound("Không tìm thấy bệnh nhân với id này");
        }

        // Map the DTO to the Patient model
        _mapper.Map(updateDto, patient);

        // Update account details
        if (patient.PatientNavigation != null)
        {
            patient.PatientNavigation.Email = updateDto.Email;
            patient.PatientNavigation.Phone = updateDto.Phone;
            patient.PatientNavigation.Password = updateDto.Password;
        }

        _context.Entry(patient).State = EntityState.Modified;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!PatientExists(id))
            {
                return NotFound("Không tìm thấy bệnh nhân với id này");
            }
            else
            {
                throw;
            }
        }

        return Ok("Đã cập nhật thành công thông tin");
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPatientProfile(int id)
    {
        var patient = await _context.Patients
            .Include(p => p.PatientNavigation) // Include related Account entity
            .FirstOrDefaultAsync(p => p.PatientId == id);

        if (patient == null)
        {
            return NotFound("Patient not found");
        }

        // Map the Patient and related Account entity to the DTO
        var patientDto = new UpdatePatientProfile
        {
            PatientId = patient.PatientId,
            Name = patient.Name,
            Address = patient.Address,
            Phone = patient.PatientNavigation.Phone,
            Email = patient.PatientNavigation.Email,
            Password = patient.PatientNavigation.Password
        };

        return Ok(patientDto);
    }
    private bool PatientExists(int id)
    {
        return _context.Patients.Any(e => e.PatientId == id);
    }
}
