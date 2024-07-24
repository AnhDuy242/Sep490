namespace BE.DTOs.BlogDto
{
    public class BlogCreate
    {
        public int BlogId { get; set; }

        public string Content { get; set; } = null!;

        public string Title { get; set; } = null!;

        public int DocId { get; set; }

        public DateTime Date { get; set; }

        public string? Thumbnail { get; set; }

        public int AId { get; set; }
    }
}
