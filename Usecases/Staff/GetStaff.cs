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
    public class GetStaffResponse 
    {
        public string? MESSAGE {get;set;}
        public HttpStatusCode STATUSCODE {get;set;}
        public IEnumerable<StaffDto>? RESPONSES {get;set;} 
    }
    public class GetStaffCommand : IRequest<GetStaffResponse>
    {
        public string? Type {get;set;}
        public IEnumerable<string> Data {get;set;} = Enumerable.Empty<string>();
    }
    public class GetStaffValidator : AbstractValidator<GetStaffCommand>
    {
        public GetStaffValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại truy vấn không được trống");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("Thông tin truy vấn không được trống");
        }
    }
    public class GetStaffHandler : IRequestHandler<GetStaffCommand, GetStaffResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetStaffHandler(DataContext dbContext,IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<GetStaffResponse> Handle(GetStaffCommand command, CancellationToken cancellationToken)
        {
            
                try {
                    IEnumerable<Project.Models.Staff> list_Staff_response = Enumerable.Empty<Project.Models.Staff>();

                    switch (command.Type)
                    {
                        case "GET_BY_CODE":
                            list_Staff_response = await _dbContext.Staffs.Where(x => command.Data.Contains(x.CODE)).ToListAsync(cancellationToken);
                            break;
                        case "GET_BY_ID" :
                            list_Staff_response = await _dbContext.Staffs.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                            break;
                        default:
                            list_Staff_response = await _dbContext.Staffs.ToListAsync(cancellationToken);
                            break;
                    }
                    
                    return new GetStaffResponse {
                        MESSAGE = "Truy vấn thành công!",
                        STATUSCODE = HttpStatusCode.OK,
                        RESPONSES = _mapper.Map<IEnumerable<StaffDto>>(list_Staff_response)
                    };
                }
                catch {
                    return new GetStaffResponse {
                        MESSAGE = "Thất bại!",
                        STATUSCODE = HttpStatusCode.InternalServerError
                    };
                }
            
        }
    }
}
