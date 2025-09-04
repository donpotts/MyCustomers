using FluentResults;

namespace MyCustomers.Application.Contracts.Users;

/// <summary>
/// Service for managing user account operations.
/// </summary>
public interface IUserAccountService
{
    /// <summary>
    /// Gets the current authenticated user.
    /// </summary>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The current user or null if not found.</returns>
    Task<Result<UserDto>> GetCurrentUserAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Creates a new user account.
    /// </summary>
    /// <param name="dto">The data transfer object containing user creation information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The created user information or an error if creation failed.</returns>
    Task<Result<UserDto>> CreateUserAsync(
        CreateUserDto dto,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gets a paginated list of users.
    /// </summary>
    /// <param name="skip">The number of users to skip for pagination. If null, starts from the beginning.</param>
    /// <param name="take">The maximum number of users to return. If null, returns all remaining users.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A paginated result containing the list of users.</returns>
    Task<Result<PageDto<UserDto>>> ListUsersAsync(
        int? skip = null,
        int? take = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gets a user by their unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The user with the specified ID or null if not found.</returns>
    Task<Result<UserDto>> GetUserByIdAsync(
        string id,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Updates an existing user's information.
    /// </summary>
    /// <param name="id">The unique identifier of the user to update.</param>
    /// <param name="dto">The data transfer object containing updated user information.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>The updated user information or an error if update failed.</returns>
    Task<Result<UserDto>> UpdateUserAsync(
        string id,
        UpdateUserDto dto,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes a user account.
    /// </summary>
    /// <param name="id">The unique identifier of the user to delete.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A result indicating success or failure of the deletion operation.</returns>
    Task<Result> DeleteUserAsync(string id, CancellationToken cancellationToken = default);
}
