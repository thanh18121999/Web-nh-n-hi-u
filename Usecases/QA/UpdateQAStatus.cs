using System;
using System.Net;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Project.Data;

namespace ProjectBE.Usecases.QA
{
    public class UpdateQAStatusResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
        public dynamic? ERROR { get; set; }
    }

    public class UpdateQAStatusCommand : IRequest<UpdateQAStatusResponse>
    {
        public int? ID { get; set; }
    }

    public class UpdateQAStatusValidator : AbstractValidator<UpdateQAStatusCommand>
    {
        public UpdateQAStatusValidator()
        {
            RuleFor(x => x.ID).NotEmpty().NotNull().WithMessage("ID MUST NOT BE BLANK");
        }
    }

    public class UpdateQAStatusHandler : IRequestHandler<UpdateQAStatusCommand, UpdateQAStatusResponse>
    {

        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IHttpContextAccessor _accessor;

        public UpdateQAStatusHandler(DataContext dbContext, IMapper mapper, IHttpContextAccessor accessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _accessor = accessor;
        }

        public async Task<UpdateQAStatusResponse> Handle(UpdateQAStatusCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try
                {
                    Project.Models.QA? _QA_to_update = await _dbContext.QA.FirstOrDefaultAsync(x => x.ID == command.ID, cancellationToken);
                    if(_QA_to_update != null)
                    {
                        switch (_QA_to_update.STATUS)
                        {
                            case 0:
                                _QA_to_update.STATUS = 1;
                                break;
                                
                            case 1:
                                _QA_to_update.STATUS = 0;
                                break;
                        }

                        _dbContext.QA.Update(_QA_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);

                        dbContextTransaction.Commit();
                        return new UpdateQAStatusResponse
                        {
                            MESSAGE = "UPDATE SUCCESSFULLY",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _QA_to_update
                        };
                    }
                    else
                    {
                        return new UpdateQAStatusResponse
                        {
                            MESSAGE = "UPDATE FAILED",
                            STATUSCODE = HttpStatusCode.InternalServerError,
                        };
                    }
                }
                catch
                {
                    dbContextTransaction.Rollback();
                    return new UpdateQAStatusResponse
                    {
                        MESSAGE = "UPDATE FAILED",
                        STATUSCODE = HttpStatusCode.InternalServerError,
                    };
                }
            }    
        }
    }
}

