using System;
using System.Net;
using AutoMapper;
using FluentValidation;
using MediatR;
using Project.Data;

namespace Project.Usecases.Booking
{
    public class DeleteBookingResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
    }

    public class DeleteBookingCommand : IRequest<DeleteBookingResponse>
    {
        public int ID { get; set; }
    }
    public class DeleteBookingValidator : AbstractValidator<DeleteBookingCommand>
    {
        public DeleteBookingValidator()
        {
        }
    }
    public class DeleteBookingHandler : IRequestHandler<DeleteBookingCommand, DeleteBookingResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _accessor;

        public DeleteBookingHandler(DataContext dbContext, IMapper mapper, IHttpContextAccessor accessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _accessor = accessor;
        }
        public async Task<DeleteBookingResponse> Handle(DeleteBookingCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    var Booking_to_delete = _dbContext.Bookings.Where(x => x.ID == command.ID).FirstOrDefault();
                    var idbooking = _accessor.HttpContext?.Items["ID"]?.ToString();
                    var _idbooking = Int32.Parse(idbooking);
                    var booking = _dbContext.Bookings.Where(x => x.ID == _idbooking).ToList();
                    if (Booking_to_delete.ID == _idbooking)
                    {
                        _dbContext.Bookings.Remove(_dbContext.Bookings.Find(command.ID));
                        _dbContext.SaveChanges();
                        dbContextTransaction.Commit();
                        return new DeleteBookingResponse
                        {
                            MESSAGE = "DELETE SUCCESSFULLY",
                            STATUSCODE = HttpStatusCode.OK,
                        };
                    }
                    else
                    {
                        return new DeleteBookingResponse
                        {
                            MESSAGE = "DELETE FAILED",
                            STATUSCODE = HttpStatusCode.InternalServerError,
                        };
                    }

                }
                catch
                {
                    dbContextTransaction.Rollback();
                    return new DeleteBookingResponse
                    {
                        MESSAGE = "DELETE FAILED",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }

        }
    }
}
