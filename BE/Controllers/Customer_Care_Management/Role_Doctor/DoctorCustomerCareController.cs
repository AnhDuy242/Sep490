using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Customer_Care_Management.Role_Doctor
{
    [Route("api/[controller]")]
    [ApiController]
    public class DoctorCustomerCareController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public DoctorCustomerCareController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}
