using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Microsoft.AspNetCore.Mvc;
using Project.Models.Dto;
using System.Linq;
using System;
using System.IO ;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using System.Web;
namespace Project.UseCases.CourseDocuments
{
    public class GetCourseDocumentResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public IEnumerable<CourseDocumentDto>? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class GetCourseDocumentCommand : IRequest<GetCourseDocumentResponse>
    {
        public int? IDCourse {get;set;}
        public string? CODE {get;set;}

    }
    public class GetCourseDocumentValidator : AbstractValidator<GetCourseDocumentCommand>
    {
        public GetCourseDocumentValidator()
        {
            RuleFor(x => x.IDCourse).NotNull().NotEmpty().WithMessage("ID khóa học không được trống");
        }
    }
    public class GetCourseDocumentHandler : IRequestHandler<GetCourseDocumentCommand, GetCourseDocumentResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;

        public GetCourseDocumentHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
        }
        public async Task<GetCourseDocumentResponse> Handle(GetCourseDocumentCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    IEnumerable<Project.Models.CourseDocument> docs = await _dbContext.CourseDocuments.Where(x => x.IDCOURSE == command.IDCourse).ToListAsync(cancellationToken);
                    List<CourseDocumentDto> docs_dto = new List<CourseDocumentDto>();
                    foreach(Project.Models.CourseDocument doc in docs)
                    {
                        CourseDocumentDto doc_dto = _mapper.Map<CourseDocumentDto>(doc);
                        doc_dto.DOWNLOADLINK = "/api/course/download-document/" + doc.IDCOURSE.ToString() + "/" + doc.CODE ;
                        docs_dto.Add(doc_dto);
                    }
                    return new GetCourseDocumentResponse {
                        STATUSCODE = HttpStatusCode.OK,
                        MESSAGE = "Truy vấn thành công",
                        RESPONSES = docs_dto
                    };
                }
                catch {
                    return new GetCourseDocumentResponse {
                        STATUSCODE = HttpStatusCode.InternalServerError,
                        MESSAGE = "Truy vấn thất bại"
                    };
                }
            }
        }
    }
}