using System;
using System.Net;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Project.Data;

namespace Project.Usecases.Booking
{
    public class UpdateBookingResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
        public dynamic? ERROR { get; set; }
    }

    public class UpdateBookingCommand : IRequest<UpdateBookingResponse>
    {
        public int? ID { get; set; }
        public DateTime date { get; set; }
        public string? customPhone { get; set; }
        public string? customName { get; set; }
        public string? customEmail { get; set; }
        public string? assignExpert { get; set; }
        public int idUserUpdate { get; set; }
    }

    public class UpdateBookingValidator : AbstractValidator<UpdateBookingCommand>
    {
        public UpdateBookingValidator()
        {
            RuleFor(x => x.ID).NotNull().NotEmpty().WithMessage("ID MUST NOT BE BLANK");
            //RuleFor(x => x.date).NotNull().NotEmpty().WithMessage("DATE MUST NOT BE BLANK");
            //RuleFor(x => x.customPhone).NotNull().NotEmpty().WithMessage("PHONE NUMBER MUST NOT BE BLANK");
            //RuleFor(x => x.customName).NotNull().NotEmpty().WithMessage("NAME MUST NOT BE BLANK");
            //RuleFor(x => x.customEmail).NotNull().NotEmpty().WithMessage("EMAIL MUST NOT BE BLANK");
            //RuleFor(x => x.idUserUpdate).NotNull().NotEmpty().WithMessage("ID USER MUST NOT BE BLANK");
        }
    }

    public class UpdateBookingHandler : IRequestHandler<UpdateBookingCommand, UpdateBookingResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UpdateBookingHandler(DataContext dbContext, IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<UpdateBookingResponse> Handle(UpdateBookingCommand command, CancellationToken cancellationToken)
        {

            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    Project.Models.Booking? _Booking_to_update = await _dbContext.Bookings.FirstOrDefaultAsync(x => x.ID == command.ID, cancellationToken);
                    if (_Booking_to_update!=null)
                    {
                        _mapper.Map<UpdateBookingCommand, Project.Models.Booking>(command, _Booking_to_update);
                        _dbContext.Bookings.Update(_Booking_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        dbContextTransaction.Commit();
                        return new UpdateBookingResponse
                        {
                            MESSAGE = "UPDATE SUCCESSFULLY",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _Booking_to_update
                        };
                    }
                    else
                    {
                        return new UpdateBookingResponse
                        {
                            MESSAGE = "UPDATE FAILED",
                            STATUSCODE = HttpStatusCode.InternalServerError
                        };
                    }
                }
                catch
                {
                    dbContextTransaction.Rollback();
                    return new UpdateBookingResponse
                    {
                        MESSAGE = "UPDATE FAILED",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
            throw new NotImplementedException();


        }
    }
}

