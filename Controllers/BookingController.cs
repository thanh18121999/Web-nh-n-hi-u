using Microsoft.AspNetCore.Mvc;
using MediatR;
using Project.Usecases.Booking;

namespace ProjectBE.Controllers;
[Route("booking")]
public class BookingController : Controller
{
    private readonly ILogger<BookingController> _logger;
    private readonly IMediator _mediator;
    public BookingController(ILogger<BookingController> logger, IMediator mediator)
    {
        _logger = logger;
        _mediator = mediator;
    }
    [HttpPost("add")]
    //[DecryptedAttribute] // Chỉ sử dụng attribute này cho những route cần Encrypt request!!
    [AuthorizeAttribute]
    public async Task<IActionResult> AddBooking([FromBody] AddBookingCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("query")]
    public async Task<IActionResult> GetListBooking([FromBody] GetBookingCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    [HttpPost("update")]
    [AuthorizeAttribute]
    //[DecryptedAttribute]
    public async Task<IActionResult> UpdateBooking([FromBody] UpdateBookingCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
    //[HttpPost("likes")]
    //[AuthorizeAttribute]
    ////[DecryptedAttribute]
    //public async Task<IActionResult> LikesBooking([FromBody] LikesBookingCommand command, [FromServices] IMediator mediator)
    //{
    //    var result = await mediator.Send(command);
    //    return StatusCode((int)result.STATUSCODE, result);
    //}
    [HttpDelete("delete")]
    [AuthorizeAttribute]
    //[DecryptedAttribute]
    public async Task<IActionResult> DeleteBooking([FromBody] DeleteBookingCommand command, [FromServices] IMediator mediator)
    {
        var result = await mediator.Send(command);
        return StatusCode((int)result.STATUSCODE, result);
    }
}
