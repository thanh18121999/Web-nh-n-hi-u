using AutoMapper;
using System;
using Project.UseCases.Customers;
using Project.UseCases.Courses;
using Project.UseCases.Staffs;
using Project.UseCases.Groups;

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
    public class AddCourseMappingProfile : Profile
    {
        public AddCourseMappingProfile()
        {
            CreateMap<AddCourseCommand, Course>();
        }
    }

    // ----- Staff ----
    public class StaffMappingProfile : Profile
    {
        public StaffMappingProfile()
        {
            CreateMap<Staff, StaffDto>();
        }
    }
    public class AddStaffMappingProfile : Profile
    {
        public AddStaffMappingProfile()
        {
            CreateMap<AddStaffCommand,Staff>();
        }
    }

    // ----- Group ----
    public class GroupMappingProfile : Profile
    {
        public GroupMappingProfile()
        {
            CreateMap<Group, GroupDto>();
        }
    }
    public class AddGroupMappingProfile : Profile
    {
        public AddGroupMappingProfile()
        {
            CreateMap<AddGroupCommand,Group>();
        }
    }

   
}