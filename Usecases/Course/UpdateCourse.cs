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
    public class UpdateCourseResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CourseDto? RESPONSES {get;set;} 
    }
    public class UpdateCourseCommand : IRequest<UpdateCourseResponse>
    {
        public int? ID {get;set;}
        public string? Name {get;set;}
        public string? Description {get;set;}
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public string? Status { get; set; }
        public string? Type {get;set;}

    }
    public class UpdateCourseValidator : AbstractValidator<UpdateCourseCommand>
    {
        public UpdateCourseValidator()
        {
            RuleFor(x => x.ID).NotNull().NotEmpty().WithMessage("ID không được trống");
            // RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            // RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            // RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            // RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class UpdateCourseHandler : IRequestHandler<UpdateCourseCommand, UpdateCourseResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UpdateCourseHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<UpdateCourseResponse> Handle(UpdateCourseCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {

                    Project.Models.Course? _Course_to_update = await _dbContext.Courses.FirstOrDefaultAsync(x => x.ID == command.ID, cancellationToken);
                    if(_Course_to_update != null)
                    {

                    
                        _mapper.Map<UpdateCourseCommand,Project.Models.Course>(command, _Course_to_update);
                        _dbContext.Courses.Update(_Course_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        dbContextTransaction.Commit();
                        return new UpdateCourseResponse {
                            MESSAGE = "Cập nhật khóa học thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _mapper.Map<CourseDto>(_Course_to_update)
                        };
                    }
                    else {
                        return new UpdateCourseResponse {
                            MESSAGE = "Cập nhật khóa học thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest
                        };
                    }
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateCourseResponse {
                        MESSAGE = "Cập nhật khóa học thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
