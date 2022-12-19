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
        public dynamic? ERROR {get;set;}

    }
    public class UpdateCustomerCommand : IRequest<UpdateCustomerResponse>
    {
        public string? Name {get;set;}
        public int? Sex {get;set;}
        public string? Identify {get;set;}
        public string? Email {get;set;}
        public string? Phone {get;set;}
        public string? Status {get;set;}
        //public string? Password {get;set;}

    }
    public class UpdateCustomerValidator : AbstractValidator<UpdateCustomerCommand>
    {
        public UpdateCustomerValidator()
        {
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
        private readonly IUserAccessor _userAccessor;
        public UpdateCustomerHandler(DataContext dbContext,IMapper mapper, IUserAccessor userAccessor)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _userAccessor = userAccessor;
        }
        public async Task<UpdateCustomerResponse> Handle(UpdateCustomerCommand command, CancellationToken cancellationToken)
        {
            using (var dbContextTransaction = _dbContext.Database.BeginTransaction())
            {
                try {
                    CustomerRepository _customerRepo = new CustomerRepository(_dbContext);
                    bool _phone_checked = _dbContext.Customers.Any(u => u.PHONE == command.Phone);
                    bool _email_checked = _dbContext.Customers.Any(u => u.EMAIL == command.Email);
                    bool _identify_checked = _dbContext.Customers.Any(u => u.IDENTIFY == command.Identify);

                    List<string> _existed_prop = new List<string> {  
                                                                    _phone_checked ? "SĐT đã được sử dụng!": string.Empty, 
                                                                    _email_checked ? "Email đã được sử dụng!" : string.Empty,
                                                                    _identify_checked ? "CMND đã được sử dụng!" : string.Empty
                                                                    };
                    _existed_prop.RemoveAll(s => s == string.Empty);
                    if (_existed_prop.Count() > 0)
                    {
                        return new UpdateCustomerResponse {
                            MESSAGE = "Thất bại!",
                            STATUSCODE = HttpStatusCode.BadRequest,
                            ERROR = _existed_prop
                        };
                    }
                    Project.Models.Customer? _customer_to_update = await _dbContext.Customers.FirstOrDefaultAsync(x => x.ID.ToString() == _userAccessor.getID(), cancellationToken );
                    
                    if (_customer_to_update != null)
                    {
                        _mapper.Map<UpdateCustomerCommand,Project.Models.Customer>(command,_customer_to_update);
                        // if (!String.IsNullOrEmpty(command.))
                        // {
                        //     _customer_to_update.PASSWORDHASH = _customerRepo.HashPassword(command.Password, out var salt); 
                        //     _customer_to_update.PASSWORDSALT = Convert.ToHexString(salt);
                        // }
                        _dbContext.Customers.Update(_customer_to_update);
                        await _dbContext.SaveChangesAsync(cancellationToken);
                        dbContextTransaction.Commit();
                        return new UpdateCustomerResponse {
                            MESSAGE = "Cập nhật thành công!",
                            STATUSCODE = HttpStatusCode.OK,
                            RESPONSES = _mapper.Map<CustomerDto>(_customer_to_update)
                        };
                    }
                    else {
                        return new UpdateCustomerResponse {
                            MESSAGE = "Unknown user!",
                            STATUSCODE = HttpStatusCode.BadRequest
                        };
                    }
                }
                catch {
                    dbContextTransaction.Rollback();
                    return new UpdateCustomerResponse {
                        MESSAGE = "Cập nhật thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            }
        }
    }
}
