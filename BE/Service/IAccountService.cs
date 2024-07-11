namespace BE.Service
{
    public interface IAccountService
    {
        public Boolean CheckEmailExist(string email);
        public Boolean CheckPhoneExist(string phone);
    }
}