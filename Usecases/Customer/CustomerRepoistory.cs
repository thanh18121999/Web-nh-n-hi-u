using System.ComponentModel.DataAnnotations;
using Project.Data;
namespace Project.UseCases.Customers
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly DataContext _dbContext;
        public CustomerRepository(DataContext dbContext)
        {
            _dbContext = dbContext;
        }
        public string HashPassword(string Password)
        {
            return Password + "1234";
        }
        public bool ComparePassword(string Password, string pwHashed)
        {
            return HashPassword(Password) == pwHashed;
        }

        
    }
}