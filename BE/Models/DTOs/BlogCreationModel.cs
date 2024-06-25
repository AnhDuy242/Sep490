namespace BE.Models.DTOs
{
    public class BlogCreationModel
{
    public string Title { get; set; } 
    public int DoctorId { get; set; } 
    public int AuthorId { get; set; } 
    public string Content { get; set; } 
    public List<IFormFile> Files { get; set; } // Danh sách các tệp ảnh được gửi lên từ client
}

}
