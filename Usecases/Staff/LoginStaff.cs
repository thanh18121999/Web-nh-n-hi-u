using MediatR;
using System.Security.Claims;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using Project.UseCases.Tokens;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Staffs
{
    public class LoginStaffResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public StaffLoginDto? RESPONSES {get;set;} 
    }
    public class LoginStaffCommand : IRequest<LoginStaffResponse>
    {
        public string Username {get;set;} = string.Empty;
        public string Password {get;set;} = string.Empty;
    }
    public class LoginStaffValidator : AbstractValidator<LoginStaffCommand>
    {
        public LoginStaffValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class LoginStaffHandler : IRequestHandler<LoginStaffCommand, LoginStaffResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly ITokenRepository _tokenRepo;

        public LoginStaffHandler(DataContext dbContext,IMapper mapper, ITokenRepository tokenRepo)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _tokenRepo = tokenRepo;
        }
        public async Task<LoginStaffResponse> Handle(LoginStaffCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    GeneralRepository _StaffRepo = new GeneralRepository(_dbContext);
                    Project.Models.Staff? _Staff_loging = await _dbContext.Staffs.FirstOrDefaultAsync(x => x.USERNAME == command.Username, cancellationToken);
                    if (_Staff_loging == null)
                    {
                        return new LoginStaffResponse {
                            MESSAGE = "Thông tin username không đúng!",
                            STATUSCODE = HttpStatusCode.OK,
                        };
                    }
                    else if (! _StaffRepo.ComparePassword(command.Password, _Staff_loging.PASSWORDHASH, _Staff_loging.PASSWORDSALT))
                    {
                        return new LoginStaffResponse {
                            MESSAGE = "Password không đúng!",
                            STATUSCODE = HttpStatusCode.OK,
                        };
                    }
                    StaffLoginDto _Staff_login_dto = _mapper.Map<StaffLoginDto>(_Staff_loging);
                    var user_claims = new Claim[] {};
                    user_claims = new[] {
                        new Claim("ID", _Staff_login_dto.ID.ToString()),
                        new Claim("Username", _Staff_login_dto.USERNAME),
                        new Claim("Name", _Staff_login_dto.NAME),
                        new Claim("Code", _Staff_login_dto.CODE)

                    };
                    _Staff_login_dto.TOKEN = _tokenRepo.BuildToken(user_claims);
                    return new LoginStaffResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _Staff_login_dto
                    };
                }
                catch {
                    return new LoginStaffResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
