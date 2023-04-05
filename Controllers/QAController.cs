using Microsoft.AspNetCore.Mvc;
using MediatR;
using Project.Usecases.QA;
using ProjectBE.Usecases.QA;

namespace ProjectBE.Controllers;
[Route("qa")]
public class QAController: Controller
{
    private readonly ILogger<QAController> _logger;
    private readonly IMediator _mediator;
    public QAController(ILogger<QAController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }

    //Add controller route "/qa/add" method POST to insert new data by CongDanh on 4th April 2023
    [HttpPost("add")]
    //[DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> AddQA([FromBody] AddQACommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }

	//Add controller route "/qa/query" method POST to get data by CongDanh on 4th April 2023
	[HttpPost("query")]
    public async Task<IActionResult> GetListQA([FromBody] GetQACommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }

	//Add controller route "/qa/update" method POST to update data by id by CongDanh on 4th April 2023
	[HttpPost("update")]
    [AuthorizeAttribute]
    //[DecryptedAttribute]
    public async Task<IActionResult> UpdateQA([FromBody] UpdateQAStatusCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    //[HttpPost("likes")]
    //[AuthorizeAttribute]
    ////[DecryptedAttribute]
    //public async Task<IActionResult> LikesQA([FromBody] LikesQACommand command, [FromServices] IMediator mediator)
    //{
    //    var result = await mediator.Send(command);
    //    return StatusCode((int)result.STATUSCODE, result);
    //}
    //[HttpDelete("delete")]
    //[AuthorizeAttribute]
    ////[DecryptedAttribute]
    //public async Task<IActionResult> DeleteQA([FromBody] DeleteQACommand command, [FromServices] IMediator mediator)
    //{
    //    var result = await mediator.Send(command);
    //    return StatusCode((int)result.STATUSCODE, result);
    //}
}
