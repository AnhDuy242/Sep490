using BE.DTOs;

namespace BE.Service.IService
{
    public class OtpService
    {
        private readonly Dictionary<string, string> _otpStore = new Dictionary<string, string>();
        private readonly IEmailService _emailService;

        public OtpService(IEmailService emailService)
        {
            _emailService = emailService;
        }

        public async Task<string> GenerateAndSendOtpAsync(string email)
        {
            var otp = GenerateOtp();
            _otpStore[email] = otp;

            var mailRequest = new Mailrequest
            {
                Email = email,
                Subject = "Your OTP Code",
                Emailbody = $"Your OTP code is {otp}"
            };

            await _emailService.SendEmailAsync(mailRequest);

            return otp;
        }

        public bool VerifyOtp(string email, string otp)
        {
            return _otpStore.TryGetValue(email, out var storedOtp) && storedOtp == otp;
        }

        private string GenerateOtp()
        {
            var random = new Random();
            return random.Next(100000, 999999).ToString();
        }
    }

}
