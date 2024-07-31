using AutoMapper;
using BE.DTOs.BlogDto;
using BE.Models;
using BE.Service.ImplService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BE.Controllers.Blog_Management.Role_ArticleManager
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ArticleManagerBlogController : ControllerBase
    {
        private readonly MedPalContext _context;
        private readonly IMapper _mapper;
        private readonly CloudinaryService _cloudinaryService;
        public ArticleManagerBlogController(CloudinaryService cloudinaryService, MedPalContext context, IMapper mapper)

        {
            _cloudinaryService = cloudinaryService;

            _context = context;
            _mapper = mapper;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromBody] BlogDto blogDto)
        {
            Console.Write(blogDto.AId);
            if (blogDto == null)
            {
                return BadRequest("Invalid blog data");
            }

            var articleManager = await _context.ArticleManagers.FindAsync(blogDto.AId);
            if (articleManager == null)
            {
                return NotFound("ArticleManager not found");
            }

            var blog = _mapper.Map<Blog>(blogDto);
            blog.AIdNavigation = articleManager; // Gán ArticleManager cho Blog

            _context.Blogs.Add(blog);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetBlog), new { id = blog.BlogId }, blogDto);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<BlogDto>> GetBlog(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.AIdNavigation) // Bao gồm ArticleManager
                .FirstOrDefaultAsync(b => b.BlogId == id);

            if (blog == null)
            {
                return NotFound();
            }

            var blogWithArticleManagerDto = _mapper.Map<BlogDto>(blog);
            return blogWithArticleManagerDto;
        }
        [HttpGet("ByArticleManager/{aId}")]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBlogsByArticleManager(int aId)
        {
            var blogs = await _context.Blogs
                .Where(b => b.AId == aId)
                .Include(b => b.AIdNavigation) // Bao gồm ArticleManager
                .ToListAsync();

            if (blogs == null || !blogs.Any())
            {
                return NotFound("No blogs found for the specified ArticleManager.");
            }

            var blogDtos = _mapper.Map<IEnumerable<BlogDto>>(blogs);
            return Ok(blogDtos);
        }
        [HttpGet("blog/{id}")]
        public async Task<ActionResult<BlogDto>> GetBlogById(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.AIdNavigation) // Bao gồm ArticleManager
                .FirstOrDefaultAsync(b => b.BlogId == id);

            if (blog == null)
            {
                return NotFound();
            }

            var blogDto = _mapper.Map<BlogDto>(blog);
            return Ok(blogDto);
        }
        [HttpPut("blog/{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromBody] EditBlogDto blogDto)
        {
      

            // Check if blog exists
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null)
            {
                return NotFound($"Blog with ID {id} not found.");
            }

            // Map updated data to the existing blog
            _mapper.Map(blogDto, blog);
            _context.Entry(blog).State = EntityState.Modified;

            try
            {
                // Save changes to the database
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                // Handle concurrency issues
                if (!BlogExists(blogDto.BlogId))
                {
                    return NotFound($"Blog with ID {id} no longer exists.");
                }
                else
                {
              
                }
            }

            // Return no content on successful update
            return NoContent();
        }


        private bool BlogExists(int id)
        {
            return _context.Blogs.Any(e => e.BlogId == id);
        }
        [HttpGet("by-date-range")]
        public async Task<ActionResult<IEnumerable<BlogDto>>> GetBlogsByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var blogs = await _context.Blogs
                .Include(b => b.AIdNavigation) // Bao gồm ArticleManager
                .Where(b => b.Date >= startDate && b.Date <= endDate)
                .ToListAsync();

            if (blogs == null || !blogs.Any())
            {
                return NotFound();
            }

            var blogDtos = _mapper.Map<IEnumerable<BlogDto>>(blogs);
            return Ok(blogDtos);
        }
        [HttpPost("upload")]
        public async Task<IActionResult> UploadImage(IFormFile file, int blogId)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded.");
            }

            var filePath = Path.GetTempFileName();

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            var uploadResult = await _cloudinaryService.UploadImageAsync(filePath);

            if (uploadResult == null)
            {
                return StatusCode(500, "Error uploading file to Cloudinary.");
            }

            var img = new Img
            {
                ImgUrl = uploadResult.Url.ToString(),
                BlogId = blogId // Associate this image with the specified blog
            };

            _context.Imgs.Add(img);
            await _context.SaveChangesAsync();

            return Ok(new { url = uploadResult.Url.ToString() });
        }
        [HttpGet("ArticleManager/{id}")]
        public async Task<ActionResult<ArticleManager>> GetArticleManagerById(int id)
        {
            var articleManager = await _context.ArticleManagers.FindAsync(id);

            if (articleManager == null)
            {
                return NotFound();
            }

            return Ok(articleManager);
        }
    }
}
