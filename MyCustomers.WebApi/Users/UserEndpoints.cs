using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http.HttpResults;
using MyCustomers.Application.Contracts;
using MyCustomers.Application.Contracts.Results;
using MyCustomers.Application.Contracts.Users;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.WebApi.Users;

/// <summary>
/// Contains the endpoints for user-related API operations.
/// </summary>
public static class UserEndpoints
{
    /// <summary>
    /// Maps the user endpoints to the specified <see cref="IEndpointRouteBuilder"/>.
    /// </summary>
    /// <param name="app">The endpoint route builder.</param>
    /// <returns>The endpoint route builder with user endpoints mapped.</returns>
    public static IEndpointRouteBuilder MapUserEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/users")
            .WithTags("Users")
            .WithParameterValidation()
            .RequireAuthorization();
        group.MapGet("/me", GetCurrentUserAsync);
        group.MapGet("/", ListUsersAsync);
        group.MapPost("/", CreateUserAsync);
        group.MapGet("/{id}", GetUserByIdAsync);
        group.MapPut("/{id}", UpdateUserAsync);
        group.MapDelete("/{id}", DeleteUserAsync).ProducesProblem(StatusCodes.Status409Conflict);

        return app;
    }

    /// <summary>Gets the current authenticated user's information.</summary>
    /// <param name="userAccountService">The user account service to retrieve user information.</param>
    /// <returns>The user information if found; otherwise, an unauthorized result.</returns>
    public static async Task<
        Results<Ok<UserDto>, UnauthorizedHttpResult, ProblemHttpResult>
    > GetCurrentUserAsync(IUserAccountService userAccountService)
    {
        var result = await userAccountService.GetCurrentUserAsync();

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.Unauthorized(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Gets a paginated list of users. Requires admin authorization.
    /// </summary>
    /// <param name="userAccountService">The user account service to retrieve user information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <param name="skip">The number of users to skip for pagination. Default is 0.</param>
    /// <param name="take">The maximum number of users to return. Default is the configured page size.</param>
    /// <returns>A paginated list of users if successful; otherwise, a forbidden or problem result.</returns>
    public static async Task<
        Results<Ok<PageDto<UserDto>>, ForbidHttpResult, ProblemHttpResult>
    > ListUsersAsync(
        IUserAccountService userAccountService,
        CancellationToken cancellationToken,
        [Range(0, int.MaxValue)] int? skip = null,
        [Range(1, AppServiceConstants.MaxPageSize)] int? take = null
    )
    {
        var result = await userAccountService.ListUsersAsync(skip, take, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            AccessDeniedError => TypedResults.Forbid(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Creates a new user with the provided information. Requires admin authorization.
    /// </summary>
    /// <param name="dto">The data transfer object containing user information to create.</param>
    /// <param name="userAccountService">The user account service to create the user.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The created user information if successful; otherwise, a forbidden or problem result.</returns>
    public static async Task<
        Results<Created<UserDto>, ForbidHttpResult, ProblemHttpResult>
    > CreateUserAsync(
        CreateUserDto dto,
        IUserAccountService userAccountService,
        CancellationToken cancellationToken
    )
    {
        var result = await userAccountService.CreateUserAsync(dto, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Created($"/api/users/{result.Value.Id}", result.Value);
        }

        return result.Errors[0] switch
        {
            AccessDeniedError => TypedResults.Forbid(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Gets a specific user by their unique identifier. Requires admin authorization.
    /// </summary>
    /// <param name="id">The unique identifier of the user to retrieve.</param>
    /// <param name="userAccountService">The user account service to retrieve user information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The user information if found; otherwise, a not found, forbidden, or problem result.</returns>
    public static async Task<
        Results<Ok<UserDto>, NotFound, ForbidHttpResult, ProblemHttpResult>
    > GetUserByIdAsync(
        string id,
        IUserAccountService userAccountService,
        CancellationToken cancellationToken
    )
    {
        var result = await userAccountService.GetUserByIdAsync(id, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.NotFound(),
            AccessDeniedError => TypedResults.Forbid(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Updates a specific user's information. Requires admin authorization.
    /// </summary>
    /// <param name="id">The unique identifier of the user to update.</param>
    /// <param name="dto">The data transfer object containing updated user information.</param>
    /// <param name="userAccountService">The user account service to update user information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The updated user information if successful; otherwise, a not found, forbidden, or problem result.</returns>
    public static async Task<
        Results<Ok<UserDto>, NotFound, ForbidHttpResult, ProblemHttpResult>
    > UpdateUserAsync(
        string id,
        UpdateUserDto dto,
        IUserAccountService userAccountService,
        CancellationToken cancellationToken
    )
    {
        var result = await userAccountService.UpdateUserAsync(id, dto, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.Ok(result.Value);
        }

        return result.Errors[0] switch
        {
            ResourceNotFoundError => TypedResults.NotFound(),
            AccessDeniedError => TypedResults.Forbid(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }

    /// <summary>
    /// Deletes a specific user. Requires admin authorization.
    /// </summary>
    /// <param name="id">The unique identifier of the user to delete.</param>
    /// <param name="userAccountService">The user account service to delete user information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>No content if successful; otherwise, a not found, forbidden, or problem result.</returns>
    public static async Task<
        Results<NoContent, NotFound, ForbidHttpResult, ProblemHttpResult>
    > DeleteUserAsync(
        string id,
        IUserAccountService userAccountService,
        CancellationToken cancellationToken
    )
    {
        var result = await userAccountService.DeleteUserAsync(id, cancellationToken);

        if (result.IsSuccess)
        {
            return TypedResults.NoContent();
        }

        return result.Errors[0] switch
        {
            ConflictError => TypedResults.Problem(
                result.Errors[0].Message,
                statusCode: StatusCodes.Status409Conflict
            ),
            ResourceNotFoundError => TypedResults.NotFound(),
            AccessDeniedError => TypedResults.Forbid(),
            _ => TypedResults.Problem(result.Errors[0].Message),
        };
    }
}
