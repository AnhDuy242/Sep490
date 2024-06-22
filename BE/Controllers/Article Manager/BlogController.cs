using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BE.Models;
using BE.Models.DTOs;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace BE.Controllers.Article_Manager
{

    [Route("api/[controller]")]
    [ApiController]
    public class BlogController : ControllerBase
    {

        private readonly Cloudinary _cloudinary;
        private readonly Alo2Context _context;
        public BlogController(Cloudinary cloudinary, Alo2Context context)
        {
            _cloudinary = cloudinary;
            _context = context;
        }
        // GET: api/<BlogController>
        [HttpGet]
        public async Task<IActionResult> GetAllBlogs()
        {
            var blogs = await _context.Blogs
                .Include(b => b.BlogInfo)
                .ToListAsync();

            return Ok(blogs);
        }



        // GET api/<BlogController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.BlogInfo)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound();
            }

            return Ok(blog);
        }


        // POST api/<BlogController>
        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromForm] BlogCreationModel model)
        {
            try
            {
                var uploadResults = new List<string>();

                // Upload images to Cloudinary
                foreach (var file in model.Files)
                {
                    if (file.Length > 0)
                    {
                        using var stream = file.OpenReadStream();
                        var uploadParams = new ImageUploadParams()
                        {
                            File = new FileDescription(file.FileName, stream),
                            PublicId = $"Home/Image/BlogImage/{file.FileName}"
                        };
                        var uploadResult = _cloudinary.Upload(uploadParams);
                        uploadResults.Add(uploadResult.SecureUrl.ToString());
                    }
                }

                // Create new Blog object
                var blog = new Blog
                {
                    Title = model.Title,
                    DoctorId = model.DoctorId,
                    Date = DateTime.Now,
                    Thumbnail = uploadResults.FirstOrDefault(), // Assign the first uploaded image as thumbnail
                    AuthorId = model.AuthorId,
                    BlogInfo = new BlogInfo
                    {
                        Content = model.Content,
                        Img1 = uploadResults.ElementAtOrDefault(0), // Assign images to Img1, Img2, ...
                        Img2 = uploadResults.ElementAtOrDefault(1),
                        Img3 = uploadResults.ElementAtOrDefault(2),
                        Img4 = uploadResults.ElementAtOrDefault(3),
                        Img5 = uploadResults.ElementAtOrDefault(4)
                    }
                };

                // Add blog to DbContext and save changes
                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Blog created successfully", blog });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.Message}");
            }
        }


        // PUT api/<BlogController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] BlogCreationModel model)
        {
            var blog = await _context.Blogs
                .Include(b => b.BlogInfo)
                .FirstOrDefaultAsync(b => b.Id == id);

            if (blog == null)
            {
                return NotFound();
            }

            var uploadResults = new List<string>();

            foreach (var file in model.Files)
            {
                if (file.Length > 0)
                {
                    using var stream = file.OpenReadStream();
                    var uploadParams = new ImageUploadParams()
                    {
                        File = new FileDescription(file.FileName, stream)
                    };
                    var uploadResult = _cloudinary.Upload(uploadParams);
                    uploadResults.Add(uploadResult.SecureUrl.ToString());
                }
            }

            blog.Title = model.Title;
            blog.DoctorId = model.DoctorId;
            blog.Thumbnail = uploadResults.FirstOrDefault();
            blog.BlogInfo.Content = model.Content;
            blog.BlogInfo.Img1 = uploadResults.ElementAtOrDefault(0);
            blog.BlogInfo.Img2 = uploadResults.ElementAtOrDefault(1);
            blog.BlogInfo.Img3 = uploadResults.ElementAtOrDefault(2);
            blog.BlogInfo.Img4 = uploadResults.ElementAtOrDefault(3);
            blog.BlogInfo.Img5 = uploadResults.ElementAtOrDefault(4);

            _context.Blogs.Update(blog);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Blog updated successfully", blog });
        }


        // DELETE api/<BlogController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null)
                {
                    return NotFound(new { message = "Blog not found" });
                }

                var blogInfo = await _context.BlogInfos.FindAsync(id);
                if (blogInfo != null)
                {
                    _context.BlogInfos.Remove(blogInfo);
                }

                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();

                await transaction.CommitAsync();
                return Ok(new { message = "Blog deleted successfully" });
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return StatusCode(500, new { message = "An error occurred while deleting the blog", error = ex.Message });
            }
        }



    }
}
