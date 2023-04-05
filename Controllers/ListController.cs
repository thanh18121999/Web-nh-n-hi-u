using Microsoft.AspNetCore.Mvc;
using MediatR;
using Project.UseCases.ListPosition;
using Project.UseCases.ListTitle;
using Project.UseCases.ListDepartment;

namespace ProjectBE.Controllers;
[Route("list")]
public class ListController : Controller
{
    private readonly ILogger<ListController> _logger;
    private readonly IMediator _mediator;
    public ListController(ILogger<ListController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    [HttpPost("position")]
    //[DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> GetListPosition([FromBody] GetListPositionCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("title")]
    //[DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> GetListTitle([FromBody] GetListTitleCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("department")]
    //[DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> GetListDepartment([FromBody] GetListDepartmentCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
}
