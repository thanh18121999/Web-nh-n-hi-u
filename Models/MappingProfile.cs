using AutoMapper;
using System;
using Project.UseCases.Customers;
using Project.Models.Dto;
namespace Project.Models
{
    public class AddCustomerMappingProfile : Profile
    {
        public AddCustomerMappingProfile()
        {
            CreateMap<AddCustomerCommand, Customer>();
        }
    }
    public class CustomerMappingProfile : Profile
    {
        public CustomerMappingProfile()
        {
            CreateMap<Customer, CustomerDto>();
        }
    }
    public class CustomerLoginMappingProfile : Profile
    {
        public CustomerLoginMappingProfile()
        {
            CreateMap<Customer, CustomerLoginDto>();
        }
    }
   
}