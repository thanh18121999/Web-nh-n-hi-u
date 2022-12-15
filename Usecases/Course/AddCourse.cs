using MediatR;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
namespace Project.UseCases.Course
{
    public class AddCourseResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CourseDto? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddCourseCommand : IRequest<AddCourseResponse>
    {
        public string? Name {get;set;}
        public string? Description {get;set;}
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Status { get; set; }
        public string? Type {get;set;}
    }
    public class AddCourseValidator : AbstractValidator<AddCourseCommand>
    {
        public AddCourseValidator()
        {
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên khóa học không được trống");
            RuleFor(x => x.Description).NotNull().NotEmpty().WithMessage("Mô tả khóa học không được trống");
            RuleFor(x => x.StartDate).NotNull().NotEmpty().WithMessage("Ngày bắt đầu không được trống");
            RuleFor(x => x.EndDate).NotNull().NotEmpty().WithMessage("Ngày kết thúc không được trống");
            RuleFor(x => x.Status).NotNull().NotEmpty().WithMessage("Trạng thái không được trống");
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại khóa học không được trống");
        }
    }
    public class AddCourseHandler : IRequestHandler<AddCourseCommand, AddCourseResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;
        public AddCourseHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
        }
        public async Task<AddCourseResponse> Handle(AddCourseCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Course _Course_to_add = _mapper.Map<Project.Models.Course>(command);
                    _Course_to_add.CREATEDDATE = DateTime.Now;
                    _Course_to_add.CREATEDUSER = _userAccessor.getID();
                    _Course_to_add.CODE = "CO_" + String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                                            String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
                    await _dbContext.AddAsync(_Course_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddCourseResponse {
                        MESSAGE = "Tạo khóa học thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<CourseDto>(_Course_to_add),
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddCourseResponse {
                        MESSAGE = "Tạo khóa học thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
