using System.ComponentModel.DataAnnotations;
using Project.Data;
namespace Project.UseCases.Customers
{
    public class CustomerRepository
    {
        public CustomerRepository(DataContext _dbContext)
        {

        }
        public string HashPassword(string Password)
        {
            return Password + "1234";
        }
        
    }
}