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
    public class UpdateStaffResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public StaffDto? RESPONSES {get;set;} 
    }
    public class UpdateStaffCommand : IRequest<UpdateStaffResponse>
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
    public class UpdateStaffValidator : AbstractValidator<UpdateStaffCommand>
    {
        public UpdateStaffValidator()
        {
            // RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            // RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            // RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            // RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            // RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class UpdateStaffHandler : IRequestHandler<UpdateStaffCommand, UpdateStaffResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UpdateStaffHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<UpdateStaffResponse> Handle(UpdateStaffCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Staff _Staff_to_update = _mapper.Map<Project.Models.Staff>(command);
                    if (!String.IsNullOrEmpty(command.Password))
                    {
                        _Staff_to_update.PasswordHash = command.Password + "1234"; // hash function
                    }
                    _dbContext.Staffs.Update(_Staff_to_update);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new UpdateStaffResponse {
                        MESSAGE = "Tạo khách hàng thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<StaffDto>(_Staff_to_update)
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateStaffResponse {
                        MESSAGE = "Tạo khách hàng thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
