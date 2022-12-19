using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Courses
{
    public class GetCourseResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public IEnumerable<CourseDto>? RESPONSES {get;set;} 
    }
    public class GetCourseCommand : IRequest<GetCourseResponse>
    {
        public string? Type {get;set;}
        public IEnumerable<string> Data {get;set;} = Enumerable.Empty<string>();
    }
    public class GetCourseValidator : AbstractValidator<GetCourseCommand>
    {
        public GetCourseValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại truy vấn không được trống");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("Thông tin truy vấn không được trống");
        }
    }
    public class GetCourseHandler : IRequestHandler<GetCourseCommand, GetCourseResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetCourseHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<GetCourseResponse> Handle(GetCourseCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    IEnumerable<Project.Models.Course> list_Course_response = Enumerable.Empty<Project.Models.Course>();

                    switch (command.Type)
                    {
                        case "GET_BY_CODE":
                            list_Course_response = await _dbContext.Courses.Where(x => command.Data.Contains(x.CODE)).ToListAsync(cancellationToken);
                            break;
                        case "GET_BY_ID" :
                            list_Course_response = await _dbContext.Courses.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                            break;
                        default:
                            list_Course_response = await _dbContext.Courses.ToListAsync(cancellationToken);
                            break;
                    }
                    IEnumerable<CourseDto> _courseDto_response = _mapper.Map<IEnumerable<CourseDto>>(list_Course_response);
                    foreach (CourseDto _res in _courseDto_response)
                    {
                        IEnumerable<Project.Models.CourseFeedBack> list_feedbacks = await _dbContext.CourseFeedBacks
                                        .Where(x =>  x.IDCOURSE == _res.ID )
                                        .Join(_dbContext.Courses,
                                            feedback => feedback.IDCOURSE,
                                            Course => Course.ID,
                                            (Feedback, Course) => new { Feedbacks = Feedback, Courses = Course })
                                            .Select(FeedbackOfCourse => FeedbackOfCourse.Feedbacks).ToListAsync(cancellationToken);
                        _res.Feedbacks =  list_feedbacks;
                    }
                    return new GetCourseResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                    };
                }
                catch {
                    return new GetCourseResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
