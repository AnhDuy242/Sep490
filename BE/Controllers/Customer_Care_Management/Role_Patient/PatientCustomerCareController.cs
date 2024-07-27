using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Customer_Care_Management.Role_Patient
{
    [Route("api/[controller]")]
    [ApiController]
    public class PatientCustomerCareController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public PatientCustomerCareController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }
    }
}
