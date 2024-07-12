namespace BE.Service.IService
{
    public interface IValidateService
    {
         string GenerateRandomPassword();

         bool CheckPhoneNumberExist(string phoneNumber);
    }
}
