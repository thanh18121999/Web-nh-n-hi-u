namespace Project.UseCases.Customers
{
    public interface ICustomerRepository
    {
        public string HashPassword(string Password);
        public bool ComparePassword(string Password, string pwHashed);
    }
}