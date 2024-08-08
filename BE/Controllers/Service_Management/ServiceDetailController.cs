using AutoMapper;
using BE.DTOs.ServiceDto.BE.DTOs;
using BE.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Service_Management
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ServiceDetailController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;

        public ServiceDetailController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ServiceDetailDto>> GetServiceDetail(int id)
        {
            var serviceDetail = await _context.ServiceDetail
                .Include(sd => sd.Service) // Ensure Service is included
                .FirstOrDefaultAsync(sd => sd.ServiceDetailId == id);

            if (serviceDetail == null)
            {
                return NotFound();
            }

            return Ok(_mapper.Map<ServiceDetailDto>(serviceDetail));
        }
        [HttpPost]
        public async Task<ActionResult<ServiceDetailDto>> CreateServiceDetail(ServiceDetailDto serviceDetailDto)
        {
            var serviceDetail = _mapper.Map<ServiceDetail>(serviceDetailDto);

            _context.ServiceDetail.Add(serviceDetail);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetServiceDetail), new { id = serviceDetail.ServiceDetailId }, serviceDetailDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateServiceDetail(int id, ServiceDetailDto serviceDetailDto)
        {
            if (id != serviceDetailDto.ServiceDetailId)
            {
                return BadRequest();
            }

            var serviceDetail = _mapper.Map<ServiceDetail>(serviceDetailDto);

            _context.Entry(serviceDetail).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ServiceDetailExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteServiceDetail(int id)
        {
            var serviceDetail = await _context.ServiceDetail.FindAsync(id);
            if (serviceDetail == null)
            {
                return NotFound();
            }

            _context.ServiceDetail.Remove(serviceDetail);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ServiceDetailExists(int id)
        {
            return _context.ServiceDetail.Any(e => e.ServiceDetailId == id);
        }
    }
}
