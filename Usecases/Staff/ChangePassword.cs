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
    public class ChangePasswordStaffResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public string? RESPONSES {get;set;} 
    }
    public class ChangePasswordStaffCommand : IRequest<ChangePasswordStaffResponse>
    {
        public string? Username {get;set;}
        public string? OldPassword {get;set;}
        public string? NewPassword {get;set;}
    }
    public class ChangePasswordStaffValidator : AbstractValidator<ChangePasswordStaffCommand>
    {
        public ChangePasswordStaffValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.OldPassword).NotNull().NotEmpty().WithMessage("Password cũ không được trống");
            RuleFor(x => x.NewPassword).NotNull().NotEmpty().WithMessage("Password mới không được trống");
        }
    }
    public class ChangePasswordStaffHandler : IRequestHandler<ChangePasswordStaffCommand, ChangePasswordStaffResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly ITokenRepository _tokenRepo;

        public ChangePasswordStaffHandler(DataContext dbContext,IMapper mapper, ITokenRepository tokenRepo)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _tokenRepo = tokenRepo;
        }
        public async Task<ChangePasswordStaffResponse> Handle(ChangePasswordStaffCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
            
                try {
                    GeneralRepository _StaffRepo = new GeneralRepository(_dbContext);
                    Project.Models.Staff? _Staff_ChangePasswordg = await _dbContext.Staffs.FirstOrDefaultAsync(x => x.USERNAME == command.Username, cancellationToken);
                    if (_Staff_ChangePasswordg == null)
                    {
                        return new ChangePasswordStaffResponse {
                            MESSAGE = "Thông tin username không đúng!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                        };
                    }
                    bool Compare_password =  _StaffRepo.ComparePassword(command.OldPassword, _Staff_ChangePasswordg.PASSWORDHASH, _Staff_ChangePasswordg.PASSWORDSALT);
                    if (!Compare_password)
                    {
                        return new ChangePasswordStaffResponse {
                            MESSAGE = "Password cũ không đúng!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                        };
                    }
                    else {
                        _Staff_ChangePasswordg.PASSWORDHASH = _StaffRepo.HashPassword(command.NewPassword, out var salt);
                        _Staff_ChangePasswordg.PASSWORDSALT = Convert.ToHexString(salt);
                        _dbContext.Staffs.Update(_Staff_ChangePasswordg);
                        dbContextTransaction.Commit();
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        return new ChangePasswordStaffResponse {
                            MESSAGE = "Đổi mật khẩu thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = "Thành công"
                        };
                    }
                }
                catch {
                    return new ChangePasswordStaffResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
            
        }
    }
}
