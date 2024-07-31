using BE.DTOs.ArticleManagerDto;

namespace BE.DTOs.BlogDto
{
    public class BlogDto
    {
        public int BlogId { get; set; }
        public string Content { get; set; } = null!;
        public string Title { get; set; } = null!;
        public int DocId { get; set; }
        public DateTime Date { get; set; }
        public string? Thumbnail { get; set; }
        public int AId { get; set; }

        public ArticleManagerDTO ArticleManager { get; set; } = null!;
    }
    public class EditBlogDto
    {
        public int BlogId { get; set; }
        public string Content { get; set; } = null!;
        public string Title { get; set; } = null!;
        public DateTime Date { get; set; }
        public string? Thumbnail { get; set; }
    
     
    }
}
