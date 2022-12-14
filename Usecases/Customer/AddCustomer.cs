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
    public class AddCustomerResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public CustomerDto? RESPONSES {get;set;} 
        public dynamic? ERROR {get;set;}
    }
    public class AddCustomerCommand : IRequest<AddCustomerResponse>
    {
        public string? Username {get;set;}
        public string? Name {get;set;}
        public int Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Password {get;set;}
    }
    public class AddCustomerValidator : AbstractValidator<AddCustomerCommand>
    {
        public AddCustomerValidator()
        {
            RuleFor(x => x.Username).NotNull().NotEmpty().WithMessage("Username không được trống");
            RuleFor(x => x.Name).NotNull().NotEmpty().WithMessage("Tên không được trống");
            RuleFor(x => x.Identify).NotNull().NotEmpty().WithMessage("CMND không được trống");
            RuleFor(x => x.Email).NotNull().NotEmpty().WithMessage("Email không được trống");
            RuleFor(x => x.Phone).NotNull().NotEmpty().WithMessage("SĐT không được trống");
            RuleFor(x => x.Password).NotNull().NotEmpty().WithMessage("Password không được trống");
        }
    }
    public class AddCustomerHandler : IRequestHandler<AddCustomerCommand, AddCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;
        private readonly IUserAccessor _userAccessor;
        //private readonly CustomerRepository _customerRepo;

        public AddCustomerHandler(DataContext dbContext,IMapper mapper,IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
           // _customerRepo = CustomerRepo;
        }
        public async Task<AddCustomerResponse> Handle(AddCustomerCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    CustomerRepository _customerRepo = new CustomerRepository(_dbContext);

                    bool _username_checked = _dbContext.Customers.Any(u => u.USERNAME == command.Username);
                    bool _phone_checked = _dbContext.Customers.Any(u => u.PHONE == command.Phone);
                    bool _email_checked = _dbContext.Customers.Any(u => u.EMAIL == command.Email);
                    bool _identify_checked = _dbContext.Customers.Any(u => u.IDENTIFY == command.Identify);

                    List<string> _existed_prop = new List<string> { _username_checked ? "Username đã được sử dụng!" : null , 
                                                                    _phone_checked ? "SĐT đã được sử dụng!": null, 
                                                                    _email_checked ? "Email đã được sử dụng!" : null,
                                                                    _identify_checked ? "CMND đã được sử dụng!" : null
                                                                    };
                    _existed_prop.RemoveAll(s => s == null);
                    if (_existed_prop.Count() > 0)
                    {
                        return new AddCustomerResponse {
                            MESSAGE = "Thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                            ERROR = _existed_prop
                        };
                    }
                    Project.Models.Customer _customer_to_add = _mapper.Map<Project.Models.Customer>(command);
                    _customer_to_add.CREATEDDATE = DateTime.Now;
                    _customer_to_add.PasswordHash = _customerRepo.HashPassword(command.Password);
                    _customer_to_add.STATUS = "active";
                    _customer_to_add.CODE = "KH_" + String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(0, 4) + 
                                            String.Concat(Guid.NewGuid().ToString("N").Select(c => (char)(c + 17))).ToUpper().Substring(10, 4);
                    await _dbContext.AddAsync(_customer_to_add, cancellationToken);
                    await _dbContext.SaveChangesAsync(cancellationToken);
                    dbContextTransaction.Commit();
                    return new AddCustomerResponse {
                        MESSAGE = "Tạo khách hàng thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<CustomerDto>(_customer_to_add),
                    };
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new AddCustomerResponse {
                        MESSAGE = "Tạo khách hàng thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
