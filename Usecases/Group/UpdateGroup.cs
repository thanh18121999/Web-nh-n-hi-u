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
    public class UpdateGroupResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public GroupDto? RESPONSES {get;set;} 
    }
    public class UpdateGroupCommand : IRequest<UpdateGroupResponse>
    {
        public int? ID {get;set;}
        public string? Name {get;set;}
        public string? Description {get;set;}
        public string? Status { get; set; }
    }
    public class UpdateGroupValidator : AbstractValidator<UpdateGroupCommand>
    {
        public UpdateGroupValidator()
        {
            RuleFor(x => x.ID).NotNull().NotEmpty().WithMessage("ID không được trống");
        }
    }
    public class UpdateGroupHandler : IRequestHandler<UpdateGroupCommand, UpdateGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UpdateGroupHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<UpdateGroupResponse> Handle(UpdateGroupCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Group? _Group_to_update = await _dbContext.Groups.FirstOrDefaultAsync(x => x.ID == command.ID, cancellationToken);
                    if (_Group_to_update != null)
                   { 
                        _mapper.Map<UpdateGroupCommand,Project.Models.Group>(command, _Group_to_update);
                        _dbContext.Groups.Update(_Group_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        dbContextTransaction.Commit();
                        return new UpdateGroupResponse {
                            MESSAGE = "Cập nhật thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _mapper.Map<GroupDto>(_Group_to_update)
                        };
                    }
                    else {
                         return new UpdateGroupResponse {
                            MESSAGE = "Cập nhật thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest
                        };
                    }
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateGroupResponse {
                        MESSAGE = "Cập nhật thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
