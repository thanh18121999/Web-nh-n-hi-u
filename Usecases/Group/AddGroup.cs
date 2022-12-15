using MediatR;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
namespace Project.UseCases.Groups
{
    public class AddGroupResponse : CreateResponse<GroupDto> {}

    public class AddGroupCommand  : IRequest<AddGroupResponse>
    {
        public string? Name {get;set;}
        public string? Description {get;set;}
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Status { get; set; }
        public string? Type {get;set;}
    }
    public class AddGroupHandler  : CreateCommandHandler<Project.Models.Group,AddGroupCommand,GroupDto> 
    {
        public AddGroupHandler(DataContext context, IMapper mapper) : base(context, mapper){ }
    };


    
    
    
   
}