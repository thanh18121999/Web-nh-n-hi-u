using MediatR;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
namespace Project.UseCases.JoinGroups
{
    public class AddJoinGroupResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CourseDto? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddJoinGroupCommand : IRequest<AddJoinGroupResponse>
    {
        public int IDGroup {get;set;}
        public IEnumerable<int> IDStaffs {get;set;} = Enumerable.Empty<int>();
    }
    public class AddJoinGroupValidator : AbstractValidator<AddJoinGroupCommand>
    {
        public AddJoinGroupValidator()
        {
            RuleFor(x => x.IDGroup).NotNull().NotEmpty().WithMessage("ID nhóm không được trống");
            RuleFor(x => x.IDStaffs).NotNull().NotEmpty().WithMessage("Danh sách nhân viên không được trống");
        }
    }
    public class AddJoinGroupHandler : IRequestHandler<AddJoinGroupCommand, AddJoinGroupResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;
        public AddJoinGroupHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
        }
        public async Task<AddJoinGroupResponse> Handle(AddJoinGroupCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    foreach( int IDStaff in command.IDStaffs)
                    {
                        Project.Models.JoinGroup _JoinGroup_to_add = new Project.Models.JoinGroup();
                        _JoinGroup_to_add.IDGROUP = command.IDGroup;
                        _JoinGroup_to_add.IDMEMBER = IDStaff;
                        _dbContext.Add(_JoinGroup_to_add);
                    }
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddJoinGroupResponse {
                        MESSAGE = "Thêm member thành công!",
                        STATUSCODE = HttpStatusCode.OK
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddJoinGroupResponse {
                        MESSAGE = "Thêm member thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
