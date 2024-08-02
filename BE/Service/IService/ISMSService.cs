namespace BE.Service
{
    public interface ISMSService
    {
        Task SendSmsAsync(string phoneNumber, string message);
        string ConvertPhoneNumberToInternationalFormat(string phoneNumber);
    }
}

