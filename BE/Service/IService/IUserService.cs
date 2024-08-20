using BE.Models;

namespace BE.Service.IService
{
    public interface IUserService
    {
        Task<Account?> GetUserByGoogleIdAsync(string googleId);
        Task<Account?> GetUserByEmailAsync(string email);
        Task<Account> RegisterUserAsync(string email, string googleId, string name, string accessToken);
        Task UpdateLastLoginAsync(Account account);
    }
}
