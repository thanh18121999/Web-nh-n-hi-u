using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProjectBE.Models;
using MediatR;
using Project.UseCases.Staffs;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ProjectBE.Controllers;
[Route("api/staff")]
public class StaffController : Controller
{
    private readonly ILogger<StaffController> _logger;
    private readonly IMediator _mediator;
    public StaffController(ILogger<StaffController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    [HttpPost("add")]
    [DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> AddStaff([FromBody] AddStaffCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("query")]
    [AuthorizeAttribute]
    public async Task<IActionResult> GetListStaff([FromBody] GetStaffCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("update")]
    [AuthorizeAttribute]
    [DecryptedAttribute]
    public async Task<IActionResult> UpdateStaff([FromBody] UpdateStaffCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("login")]
    [DecryptedAttribute]
    public async Task<IActionResult> LoginStaff([FromBody] LoginStaffCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("changepassword")]
    [AuthorizeAttribute]
    [DecryptedAttribute]
    public async Task<IActionResult> ChangePasswordStaff([FromBody] ChangePasswordStaffCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
}
