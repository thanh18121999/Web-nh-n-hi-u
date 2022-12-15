using AutoMapper;
using System;
using Project.UseCases.Customers;
using Project.Models.Dto;
namespace Project.Models
{
    // ----- CUSTOMER ----
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
    // ----- COURSE ----
    public class CourseMappingProfile : Profile
    {
        public CourseMappingProfile()
        {
            CreateMap<Course, CourseDto>();
        }
    }
   
}