namespace BE.DTOs.ArticleManagerDto
{
    public class ArticleManagerDTO
    {
        public int AId { get; set; }
        public string Name { get; set; } = null!;
        public string Gender { get; set; } = null!;
        public DateTime Dob { get; set; }
        public bool? IsActive { get; set; }
    }
}
