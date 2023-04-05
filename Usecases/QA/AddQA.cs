using System;
using Project.Models.Dto;
using System.Net;
using MediatR;
using FluentValidation;
using AutoMapper;
using Project.Data;
using Project.UseCases;

namespace Project.Usecases.QA
{
    //Add new QA response by CongDanh on 4th April 2023
    public class AddQAResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
        public dynamic? ERROR { get; set; }
    }

    //Add new QA command by CongDanh on 4th April 2023
    public class AddQACommand : IRequest<AddQAResponse>
    {
        public int IDQUESTIONUSER { get; set; }
        public int IDANSWERUSER { get; set; }
        public string? QUESTION { get; set; }
        public string? ANSWER { get; set; }
        public int? ASSIGNEXPERT { get; set; }
        public int? NEEDEXPERT { get; set; }
        
    }

    //Add new QA validator by CongDanh on 4th April 2023
    public class AddQAValidator : AbstractValidator<AddQACommand>
    {
        public AddQAValidator()
        {
            RuleFor(x => x.QUESTION).NotNull().NotEmpty().WithMessage("QUESTION MUST NOT BE BLANK");
            //RuleFor(x => x.IDQUESTIONUSER).NotNull().NotEmpty().WithMessage("ID QUESTION USER MUST NOT BE BLANK");
            //RuleFor(x => x.IDANSWERUSER).NotNull().NotEmpty().WithMessage("ID ANSWER USER MUST NOT BE BLANK");
            //RuleFor(x => x.ANSWER).NotNull().NotEmpty().WithMessage("ANSWER MUST NOT BE BLANK");
        }
    }

    public class AddQAHandler : IRequestHandler<AddQACommand, AddQAResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _accessor;

        public AddQAHandler(DataContext dbContext, IMapper mapper, IHttpContextAccessor accessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _accessor = accessor;
        }


        public async Task<AddQAResponse> Handle(AddQACommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    GeneralRepository _generalRepo = new GeneralRepository(_dbContext);

                    Project.Models.QA _QA_to_add = _mapper.Map<Project.Models.QA>(command);
                    _QA_to_add.STATUS = 0;
                    await _dbContext.AddAsync(command, cancellationToken);
                    await _dbContext.SaveChangesAsync();
                    dbContextTransaction.Commit();
                    return new AddQAResponse
                    {
                        MESSAGE = "ADD SUCCESSFULLY",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _QA_to_add
                    };
                }
                catch
                {
                    dbContextTransaction.Rollback();
                    return new AddQAResponse
                    {
                        MESSAGE = "ADD FAILED",
                        STATUSCODE = HttpStatusCode.OK,
                    };
                }
            }
        }
    }
}

