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
    }
    public class AddStaffCommand : IRequest<AddStaffResponse>
    {
        public string? Name {get;set;}
        public int Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Tittle {get;set;}
        public DateTime StartWorkDate {get;set;}
        public int Level {get;set;}
        public string? Password {get;set;}
    }
    public class AddStaffValidator : AbstractValidator<AddStaffCommand>
    {
        public AddStaffValidator()
        {
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");

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
                    Project.Models.Staff _Staff_to_add = _mapper.Map<Project.Models.Staff>(command);
                    //_Staff_to_add.CREATEDDATE = DateTime.Now;
                    _Staff_to_add.PasswordHash = command.Password + "12345" ;//_StaffRepo.HashPassword(command.Password);
                    _Staff_to_add.STATUS = "active";
                    _Staff_to_add.CODE = "KH_" + String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                                            String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
                    await _dbContext.AddAsync(_Staff_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddStaffResponse {
                        MESSAGE = "Tạo khách hàng thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<StaffDto>(_Staff_to_add)
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddStaffResponse {
                        MESSAGE = "Tạo khách hàng thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
