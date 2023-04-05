using MediatR;
using AutoMapper;
using FluentValidation;
using System.Net;
using Project.Data;
using Project.Models.Dto;
using Microsoft.EntityFrameworkCore;
namespace Project.UseCases.Menu
{
    public class GetMenuResponse
    {
        public string? MESSAGE { get; set; }
        public HttpStatusCode STATUSCODE { get; set; }
        public dynamic? RESPONSES { get; set; }
    }
    public class GetMenuCommand : IRequest<GetMenuResponse>
    {
        public string? Type { get; set; }
        public IEnumerable<string> Data { get; set; } = Enumerable.Empty<string>();
    }
    public class GetMenuValidator : AbstractValidator<GetMenuCommand>
    {
        public GetMenuValidator()
        {
            RuleFor(x => x.Type).NotNull().NotEmpty().WithMessage("Loại truy vấn không được trống");
            RuleFor(x => x.Data).NotNull().NotEmpty().WithMessage("Thông tin truy vấn không được trống");
        }
    }
    public class GetMenuHandler : IRequestHandler<GetMenuCommand, GetMenuResponse>
    {
        private readonly IMapper _mapper;
        private readonly DataContext _dbContext;

        public GetMenuHandler(DataContext dbContext, IMapper mapper)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }
        public async Task<GetMenuResponse> Handle(GetMenuCommand command, CancellationToken cancellationToken)
        {

            try
            {
                IEnumerable<Project.Models.Menu> list_Menu_response = Enumerable.Empty<Project.Models.Menu>();
                switch (command.Type)
                {
                    case "GET_BY_ID":
                        list_Menu_response = await _dbContext.Menu.Where(x => command.Data.Contains(x.ID.ToString())).ToListAsync(cancellationToken);
                        break;
                    case "GET_ALL":
                        list_Menu_response = await _dbContext.Menu.ToListAsync(cancellationToken);
                        break;
                }

                return new GetMenuResponse
                {
                    MESSAGE = "GET_SUCCESSFUL",
                    STATUSCODE = HttpStatusCode.OK,
                    RESPONSES = list_Menu_response
                };
            }
            catch
            {
                return new GetMenuResponse
                {
                    MESSAGE = "GET_FAIL",
                    STATUSCODE = HttpStatusCode.InternalServerError
                };
            }

        }
    }
}
