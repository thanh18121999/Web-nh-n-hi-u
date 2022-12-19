using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Staffs
{
    public class AddStaffResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public StaffDto? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddStaffCommand : IRequest<AddStaffResponse>
    {
        public string? Username {get;set;}
        public string? Name {get;set;}
        public int? Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Tittle {get;set;}
        public DateTime? StartWorkDate {get;set;}
        public int? Level {get;set;}
        public string? Password {get;set;}
    }
    public class AddStaffValidator : AbstractValidator<AddStaffCommand>
    {
        public AddStaffValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            RuleFor(x => x.Tittle).NotNull().NotEmpty().WithMessage("Chức danh không được trống");
            RuleFor(x => x.Level).NotNull().NotEmpty().WithMessage("Cấp độ không được trống");
            RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class AddStaffHandler : IRequestHandler<AddStaffCommand, AddStaffResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        //private readonly StaffRepository _StaffRepo;

        public AddStaffHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            //_StaffRepo = StaffRepo;
        }
        public async Task<AddStaffResponse> Handle(AddStaffCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    GeneralRepository _generalRepo = new GeneralRepository(_dbContext);
                    bool _username_checked = _dbContext.Staffs.Any(u => u.USERNAME == command.Username);
                    bool _phone_checked = _dbContext.Staffs.Any(u => u.PHONE == command.Phone);
                    bool _email_checked = _dbContext.Staffs.Any(u => u.EMAIL == command.Email);
                    bool _identify_checked = _dbContext.Staffs.Any(u => u.IDENTIFY == command.Identify);

                    List<string> _existed_prop = new List<string> { _username_checked ? "Username đã được sử dụng!" : string.Empty , 
                                                                    _phone_checked ? "SĐT đã được sử dụng!": string.Empty, 
                                                                    _email_checked ? "Email đã được sử dụng!" : string.Empty,
                                                                    _identify_checked ? "CMND đã được sử dụng!" : string.Empty
                                                                    };
                    _existed_prop.RemoveAll(s => s == string.Empty);
                    if (_existed_prop.Count() > 0)
                    {
                        return new AddStaffResponse {
                            MESSAGE = "Thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                            ERROR = _existed_prop
                        };
                    }
                    Project.Models.Staff _Staff_to_add = _mapper.Map<Project.Models.Staff>(command);
                    if (!string.IsNullOrEmpty(command.Password))
                    {
                        _Staff_to_add.PASSWORDHASH = _generalRepo.HashPassword(command.Password, out var salt);
                        _Staff_to_add.PASSWORDSALT = Convert.ToHexString(salt);
                    }
                    _Staff_to_add.STATUS = "active";
                    _Staff_to_add.CODE = "KH_" + String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                                            String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
                    await _dbContext.AddAsync(_Staff_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddStaffResponse {
                        MESSAGE = "Tạo nhân viên thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<StaffDto>(_Staff_to_add)
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddStaffResponse {
                        MESSAGE = "Tạo nhân viên thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
