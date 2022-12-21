using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProjectBE.Models;
using MediatR;
using Project.UseCases.Courses;
using Project.UseCases.CourseDocuments;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.UseCases;
namespace ProjectBE.Controllers;
[Route("api/course")]
public class CourseController : Controller
{
    private readonly ILogger<CourseController> _logger;
    private readonly IMediator _mediator;
    private readonly string _documentPath = @"Document/course"; 
    private  IWebHostEnvironment _webHostEnvironment;
    private DataContext _dbContext ;

    public CourseController(ILogger<CourseController> logger,DataContext gen , IMediator mediator, IWebHostEnvironment webHostEnvironment)
    {
        _logger = logger;
        _mediator = mediator;
        _webHostEnvironment = webHostEnvironment;
        _dbContext = gen;
    }
    [HttpPost("add")]
    [AuthorizeAttribute]
    [DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    public async Task<IActionResult> AddCourse([FromBody] AddCourseCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("query")]
    public async Task<IActionResult> GetListCourse([FromBody] GetCourseCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("update")]
    [AuthorizeAttribute]
    public async Task<IActionResult> UpdateCourse([FromBody] UpdateCourseCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("upload-document")]
    public async Task<IActionResult> UploadDocument([FromBody] UploadCourseDocumentCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }

    [HttpGet("download-document/{IDCourse}/{Code}")]
    public async Task<IActionResult> DownloadDocument(int IDCourse, string Code)
    {
        Project.Models.CourseDocument? c = await _dbContext.CourseDocuments.FirstOrDefaultAsync(x => x.CODE == Code, new CancellationToken());
        if (c == null) {
            return StatusCode((int)400, new {
                STATUSCODE = 400,
                MESSAGE = "Không tìm thấy File yêu cầu"
            });
        }
        try {
            var webRootPath = _webHostEnvironment.WebRootPath;
            string filePath = Path.Combine(webRootPath, _documentPath + "/" + IDCourse.ToString() + "/"  + c.NAME);
            return PhysicalFile(filePath, c.FILETYPE, c.NAME);
        }
        catch {
            return StatusCode((int)500, new {
                STATUSCODE = 500,
                MESSAGE = "Lỗi khi tải File"
            });
        }
        
    }
}
 