using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using MyCustomers.Application.Contracts;
using MyCustomers.Application.Contracts.Results;
using MyCustomers.Application.Contracts.Customers;
using MyCustomers.Domain.Shared.Results;
using MyCustomers.WebApi.Results;

namespace MyCustomers.WebApi.Customers;

/// <summary>
/// Contains the endpoints for customer-related API operations.
/// </summary>
public static class CustomerEndpoints
{
    /// <summary>
    /// Maps the customer endpoints to the specified <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    /// <param name="app">The endpoint route builder.</param>
    /// <returns>The endpoint route builder with customer endpoints mapped.</returns>
    public static IEndpointRouteBuilder MapCustomerEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app
            .MapGroup("/api/customers")
            .WithTags("Customers")
            .WithParameterValidation()
            .RequireAuthorization();
        group.MapGet("/", ListAsync);
        group.MapPost("/", CreateAsync).ProducesProblem(StatusCodes.Status409Conflict);
        group.MapGet("/{id:guid}", GetAsync);
        group.MapPut("/{id:guid}", UpdateAsync).ProducesProblem(StatusCodes.Status409Conflict);
        group.MapDelete("/{id:guid}", DeleteAsync);

        return app;
    }

    /// <summary>
    /// Gets a customer by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the customer.</param>
    /// <param name="service">The customer application service.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The customer if found; otherwise, an error result.</returns>
    private static async Task<
        Results<Ok<CustomerDto>, NotFound, ForbidHttpResult, ProblemHttpResult>
    > GetAsync(Guid id, ICustomerAppService service, CancellationToken cancellationToken)
    {
        var result = await service.GetAsync(id, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.NotFound(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Lists customers with pagination.
    /// </summary>
    /// <param name="skip">The number of customers to skip.</param>
    /// <param name="take">The number of customers to take.</param>
    /// <param name="service">The customer application service.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>A page of customers or an error result.</returns>
    private static async Task<
        Results<Ok<PageDto<CustomerDto>>, ForbidHttpResult, ValidationProblem, ProblemHttpResult>
    > ListAsync(
        ICustomerAppService service,
        CancellationToken cancellationToken,
        [Range(0, int.MaxValue)] int? skip = null,
        [Range(1, AppServiceConstants.MaxPageSize)] int? take = null
    )
    {
        var result = await service.ListAsync(skip, take, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ValidationError => TypedResults.ValidationProblem(
                result.ToResult().MapValidationErrorsToDictionary()
            ),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Creates a new customer.
    /// </summary>
    /// <param name="dto">The data for the new customer.</param>
    /// <param name="service">The customer application service.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The created customer or an error result.</returns>
    private static async Task<
        Results<Created<CustomerDto>, ForbidHttpResult, ValidationProblem, ProblemHttpResult>
    > CreateAsync(
        CreateUpdateCustomerDto dto,
        ICustomerAppService service,
        CancellationToken cancellationToken
    )
    {
        var result = await service.CreateAsync(dto, cancellationToken);

        if (result.IsSuccess)
        {
            var customer = result.Value;
            return TypedResults.Created($"/api/customers/{customer.Id}", customer);
        }

        return result.Errors[0] switch
        {
            ConflictError => TypedResults.Problem(
                result.Errors[0].Message,
                statusCode: StatusCodes.Status409Conflict
            ),
            ValidationError => TypedResults.ValidationProblem(
                result.ToResult().MapValidationErrorsToDictionary()
            ),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Updates an existing customer.
    /// </summary>
    /// <param name="id">The unique identifier of the customer to update.</param>
    /// <param name="dto">The updated customer data.</param>
    /// <param name="service">The customer application service.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The updated customer or an error result.</returns>
    private static async Task<
        Results<Ok<CustomerDto>, NotFound, ForbidHttpResult, ValidationProblem, ProblemHttpResult>
    > UpdateAsync(
        Guid id,
        CreateUpdateCustomerDto dto,
        ICustomerAppService service,
        CancellationToken cancellationToken
    )
    {
        var result = await service.UpdateAsync(id, dto, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.NotFound(),
            ConflictError => TypedResults.Problem(
                result.Errors[0].Message,
                statusCode: StatusCodes.Status409Conflict
            ),
            ValidationError => TypedResults.ValidationProblem(
                result.ToResult().MapValidationErrorsToDictionary()
            ),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Deletes a customer by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the customer to delete.</param>
    /// <param name="service">The customer application service.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>No content if successful; otherwise, an error result.</returns>
    private static async Task<
        Results<NoContent, NotFound, ForbidHttpResult, ProblemHttpResult>
    > DeleteAsync(Guid id, ICustomerAppService service, CancellationToken cancellationToken)
    {
        var result = await service.DeleteAsync(id, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.NoContent();
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.NotFound(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }
}
