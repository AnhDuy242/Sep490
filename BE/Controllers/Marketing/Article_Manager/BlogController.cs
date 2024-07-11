using CloudinaryDotNet.Actions;
using CloudinaryDotNet;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BE.Models;
using BE.DTOs;
using BE.DTOs;

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
                .Include(b => b.Imgs)
                .ToListAsync();

            return Ok(blogs);
        }



        // GET api/<BlogController>/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlogById(int id)
        {
            var blog = await _context.Blogs
                .Include(b => b.Imgs)
                .FirstOrDefaultAsync(b => b.BlogId == id);

            if (blog == null)
            {
                return NotFound();
            }

            return Ok(blog);
        }


        // POST api/<BlogController>
        //bắt buộc phải điền tất cả các trường, ảnh đang để dạng array nên hơi daubuoi tí, theo như code thì nó sẽ lấy bức ảnh đầu tiên upload lên
        //để làm thumbnail, và lấy ảnh từ đầu đến cuối để làm content
        [HttpPost]
        public async Task<IActionResult> CreateBlog([FromForm] BlogCreationModel model)
        {
            try
            {
                var uploadResults = new List<string>();

                // Upload images to Cloudinary and collect URLs
                foreach (var file in model.Files)
                {
                    if (file.Length > 0)
                    {
                        using var stream = file.OpenReadStream();
                        var uploadParams = new ImageUploadParams()
                        {
                            /*phải cập nhật thêm, bằng cách lấy token của article_manager để đưa vào thư mục
                             ví dụ article_manager với a_id = 4 thì hãy lấy giá trị của a_id đưa vào sau tên thư mục
                            cụ thể đường dẫn có thể là $"Home/Image/BlogImage_{a_id}/{file.FileName}"
                             để tránh bị trùng lặp ảnh của article manager khác 
                             
                             */
                            File = new FileDescription(file.FileName, stream),
                            PublicId = $"Home/Image/BlogImage/{file.FileName}"
                        };
                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        uploadResults.Add(uploadResult.SecureUrl.ToString());
                    }
                }

                // Create new Blog object
                var blog = new Blog
                {
                    Title = model.Title,
                    DocId = model.DoctorId,
                    Content = model.Content,
                    Date = DateTime.Now,
                    Thumbnail = uploadResults.FirstOrDefault(), // Assign the first uploaded image as thumbnail
                    AId = model.AuthorId
                };

                // Add blog to DbContext
                await _context.Blogs.AddAsync(blog);

                // Save changes to generate BlogId
                await _context.SaveChangesAsync();

                // Add images to the blog
                foreach (var url in uploadResults)
                {
                    var img = new Img { ImgUrl = url, BlogId = blog.BlogId };
                    _context.Imgs.Add(img);
                    
                }
                // Save changes for images
                await _context.SaveChangesAsync();


                return Ok(new { message = "Blog created successfully", blog });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }





        // PUT api/<BlogController>/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBlog(int id, [FromForm] BlogCreationModel model)
        {
            try
            {
                // Lấy blog cùng với các hình ảnh hiện tại
                var blog = await _context.Blogs
                    .Include(b => b.Imgs)
                    .FirstOrDefaultAsync(b => b.BlogId == id);

                if (blog == null)
                {
                    return NotFound();
                }

                var uploadResults = new List<string>();

                // Tải lên các hình ảnh mới lên Cloudinary
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
                        var uploadResult = await _cloudinary.UploadAsync(uploadParams);
                        uploadResults.Add(uploadResult.SecureUrl.ToString());
                    }
                }

                // Cập nhật các thông tin của blog
                blog.Title = model.Title;
                blog.DocId = model.DoctorId;
                blog.Content = model.Content;
                blog.Date = DateTime.Now;
                blog.Thumbnail = uploadResults.FirstOrDefault();
                blog.AId = model.AuthorId;

                // Xóa các hình ảnh cũ
                _context.Imgs.RemoveRange(blog.Imgs);

                // Thêm các hình ảnh mới
                foreach (var url in uploadResults)
                {
                    blog.Imgs.Add(new Img { ImgUrl = url });
                }

                // Cập nhật blog trong DbContext và lưu thay đổi
                _context.Blogs.Update(blog);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Blog updated successfully", blog });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"Error: {ex.InnerException?.Message ?? ex.Message}");
            }
        }




        // DELETE api/<BlogController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBlog(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var blog = await _context.Blogs
                    .Include(b => b.Imgs)
                    .FirstOrDefaultAsync(b => b.BlogId == id);

                if (blog == null)
                {
                    return NotFound(new { message = "Blog not found" });
                }

                // Xóa các hình ảnh liên quan đến blog
                if (blog.Imgs.Any())
                {
                    _context.Imgs.RemoveRange(blog.Imgs);
                }

                // Xóa blog
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
