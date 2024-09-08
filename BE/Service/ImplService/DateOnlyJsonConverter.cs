using System.Text.Json;
using System.Text.Json.Serialization;

namespace BE.Service.ImplService
{
    public class DateOnlyJsonConverter : JsonConverter<DateTime>
    {
        private const string Format = "dd-MM-yyyy";

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            return DateTime.ParseExact(reader.GetString(), Format, null);
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(Format));
        }
    }
    public class DateTimeJsonConverter : JsonConverter<DateTime>
    {
        private readonly string[] _formats = new[]
       {
        "yyyy-MM-ddTHH:mm:ss",
        "yyyy-MM-ddTHH:mm:ss.fff",
        "yyyy-MM-ddTHH:mm",
        "yyyy-MM-dd" // Added common formats for flexibility
    };

        public override DateTime Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var dateStr = reader.GetString();
            if (dateStr != null)
            {
                foreach (var format in _formats)
                {
                    if (DateTime.TryParseExact(dateStr, format, null, System.Globalization.DateTimeStyles.None, out var date))
                    {
                        return date;
                    }
                }
            }
            throw new JsonException($"Unable to parse date: {dateStr}");
        }

        public override void Write(Utf8JsonWriter writer, DateTime value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString("yyyy-MM-ddTHH:mm:ss"));
        }
    }
}
