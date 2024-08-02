using AutoMapper;
using BE.DTOs.DepartmentDto;
using BE.DTOs.ServiceDto;
using BE.DTOs.ServiceDto.BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.User_And_Access_Management.Role_All
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class DepartmentController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public DepartmentController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("Details/{id}")]
        public async Task<ActionResult<DepartmentWithServicesDto>> GetDepartmentWithServices(int id)
        {
            var department = await _context.Departments
                .Include(d => d.Services)
                .FirstOrDefaultAsync(d => d.DepId == id);

            if (department == null)
            {
                return NotFound();
            }

            var departmentDto = _mapper.Map<DepartmentDTO>(department);
            var servicesDto = _mapper.Map<List<ServiceDTO>>(department.Services);

            var result = new DepartmentWithServicesDto
            {
                Department = departmentDto,
                Services = servicesDto
            };

            return Ok(result);
        }
        [HttpGet("GetServicesByDepartment/{departmentId}")]

        public async Task<List<ServiceDTO>> GetServicesAndDetailsByDepartmentIdAsync(int departmentId)
        {
            var services = await _context.Services
                .Where(s => s.DepId == departmentId && s.IsActive == true)
                .Select(s => new ServiceDTO
                {
                    ServiceId = s.ServiceId,
                    Name = s.Name,
                    Price = s.Price,
                    IsActive = s.IsActive ?? true,
                    ServiceDetails = s.ServiceDetails.Select(sd => new ServiceDetailDto
                    {
                        ServiceDetailId = sd.ServiceDetailId,
                        ServiceId = sd.ServiceId,
                        Description = sd.Description,
                        Duration = sd.Duration,
                        AdditionalInfo = sd.AdditionalInfo,
                        IsActive = sd.IsActive
                    }).ToList()
                }).ToListAsync();

            return services;
        }
        [HttpGet]
        public async Task<ActionResult<IEnumerable<DepartmentDTO>>> GetDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            var departmentDtos = _mapper.Map<List<DepartmentDTO>>(departments);
            return Ok(departmentDtos);
        }
    }
}
