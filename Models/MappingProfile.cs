﻿using AutoMapper;
using Project.UseCases.Users;
using Project.UseCases.Article;
using Project.UseCases.Blog;
using Project.UseCases.Menu;
using Project.UseCases.Hastag;
using Project.UseCases.Role;
using Project.UseCases.Rule;
using Project.Models.Dto;
using Project.Usecases.Booking;
using Project.Usecases.QA;

namespace Project.Models
{
    // ----- User ----
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<User, UserDto>();
        }
    }
    public class AddUserMappingProfile : Profile
    {
        public AddUserMappingProfile()
        {
            CreateMap<AddUserCommand, User>();
            CreateMap<AddUserCommand, UserDetail>();
            CreateMap<AddUserCommand, UserList>();
        }
    }
    public class UserLoginMappingProfile : Profile
    {
        public UserLoginMappingProfile()
        {
            CreateMap<User, UserLoginDto>();
        }
    }
    public class UpdateUserMappingProfile : Profile
    {
        public UpdateUserMappingProfile()
        {
            CreateMap<UpdateUserCommand, User>()
            .ForMember(des => des.ROLE, act => { act.Condition(src => src.Role != null); act.MapFrom(src => src.Role); })
            .ForMember(des => des.AVATAR, act => { act.Condition(src => src.Avatar != null); act.MapFrom(src => src.Avatar); })
            .ForAllOtherMembers(opts => opts.Ignore());
            CreateMap<UpdateUserCommand, UserDetail>()
            .ForMember(des => des.NAME, act => { act.Condition(src => src.Name != null); act.MapFrom(src => src.Name); })
            .ForMember(des => des.EMAIL, act => { act.Condition(src => src.Email != null); act.MapFrom(src => src.Email); })
            .ForMember(des => des.PHONE, act => { act.Condition(src => src.Phone != null); act.MapFrom(src => src.Phone); })
            .ForMember(des => des.EDUCATION, act => { act.Condition(src => src.Education != null); act.MapFrom(src => src.Education); })
            .ForMember(des => des.OFFICE, act => { act.Condition(src => src.Office != null); act.MapFrom(src => src.Office); })
            .ForMember(des => des.MAJOR, act => { act.Condition(src => src.Major != null); act.MapFrom(src => src.Major); })
            .ForMember(des => des.RESEARCH, act => { act.Condition(src => src.Research != null); act.MapFrom(src => src.Research); })
            .ForMember(des => des.SUPERVISION, act => { act.Condition(src => src.Supervision != null); act.MapFrom(src => src.Supervision); })
            .ForMember(des => des.PUBLICATION, act => { act.Condition(src => src.Publication != null); act.MapFrom(src => src.Publication); })
            .ForMember(des => des.TEACHINGCOURSE, act => { act.Condition(src => src.TeachingCourse != null); act.MapFrom(src => src.TeachingCourse); })
            .ForMember(des => des.ABOUTME, act => { act.Condition(src => src.Aboutme != null); act.MapFrom(src => src.Aboutme); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }
    public class UpdateUserStatusMappingProfile : Profile
    {
        public UpdateUserStatusMappingProfile()
        {
            CreateMap<UpdateUserStatusCommand, User>();
        }
    }

    //ARTICLE
    public class ArticleMappingProfile : Profile
    {
        public ArticleMappingProfile()
        {
            CreateMap<Articles, ArticleDto>();
        }
    }
    public class AddArticleMappingProfile : Profile
    {
        public AddArticleMappingProfile()
        {
            CreateMap<AddArticleCommand, Articles>();
        }
    }
    public class UpdateArticleMappingProfile : Profile
    {
        public UpdateArticleMappingProfile()
        {
            CreateMap<UpdateArticleCommand, Articles>()
            .ForMember(des => des.AVATAR, act => { act.Condition(src => src.Avatar != null); act.MapFrom(src => src.Avatar); })
            .ForMember(des => des.TITLE, act => { act.Condition(src => src.Title != null); act.MapFrom(src => src.Title); })
            .ForMember(des => des.SUMMARY, act => { act.Condition(src => src.Summary != null); act.MapFrom(src => src.Summary); })
            .ForMember(des => des.HASTAG, act => { act.Condition(src => src.Hastag != null); act.MapFrom(src => src.Hastag); })
            .ForMember(des => des.LANGUAGE, act => { act.Condition(src => src.Language != null); act.MapFrom(src => src.Language); })
            .ForMember(des => des.ARTICLECONTENT, act => { act.Condition(src => src.Article_Content != null); act.MapFrom(src => src.Article_Content); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }

    //BLOG
    public class BlogMappingProfile : Profile
    {
        public BlogMappingProfile()
        {
            CreateMap<Blogs, BlogDto>();
        }
    }
    public class AddBlogMappingProfile : Profile
    {
        public AddBlogMappingProfile()
        {
            CreateMap<AddBlogCommand, Blogs>();
        }
    }
    public class UpdateBlogMappingProfile : Profile
    {
        public UpdateBlogMappingProfile()
        {
            CreateMap<UpdateBlogCommand, Blogs>()
            .ForMember(des => des.TITLE, act => { act.Condition(src => src.Title != null); act.MapFrom(src => src.Title); })
            .ForMember(des => des.ARTICLECONTENT, act => { act.Condition(src => src.Article_Content != null); act.MapFrom(src => src.Article_Content); })
            .ForMember(des => des.HASTAG, act => { act.Condition(src => src.Hastag != null); act.MapFrom(src => src.Hastag); })
            .ForMember(des => des.LANGUAGE, act => { act.Condition(src => src.Language != null); act.MapFrom(src => src.Language); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }

    //MENU
    public class MenuMappingProfile : Profile
    {
        public MenuMappingProfile()
        {
            CreateMap<Menu, MenuDto>();
        }
    }
    public class AddMenuMappingProfile : Profile
    {
        public AddMenuMappingProfile()
        {
            CreateMap<AddMenuCommand, Menu>();
        }
    }

    //HASTAG
    public class HastagMappingProfile : Profile
    {
        public HastagMappingProfile()
        {
            CreateMap<Hastag, HastagDto>();
        }
    }
    public class AddHastagMappingProfile : Profile
    {
        public AddHastagMappingProfile()
        {
            CreateMap<AddHastagCommand, Hastag>();
        }
    }
    public class UpdateHastagMappingProfile : Profile
    {
        public UpdateHastagMappingProfile()
        {
            CreateMap<UpdateHastagCommand, Hastag>()
            .ForMember(des => des.CODE, act => { act.Condition(src => src.Code != null); act.MapFrom(src => src.Code); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }
    //ROLE
    public class RoleMappingProfile : Profile
    {
        public RoleMappingProfile()
        {
            CreateMap<Role, RoleDto>();
        }
    }
    public class AddRoleMappingProfile : Profile
    {
        public AddRoleMappingProfile()
        {
            CreateMap<AddRoleCommand, Role>();
        }
    }
    public class UpdateRoleMappingProfile : Profile
    {
        public UpdateRoleMappingProfile()
        {
            CreateMap<UpdateRoleCommand, Role>()
            .ForMember(des => des.CODE, act => { act.Condition(src => src.Code != null); act.MapFrom(src => src.Code); })
            .ForMember(des => des.DESCRIPTION, act => { act.Condition(src => src.Rule_List != null); act.MapFrom(src => src.Rule_List); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }
    //RULE
    public class RuleMappingProfile : Profile
    {
        public RuleMappingProfile()
        {
            CreateMap<Rule, RuleDto>();
        }
    }
    public class AddRuleMappingProfile : Profile
    {
        public AddRuleMappingProfile()
        {
            CreateMap<AddRuleCommand, Rule>();
        }
    }
    public class UpdateRuleMappingProfile : Profile
    {
        public UpdateRuleMappingProfile()
        {
            CreateMap<UpdateRuleCommand, Rule>()
            .ForMember(des => des.CODE, act => { act.Condition(src => src.Code != null); act.MapFrom(src => src.Code); })
            .ForMember(des => des.DESCRIPTION, act => { act.Condition(src => src.Description != null); act.MapFrom(src => src.Description); })
            .ForAllOtherMembers(opts => opts.Ignore());
        }
    }


    // Add 'add booking mapping profile' by CongDanh on 4th April 2023
    public class AddBookingMappingProfile : Profile
    {
        public AddBookingMappingProfile()
        {
            CreateMap<AddBookingCommand, Booking>();
        }
    }

	// Add 'update booking mapping profile' by CongDanh on 4th April 2023
	public class UpdateBookingMappingProfile : Profile
    {
        public UpdateBookingMappingProfile()
        {
            CreateMap<UpdateBookingCommand, Booking>();
        }
    }

	// Add 'add QA mapping profile' by CongDanh on 4th April 2023
	public class AddQAMappingProfile : Profile
    {
        public AddQAMappingProfile()
        {
            CreateMap<AddQACommand, QA>();
        }
    }

	// Add 'update QA status mapping profile' by CongDanh on 4th April 2023
	public class UpdateQAStatusMappingProfile : Profile
    {
        public UpdateQAStatusMappingProfile()
        {
            CreateMap<UpdateQAStatusMappingProfile, QA>();
        }
    }
}