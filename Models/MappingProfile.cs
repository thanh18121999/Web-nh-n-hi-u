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
    public class UpdateCustomerMappingProfile : Profile
    {
        public UpdateCustomerMappingProfile()
        {
            CreateMap<UpdateCustomerCommand, Customer>()
            .ForMember(des => des.NAME, act => { act.Condition(src => src.Name != null); act.MapFrom(src => src.Name); })
            .ForMember(des => des.SEX, act => { act.Condition(src => src.Sex != null); act.MapFrom(src => src.Sex); })
            .ForMember(des => des.IDENTIFY, act => { act.Condition(src => src.Identify != null); act.MapFrom(src => src.Identify); })
            .ForMember(des => des.EMAIL , act => { act.Condition(src => src.Email != null); act.MapFrom(src => src.Email); })
            .ForMember(des => des.PHONE, act => { act.Condition(src => src.Phone != null); act.MapFrom(src => src.Phone); })
            .ForMember(des => des.STATUS, act => { act.Condition(src => src.Status != null); act.MapFrom(src => src.Status); })
            .ForAllOtherMembers(opts => opts.Ignore());
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
    public class UpdateCourseMappingProfile : Profile
    {
        public UpdateCourseMappingProfile()
        {
            CreateMap<UpdateCourseCommand, Course>()
            .ForMember(des => des.NAME, act => { act.Condition(src => src.Name != null); act.MapFrom(src => src.Name); })
            .ForMember(des => des.DESCRIPTION, act => { act.Condition(src => src.Description != null); act.MapFrom(src => src.Description); })
            .ForMember(des => des.STARTDATE, act => { act.Condition(src => src.StartDate != null); act.MapFrom(src => src.StartDate); })
            .ForMember(des => des.ENDDATE , act => { act.Condition(src => src.EndDate != null); act.MapFrom(src => src.EndDate); })
            .ForMember(des => des.TYPE, act => { act.Condition(src => src.Type != null); act.MapFrom(src => src.Type); })
            .ForMember(des => des.STATUS, act => { act.Condition(src => src.Status != null); act.MapFrom(src => src.Status); })
            .ForAllOtherMembers(opts => opts.Ignore());
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
    public class StaffLoginMappingProfile : Profile
    {
        public StaffLoginMappingProfile()
        {
            CreateMap<Staff, StaffLoginDto>();
        }
    }
    public class UpdateStaffMappingProfile : Profile
    {
        public UpdateStaffMappingProfile()
        {
            CreateMap<UpdateStaffCommand, Staff>()
            .ForMember(des => des.NAME, act => { act.Condition(src => src.Name != null); act.MapFrom(src => src.Name); })
            .ForMember(des => des.SEX, act => { act.Condition(src => src.Sex != null); act.MapFrom(src => src.Sex); })
            .ForMember(des => des.IDENTIFY, act => { act.Condition(src => src.Identify != null); act.MapFrom(src => src.Identify); })
            .ForMember(des => des.EMAIL , act => { act.Condition(src => src.Email != null); act.MapFrom(src => src.Email); })
            .ForMember(des => des.PHONE, act => { act.Condition(src => src.Phone != null); act.MapFrom(src => src.Phone); })
            .ForMember(des => des.TITLE, act => { act.Condition(src => src.Tittle != null); act.MapFrom(src => src.Tittle); })
            .ForMember(des => des.STARTWORKDATE, act => { act.Condition(src => src.StartWorkDate != null); act.MapFrom(src => src.StartWorkDate); })
            .ForMember(des => des.LEVEL, act => { act.Condition(src => src.Level != null); act.MapFrom(src => src.Level); })
            .ForAllOtherMembers(opts => opts.Ignore());
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
    public class UpdateGroupMappingProfile : Profile
    {
        public UpdateGroupMappingProfile()
        {
            CreateMap<UpdateGroupCommand, Group>()
            .ForMember(des => des.NAME, act => { act.Condition(src => src.Name != null); act.MapFrom(src => src.Name); })
            .ForMember(des => des.DESCRIPTION, act => { act.Condition(src => src.Description != null); act.MapFrom(src => src.Description); })
            .ForMember(des => des.STATUS, act => { act.Condition(src => src.Status != null); act.MapFrom(src => src.Status); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }

   
}