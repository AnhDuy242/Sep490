using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Blog_Management.Role_Patient
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PatientBlogController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public PatientBlogController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }


    }
}
