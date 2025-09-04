namespace MyCustomers.Application.Contracts.Users;

/// <summary>
/// Provides access to the current authenticated user's information.
/// </summary>
public interface ICurrentUserService
{
    /// <summary>Gets the unique identifier of the current user.</summary>
    string? UserId { get; }

    /// <summary>Gets the email address of the current user.</summary>
    string? Email { get; }

    /// <summary>Gets a value indicating whether the current user is authenticated.</summary>
    bool IsAuthenticated { get; }
}
