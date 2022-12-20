using MediatR;
using System.Security.Claims;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using Project.UseCases.Tokens;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Customers
{
    public class ChangePasswordCustomerResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public string? RESPONSES {get;set;} 
    }
    public class ChangePasswordCustomerCommand : IRequest<ChangePasswordCustomerResponse>
    {
        public string? Username {get;set;}
        public string? OldPassword {get;set;}
        public string? NewPassword {get;set;}
    }
    public class ChangePasswordCustomerValidator : AbstractValidator<ChangePasswordCustomerCommand>
    {
        public ChangePasswordCustomerValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.OldPassword).NotNull().NotEmpty().WithMessage("Password cũ không được trống");
            RuleFor(x => x.NewPassword).NotNull().NotEmpty().WithMessage("Password mới không được trống");
        }
    }
    public class ChangePasswordCustomerHandler : IRequestHandler<ChangePasswordCustomerCommand, ChangePasswordCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly ITokenRepository _tokenRepo;

        public ChangePasswordCustomerHandler(DataContext dbContext,IMapper mapper, ITokenRepository tokenRepo)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _tokenRepo = tokenRepo;
        }
        public async Task<ChangePasswordCustomerResponse> Handle(ChangePasswordCustomerCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
            
                try {
                    CustomerRepository _customerRepo = new CustomerRepository(_dbContext);
                    Project.Models.Customer? _customer_ChangePasswordg = await _dbContext.Customers.FirstOrDefaultAsync(x => x.USERNAME == command.Username, cancellationToken);
                    if (_customer_ChangePasswordg == null)
                    {
                        return new ChangePasswordCustomerResponse {
                            MESSAGE = "Thông tin username không đúng!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                        };
                    }
                    bool Compare_password =  _customerRepo.ComparePassword(command.OldPassword, _customer_ChangePasswordg.PASSWORDHASH, _customer_ChangePasswordg.PASSWORDSALT);
                    if (!Compare_password)
                    {
                        return new ChangePasswordCustomerResponse {
                            MESSAGE = "Password cũ không đúng!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                        };
                    }
                    else {
                        _customer_ChangePasswordg.PASSWORDHASH = _customerRepo.HashPassword(command.NewPassword, out var salt);
                        _customer_ChangePasswordg.PASSWORDSALT = Convert.ToHexString(salt);
                        _dbContext.Customers.Update(_customer_ChangePasswordg);
                        dbContextTransaction.Commit();
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        return new ChangePasswordCustomerResponse {
                            MESSAGE = "Đổi mật khẩu thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = "Thành công"
                        };
                    }
                }
                catch {
                    return new ChangePasswordCustomerResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
            
        }
    }
}
