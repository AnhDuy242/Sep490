using AutoMapper;
using BE.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace BE.Controllers.Blog_Management.Role_ArticleManager
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ArticleManagerBlogController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        public ArticleManagerBlogController(MedPalContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        //[HttpPost]
        //public async Task<IActionResult> CreateBlog([FromBody])
        //{
        //    Blog b = new Blog()
        //    {

        //    };
        //}
    }
}
