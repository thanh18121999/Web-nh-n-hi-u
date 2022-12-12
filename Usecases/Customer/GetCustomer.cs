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
    public class GetCustomerResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public IEnumerable<CustomerDto>? RESPONSES {get;set;} 
    }
    public class GetCustomerCommand : IRequest<GetCustomerResponse>
    {
        public string? Type {get;set;}
        public IEnumerable<string>? Data {get;set;}
    }
    public class GetCustomerValidator : AbstractValidator<GetCustomerCommand>
    {
        public GetCustomerValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại truy vấn không được trống");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("Thông tin truy vấn không được trống");
        }
    }
    public class GetCustomerHandler : IRequestHandler<GetCustomerCommand, GetCustomerResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetCustomerHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<GetCustomerResponse> Handle(GetCustomerCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    IEnumerable<Project.Models.Customer> list_customer_response = Enumerable.Empty<Project.Models.Customer>();

                    switch (command.Type)
                    {
                        case "GET_BY_CODE":
                            list_customer_response = await _dbContext.Customers.Where(x => command.Data.Contains(x.CODE)).ToListAsync(cancellationToken);
                            break;
                        case "GET_BY_ID" :
                            list_customer_response = await _dbContext.Customers.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                            break;
                        default:
                            break;
                    }
                    
                    return new GetCustomerResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<IEnumerable<CustomerDto>>(list_customer_response)
                    };
                }
                catch {
                    return new GetCustomerResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
