using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.CourseFeedBacks
{
    public class AddCourseFeedBackResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public Project.Models.CourseFeedBack? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddCourseFeedBackCommand : IRequest<AddCourseFeedBackResponse>
    {
        //public int IDUser {get;set;}
        public int IDCourse {get;set;}
        public string? Feedback {get;set;}
        public int Rating {get;set;}
    }
    public class AddCourseFeedBackValidator : AbstractValidator<AddCourseFeedBackCommand>
    {
        public AddCourseFeedBackValidator()
        {
            //RuleFor(x => x.IDUser).NotNull().NotEmpty().WithMessage("ID user không được trống");
            RuleFor(x => x.IDCourse).NotNull().NotEmpty().WithMessage("ID course không được trống");
            RuleFor(x => x.Feedback).NotNull().NotEmpty().WithMessage("Feedback không được trống");
            RuleFor(x => x.Rating).NotNull().NotEmpty().WithMessage("Rating không được trống");
        }
    }
    public class AddCourseFeedBackHandler : IRequestHandler<AddCourseFeedBackCommand, AddCourseFeedBackResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;
        //private readonly CourseFeedBackRepository _CourseFeedBackRepo;

        public AddCourseFeedBackHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
           // _CourseFeedBackRepo = CourseFeedBackRepo;
        }
        public async Task<AddCourseFeedBackResponse> Handle(AddCourseFeedBackCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Course? _course_to_feedback = await _dbContext.Courses.FirstOrDefaultAsync(x => x.ID == command.IDCourse , cancellationToken);
                    if(_course_to_feedback == null)
                    {
                        return new AddCourseFeedBackResponse {
                            MESSAGE = "Tạo feedback thất bại!",
                            STATUSCODE = HttpStatusCode.InternalServerError
                        };
                    }
                    Project.Models.CourseFeedBack _CourseFeedBack_to_add = _mapper.Map<Project.Models.CourseFeedBack>(command);
                    _CourseFeedBack_to_add.IDUSER = Int32.Parse(_userAccessor.getID());
                    _CourseFeedBack_to_add.CREATEDDATE = DateTime.Now;
                    await _dbContext.AddAsync(_CourseFeedBack_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddCourseFeedBackResponse {
                        MESSAGE = "Tạo feedback thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _CourseFeedBack_to_add
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddCourseFeedBackResponse {
                        MESSAGE = "Tạo feedback thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
