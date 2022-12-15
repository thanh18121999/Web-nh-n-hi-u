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
    public class AddGroupResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public GroupDto? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddGroupCommand : IRequest<AddGroupResponse>
    {
        public string? Name {get;set;}
        public string? Description {get;set;}
        public string? Status { get; set; }
    }
    public class AddGroupValidator : AbstractValidator<AddGroupCommand>
    {
        public AddGroupValidator()
        {
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            RuleFor(x => x.Description).NotNull().NotEmpty().WithMessage("Mô tả nhóm không được trống");
            RuleFor(x => x.Status).NotNull().NotEmpty().WithMessage("Trạng thái nhóm không được trống");
        }
    }
    public class AddGroupHandler : IRequestHandler<AddGroupCommand, AddGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;

        public AddGroupHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
        }
        public async Task<AddGroupResponse> Handle(AddGroupCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Group _Group_to_add = _mapper.Map<Project.Models.Group>(command);
                    _Group_to_add.CREATEDDATE = DateTime.Now;
                    _Group_to_add.CODE = "GR_" + String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                                            String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
                    await _dbContext.AddAsync(_Group_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddGroupResponse {
                        MESSAGE = "Tạo nhóm thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<GroupDto>(_Group_to_add),
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddGroupResponse {
                        MESSAGE = "Tạo nhóm thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
