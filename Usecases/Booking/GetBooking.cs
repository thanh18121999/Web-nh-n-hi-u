using System;
using System.Net;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.Models.Dto;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Project.Usecases.Booking
{
    public class GetBookingResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
        public dynamic? ERROR { get; set; }
    }

    public class GetBookingCommand : IRequest<GetBookingResponse>
    {
        public string? Type { get; set; }
        public IEnumerable<string> Data { get; set; } = Enumerable.Empty<string>();
        public int? assignExpert { get; set; }
        public int NoOfResult { get; set; }
    }

    public class GetBookingValidator : AbstractValidator<GetBookingCommand>
    {
        public GetBookingValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("TYPE MUST NOT BE BLANK");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("DATA MUST NOT BE BLANK");
        }
    }

    public class GetBookingHandler : IRequestHandler<GetBookingCommand, GetBookingResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetBookingHandler(DataContext dbContext, IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<GetBookingResponse> Handle(GetBookingCommand command, CancellationToken cancellationToken)
        {
            try
            {
                IEnumerable<Project.Models.Booking> list_Booking_response = Enumerable.Empty<Project.Models.Booking>();
                switch (command.Type)
                {
                    case "GET_BY_ID":
                        list_Booking_response = await _dbContext.Bookings.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                        return new GetBookingResponse
                        {
                            MESSAGE = "GET_SUCCESSFUL",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = list_Booking_response
                        };
                        
                    case "GET_ALL":
                        list_Booking_response = await _dbContext.Bookings.ToListAsync(cancellationToken);
                        return new GetBookingResponse
                        {
                            MESSAGE = "GET_SUCCESSFUL",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = list_Booking_response
                        };
                        
                    case "GET_BY_ASSIGN_EXPERT":
                        if (command.assignExpert != null)
                        {
                            var query = from booking in _dbContext.Bookings.ToList()
                                        join expert in _dbContext.Experts.ToList()
                                        on booking.ASSIGNEDEXPERT equals expert.ID
                                        select new
                                        {
                                            booking
                                        };
                            return new GetBookingResponse
                            {
                                MESSAGE = "GET_SUCCESSFUL",
                                STATUSCODE = HttpStatusCode.OK,
                                RESPONSES = query
                            };

                        }
                        else break;
                }

                return new GetBookingResponse
                {
                    MESSAGE = "GET_FAIL",
                    STATUSCODE = HttpStatusCode.InternalServerError
                };
            }
            catch
            {
                return new GetBookingResponse
                {
                    MESSAGE = "GET_FAIL",
                    STATUSCODE = HttpStatusCode.InternalServerError
                };
            }


        }
    }
}

