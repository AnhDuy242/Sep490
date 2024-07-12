using BE.Models;
using BE.Service.IService;
namespace BE.Service.ImplService
{
    public class ValidateService : IValidateService
    {
        private readonly MedPalContext _context;

        public ValidateService(MedPalContext context)
        {
            _context = context;
        }

        string IValidateService.GenerateRandomPassword()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            return new string(Enumerable.Repeat(chars, 8)
                                      .Select(s => s[random.Next(s.Length)])
                                      .ToArray());
        }

        bool IValidateService.CheckPhoneNumberExist(string phoneNumber)
        {
            List<Account> accounts = _context.Accounts.ToList();
            foreach (var account in accounts)
            {
                if (account.Phone == phoneNumber)
                {
                    return false;
                }
            }
            return true;
        }
    }
}
