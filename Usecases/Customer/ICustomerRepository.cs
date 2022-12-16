namespace Project.UseCases.Customers
{
    public interface ICustomerRepository
    {
        public string HashPassword(string Password, out byte[] salt);
        public bool ComparePassword(string Password, string pwHashed, string salt);
    }
}