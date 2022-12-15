using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProjectBE.Models;
using MediatR;
using Project.UseCases.Courses;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ProjectBE.Controllers;
[Route("api/course")]
public class CourseController : Controller
{
    private readonly ILogger<CourseController> _logger;
    private readonly IMediator _mediator;
    public CourseController(ILogger<CourseController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
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
    
}
