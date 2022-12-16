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
    public class LoginCustomerResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CustomerLoginDto? RESPONSES {get;set;} 
    }
    public class LoginCustomerCommand : IRequest<LoginCustomerResponse>
    {
        public string? Username {get;set;}
        public string? Password {get;set;}
    }
    public class LoginCustomerValidator : AbstractValidator<LoginCustomerCommand>
    {
        public LoginCustomerValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class LoginCustomerHandler : IRequestHandler<LoginCustomerCommand, LoginCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly ITokenRepository _tokenRepo;

        public LoginCustomerHandler(DataContext dbContext,IMapper mapper, ITokenRepository tokenRepo)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _tokenRepo = tokenRepo;
        }
        public async Task<LoginCustomerResponse> Handle(LoginCustomerCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    CustomerRepository _customerRepo = new CustomerRepository(_dbContext);
                    Project.Models.Customer? _customer_loging = await _dbContext.Customers.FirstOrDefaultAsync(x => x.USERNAME == command.Username, cancellationToken);
                    if (_customer_loging == null)
                    {
                        return new LoginCustomerResponse {
                            MESSAGE = "Thông tin username không đúng!",
                            STATUSCODE = HttpStatusCode.OK,
                        };
                    }
                    else if (! _customerRepo.ComparePassword(command.Password, _customer_loging.PASSWORDHASH, _customer_loging.PASSWORDSALT))
                    {
                        return new LoginCustomerResponse {
                            MESSAGE = "Password không đúng!",
                            STATUSCODE = HttpStatusCode.OK,
                        };
                    }
                    CustomerLoginDto _customer_login_dto = _mapper.Map<CustomerLoginDto>(_customer_loging);
                    var user_claims = new Claim[] {};
                    user_claims = new[] {
                        new Claim("ID", _customer_login_dto.ID.ToString()),
                        new Claim("Username", _customer_login_dto.USERNAME),
                        new Claim("Name", _customer_login_dto.NAME),
                        new Claim("Code", _customer_login_dto.CODE)

                    };
                    _customer_login_dto.TOKEN = _tokenRepo.BuildToken(user_claims);
                    return new LoginCustomerResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _customer_login_dto
                    };
                }
                catch {
                    return new LoginCustomerResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
