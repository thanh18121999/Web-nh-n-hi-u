using MediatR;
using System.Collections.Generic;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using System.Linq;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Customers
{
    public class UpdateCustomerResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CustomerDto? RESPONSES {get;set;} 
    }
    public class UpdateCustomerCommand : IRequest<UpdateCustomerResponse>
    {
        public string? Name {get;set;}
        public int Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Status {get;set;}
        public string? Password {get;set;}

    }
    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerCommand>
    {
        public UpdateCustomerValidator()
        {
            // RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            // RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            // RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            // RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            // RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class UpdateCustomerHandler : IRequestHandler<UpdateCustomerCommand, UpdateCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public UpdateCustomerHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<UpdateCustomerResponse> Handle(UpdateCustomerCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    Project.Models.Customer _customer_to_update = _mapper.Map<Project.Models.Customer>(command);
                    if (!String.IsNullOrEmpty(command.Password))
                    {
                        _customer_to_update.PasswordHash = command.Password + "1234"; // hash function
                    }
                    _dbContext.Customers.Update(_customer_to_update);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new UpdateCustomerResponse {
                        MESSAGE = "Tạo khách hàng thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<CustomerDto>(_customer_to_update)
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateCustomerResponse {
                        MESSAGE = "Tạo khách hàng thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
