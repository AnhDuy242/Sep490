using BE.Service.ImplService;
using System.Text.Json.Serialization;

namespace BE.DTOs.DateDto
{
    public class DateTimeDto
    {
        [JsonConverter(typeof(DateOnlyJsonConverter))]
        public DateTime Date { get; set; }
    }
}
