using BE.Models;

namespace BE.Service.IService
{
    public class AccountService : IAccountService
    {
        private readonly Alo2Context _alo2Context;

        public AccountService(Alo2Context alo2Context)
        {
            _alo2Context = alo2Context;
        }
        public bool CheckEmailExist(string email)
        {
            var accounts = _alo2Context.Accounts.ToList();
            return accounts.Any(account => account.Email?.Equals(email, StringComparison.OrdinalIgnoreCase) == true);
        }

        public bool CheckPhoneExist(string phone)
        {
            var accounts = _alo2Context.Accounts.ToList();
            return accounts.Any(account => account.Phone.Equals(phone));

        }
    }
}
