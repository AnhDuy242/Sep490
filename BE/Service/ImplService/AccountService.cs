using BE.Models;
using Microsoft.EntityFrameworkCore;

namespace BE.Service.ImplService
{
    public class AccountService
    {
        private readonly MedPalContext _context;

        public AccountService( MedPalContext context)
        {
            _context = context;
        }

        public async Task<Account?> GetAccountByPhoneAsync(string phoneNumber)
        {
            return await _context.Accounts.FirstOrDefaultAsync(a => a.Phone == phoneNumber);
        }

        public async Task<bool> UpdatePasswordAsync(Account account, string newPassword)
        {
            account.Password = newPassword; // You might want to hash the password here
            _context.Accounts.Update(account);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
