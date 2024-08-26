using BE.Models;
using BE.Service.IService;
using Microsoft.EntityFrameworkCore;

namespace BE.Service.ImplService
{
    public class UserService : IUserService
    {
        private readonly MedPalContext _context;

        public UserService(MedPalContext context)
        {
            _context = context;
        }

        public async Task<Account?> GetUserByGoogleIdAsync(string googleId)
        {
            return null;
        }

        public async Task<Account?> GetUserByEmailAsync(string email)
        {
            return await _context.Accounts.SingleOrDefaultAsync(a => a.Email == email);
        }

        public async Task<Account> RegisterUserAsync(string email, string googleId, string name, string accessToken)
        {
            var newUser = new Account
            {
             /*   Email = email,
                GoogleId = googleId,
                GoogleAccessToken = accessToken,*/
                // Các thuộc tính khác cần thiết (ví dụ: Phone, RoleId, IsActive)
                IsActive = true, // Đặt giá trị mặc định là active
                RoleId = 3 // Hoặc đặt RoleId phù hợp
            };

            _context.Accounts.Add(newUser);
            await _context.SaveChangesAsync();
            return newUser;
        }

        public async Task UpdateLastLoginAsync(Account account)
        {
       /*     account.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();*/
        }
    }
}
