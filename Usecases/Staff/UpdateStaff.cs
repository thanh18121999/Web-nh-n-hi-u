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
        public int? ID {get;set;}
        public string? Name {get;set;}
        public int? Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Tittle {get;set;}
        public DateTime StartWorkDate {get;set;}
        public int? Level {get;set;}
        //public string? Password {get;set;}

    }
    public class UpdateStaffValidator : AbstractValidator<UpdateStaffCommand>
    {
        public UpdateStaffValidator()
        {
            RuleFor(x => x.ID).NotNull().NotEmpty().WithMessage("ID không được trống");
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
                    Project.Models.Staff? _Staff_to_update = await _dbContext.Staffs.FirstOrDefaultAsync(x=>x.ID == command.ID, cancellationToken);
                    if (_Staff_to_update != null)
                    {
                        _mapper.Map<UpdateStaffCommand,Project.Models.Staff>(command, _Staff_to_update);
                        _dbContext.Staffs.Update(_Staff_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        dbContextTransaction.Commit();
                        return new UpdateStaffResponse {
                            MESSAGE = "Cập nhật thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _mapper.Map<StaffDto>(_Staff_to_update)
                        };
                    }
                    else {
                        return new UpdateStaffResponse {
                            MESSAGE = "Cập nhật thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest
                        };
                    }
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateStaffResponse {
                        MESSAGE = "Cập nhật thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
