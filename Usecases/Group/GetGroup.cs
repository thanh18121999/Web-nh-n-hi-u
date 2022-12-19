using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Groups
{
    public class GetGroupResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public IEnumerable<GroupDto>? RESPONSES {get;set;} 
    }
    public class GetGroupCommand : IRequest<GetGroupResponse>
    {
        public string? Type {get;set;}
        public IEnumerable<string> Data {get;set;} = Enumerable.Empty<string>();
    }
    public class GetGroupValidator : AbstractValidator<GetGroupCommand>
    {
        public GetGroupValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại truy vấn không được trống");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("Thông tin truy vấn không được trống");
        }
    }
    public class GetGroupHandler : IRequestHandler<GetGroupCommand, GetGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetGroupHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<GetGroupResponse> Handle(GetGroupCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    IEnumerable<Project.Models.Group> list_Group_response = Enumerable.Empty<Project.Models.Group>();

                    switch (command.Type)
                    {
                        case "GET_BY_CODE":
                            list_Group_response = await _dbContext.Groups.Where(x => command.Data.Contains(x.CODE)).ToListAsync(cancellationToken);
                            break;
                        case "GET_BY_ID" :
                            list_Group_response = await _dbContext.Groups.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                            break;
                        default:
                            list_Group_response = await _dbContext.Groups.ToListAsync(cancellationToken);
                            break;
                    }
                    IEnumerable<GroupDto> _get_groups_response =  _mapper.Map<IEnumerable<GroupDto>>(list_Group_response);
                    foreach (GroupDto _get_group_response in _get_groups_response )
                    {
                        
                        IEnumerable<Project.Models.Staff> list_staffs = await _dbContext.JoinGroups
                                            .Where(x =>  x.IDGROUP == _get_group_response.ID)
                                            .Join(_dbContext.Staffs,
                                                JoinGroup => JoinGroup.IDMEMBER,
                                                Staff => Staff.ID,
                                                (JoinGroup, Staff) => new { JoinGroups = JoinGroup, Staffs = Staff })
                                            .Select(StaffJoinGroup => StaffJoinGroup.Staffs).ToListAsync(cancellationToken);
                        _get_group_response.ListStaff =  _mapper.Map<IEnumerable<StaffDto>>(list_staffs);
                    }
                    return new GetGroupResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                    };
                }
                catch {
                    return new GetGroupResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
