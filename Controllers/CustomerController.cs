using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using ProjectBE.Models;
using MediatR;
using Project.UseCases.Customers;
using System.Text;
using Microsoft.AspNetCore.Authorization;

namespace ProjectBE.Controllers;
[Route("api/customer")]
public class CustomerController : Controller
{
    private readonly ILogger<CustomerController> _logger;
    private readonly IMediator _mediator;
    public CustomerController(ILogger<CustomerController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    [HttpPost("add")]
    [AuthorizeAttribute]
    [DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    public async Task<IActionResult> AddCustomer([FromBody] AddCustomerCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("query")]
    public async Task<IActionResult> GetListCustomer([FromBody] GetCustomerCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("update")]
    [AuthorizeAttribute]
    public async Task<IActionResult> UpdateCustomer([FromBody] UpdateCustomerCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("login")]
    [DecryptedAttribute]
    public async Task<IActionResult> LoginCustomer([FromBody] LoginCustomerCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
}
