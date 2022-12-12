namespace Project.UseCases.Customers
{
    public interface ICustomerRepository
    {
        
        public string HashPassword(string Password);
        
    }
}