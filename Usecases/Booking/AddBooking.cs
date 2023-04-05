using MediatR;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using Project.UseCases;
using ProjectBE.Models;

namespace Project.Usecases.Booking
{
    public class AddBookingRespone
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
        public dynamic? ERROR { get; set; }
    }
    public class AddBookingCommand : IRequest<AddBookingRespone>
    {
        public DateTime date { get; set; }
        public string? customPhone { get; set; }
        public string? customName { get; set; }
        public string? customEmail { get; set; }
        public int? assignExpert { get; set; }
    }

    public class AddBookingValidator : AbstractValidator<AddBookingCommand>
    {
        public AddBookingValidator()
        {
            RuleFor(x => x.date).NotNull().NotEmpty().WithMessage("DATE CANNOT BE EMPTY");
            RuleFor(x => x.customPhone).NotNull().NotEmpty().WithMessage("PHONE NUMBER CANNOT BE EMPTY");
            RuleFor(x => x.customName).NotNull().NotEmpty().WithMessage("NAME CANNOT BE EMPTY");
            RuleFor(x => x.customEmail).NotNull().NotEmpty().WithMessage("EMAIL CANNOT BE EMPTY");
        }
    }
    public class AddBookingHandler : IRequestHandler<AddBookingCommand, AddBookingRespone>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _accessor;

        public AddBookingHandler(DataContext dbContext, IMapper mapper, IHttpContextAccessor accessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _accessor = accessor;
        }
        public async Task<AddBookingRespone> Handle(AddBookingCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    GeneralRepository _generalRepo = new GeneralRepository(_dbContext);

                    Project.Models.Booking _Booking_to_add = _mapper.Map<Project.Models.Booking>(command);
                    await _dbContext.AddAsync(_Booking_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();

                    return new AddBookingRespone
                    {
                        MESSAGE = "CREATE SUCCESSFULLY",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _Booking_to_add
                    };
                    
                }
                catch
                {
                    dbContextTransaction.Rollback();
                    return new AddBookingRespone
                    {
                        MESSAGE = "CREATE FAILED",
                        STATUSCODE = HttpStatusCode.InternalServerError,
                    };
                }
            }
        }
    }
}

