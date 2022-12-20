using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using System;
using System.IO ;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
namespace Project.UseCases.CourseDocuments
{
    public class UploadCourseDocumentResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public string? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class UploadCourseDocumentCommand : IRequest<UploadCourseDocumentResponse>
    {
        public int? IDCourse {get;set;}
        public string? Name {get;set;}
        public string? Description {get;set;}
        public string? FileType {get;set;}
        public string? Document {get;set;}

    }
    public class UploadCourseDocumentValidator : AbstractValidator<UploadCourseDocumentCommand>
    {
        public UploadCourseDocumentValidator()
        {
            RuleFor(x => x.IDCourse).NotNull().NotEmpty().WithMessage("ID khóa học không được trống");
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên tài liệu không được trống");
            RuleFor(x => x.Description).NotNull().NotEmpty().WithMessage("Mô tả tài liệu không được trống");
            RuleFor(x => x.FileType).NotNull().NotEmpty().WithMessage("Loại file không được trống");
            RuleFor(x => x.Document).NotNull().NotEmpty().WithMessage("Tài liệu không được trống");
        }
    }
    public class UploadCourseDocumentHandler : IRequestHandler<UploadCourseDocumentCommand, UploadCourseDocumentResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;
        private string _absolutePath ;
        private  IWebHostEnvironment _webHostEnvironment;
        //private readonly CourseFeedBackRepository _CourseFeedBackRepo;

        public UploadCourseDocumentHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor, IWebHostEnvironment webHostEnvironment)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
            //_absolutePath = @"Document";
            _webHostEnvironment = webHostEnvironment;

            var webRootPath = _webHostEnvironment. WebRootPath;
            _absolutePath = Path.Combine(webRootPath, @"Document");
            if (! Directory. Exists(_absolutePath))
            {
                Directory.CreateDirectory(_absolutePath);
            }
        }
        public async Task<UploadCourseDocumentResponse> Handle(UploadCourseDocumentCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Course? _course_toAddDocument = await _dbContext.Courses.FirstOrDefaultAsync(x => x.ID == command.IDCourse , cancellationToken);
                    if(_course_toAddDocument == null)
                    {
                        return new UploadCourseDocumentResponse {
                            MESSAGE = "Upload file thất bại - Không tồn tại khóa học!",
                            STATUSCODE = HttpStatusCode.InternalServerError
                        };
                    }
                    Project.Models.CourseDocument _CourseDocument_to_add = _mapper.Map<Project.Models.CourseDocument>(command);
                    _CourseDocument_to_add.CREATEDUSER = 3 ;//Int32.Parse(_userAccessor.getID());
                    _CourseDocument_to_add.CREATEDDATE = DateTime.Now;


                    string doc = command.Document;
                    string mystr = doc.Replace("base64,",string.Empty);    
                    var bytes = Convert.FromBase64String(mystr.Split(";")[1]);
                    var contents = new StreamContent(new MemoryStream(bytes));
                    var _storePath = "/" + _course_toAddDocument.ToString() + "/";
                    var groupPath = Path.Combine(_absolutePath, _storePath);
                    if (! Directory. Exists(groupPath))
                    {
                        try
                        {
                            Directory.CreateDirectory(groupPath);
                        }
                        catch
                        {
                            return new UploadCourseDocumentResponse {
                                MESSAGE = "Upload file thất bại!",
                                STATUSCODE = HttpStatusCode.InternalServerError
                            };
                        }
                    }

                    try
                    {
                        // string doc = command.Document;
                        // string mystr = fileContent.Replace("base64,",string.Empty);
                        // var filePath = Path.Combine(groupPath, command.Name);
                        // var testb = Convert.FromBase64String(command.Document);
                        //  System.IO.File.WriteAllBytes(filePath, testb);
                        

                        //fileNames. Add(filePath);
                    }
                    catch (Exception e)
                    {
                        //_logger.LogError($ @" Copy file [{fileName}] failed: {e.Message}. " );
                    }

                                    


                    await _dbContext.AddAsync(_CourseDocument_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new UploadCourseDocumentResponse {
                        MESSAGE = "Tạo feedback thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        //RESPONSES = _CourseFeedBack_to_add
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UploadCourseDocumentResponse {
                        MESSAGE = "Upload file thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
