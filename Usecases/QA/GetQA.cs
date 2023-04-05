using System;
using System.Net;
using AutoMapper;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Project.Data;
using Project.UseCases.Article;

namespace Project.Usecases.QA
{
	public class GetQAResponse
	{
		public string? MESSAGE { get; set; }
		public HttpStatusCode STATUSCODE { get; set; }
		public dynamic? RESPONSES { get; set; }
	}

	public class GetQACommand : IRequest<GetQAResponse>
	{
		public string? Type { get; set; }
		public IEnumerable<string> Data { get; set; } = Enumerable.Empty<string>();
		public int? NoOfResult { get; set; }
	}

	public class GetQAValidator : AbstractValidator<GetArticleCommand>
	{
		public GetQAValidator()
		{
			RuleFor(x => x.Type).NotEmpty().NotNull().WithMessage("TYPE MUST NOT BE BLANK");
		}
	}

	public class GetQAHanlder : IRequestHandler<GetQACommand, GetQAResponse>
	{
		private readonly IMapper _mapper;
		private readonly DataContext _dbContext;
		private readonly IHttpContextAccessor _accessor;

		public GetQAHanlder(DataContext dbContext, IMapper mapper, IHttpContextAccessor accessor)
		{
			_mapper = mapper;
			_dbContext = dbContext;
			_accessor = accessor;
		}

        public async Task<GetQAResponse> Handle(GetQACommand command, CancellationToken cancellationToken)
        {
			IEnumerable<Project.Models.QA> list_QA_response = Enumerable.Empty<Project.Models.QA>();

			var idUser = _accessor.HttpContext?.Items["ID"]?.ToString();

			try
			{
				switch (command.Type)
				{
					case "GET_ALL":
						list_QA_response = await _dbContext.QA.Where(x => x.NEEDASSIGN == 0).ToListAsync(cancellationToken);
						break;

					case "GET_BY_EXPERT":
						list_QA_response = await _dbContext.QA.Where(x => x.ASSIGNEXPERT.ToString() == idUser).ToListAsync(cancellationToken);
						break;

					case "GET":
						list_QA_response = await _dbContext.QA.Where(x => x.NEEDASSIGN == 1 && x.ASSIGNEXPERT == null).ToListAsync(cancellationToken);
						break;

					default:
						return new GetQAResponse
						{
							MESSAGE = "GET_FAILED",
							STATUSCODE = HttpStatusCode.InternalServerError
						};
				}
				return new GetQAResponse
				{
					MESSAGE = "GET_SUCCUSSFULLY",
					STATUSCODE = HttpStatusCode.OK,
					RESPONSES = list_QA_response
				};
			}
			catch
			{
				return new GetQAResponse
				{
					MESSAGE = "GET_FAILED",
					STATUSCODE = HttpStatusCode.InternalServerError
				};
			}
		}
    }

}

