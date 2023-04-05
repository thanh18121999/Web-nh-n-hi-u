using FluentValidation;
using MediatR;
using Project.Validation.Models;
namespace XLog.Order.Infrastructure.Validation
{
    public class RequestValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : IRequest<TResponse>
    {
        private readonly IValidator<TRequest> _validator;
        private readonly ILogger<RequestValidationBehavior<TRequest, TResponse>> _logger;

        public RequestValidationBehavior(IValidator<TRequest> validator, ILogger<RequestValidationBehavior<TRequest, TResponse>> logger)
        {
            _validator = validator;
            _logger = logger;
        }

        public async Task<TResponse> Handle(TRequest request, CancellationToken cancellationToken, RequestHandlerDelegate<TResponse> next)
        {
            try {
                _logger.LogInformation($"Doing validation for {nameof(request)}");
                await _validator.HandleValidation(request);
                return await next();
            }

            catch (Project.Validation.Models.ValidationException ex){

                throw new Project.Validation.Models.ValidationException(ex.ValidationResultModel);
            
            }
            
            
        }
    }
}
