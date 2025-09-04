namespace MyCustomers.Application.Contracts.Users;

/// <summary>
/// Data transfer object representing a user.
/// </summary>
/// <param name="Id">The unique identifier of the user.</param>
/// <param name="Email">The email address of the user.</param>
public record UserDto(string Id, string? Email)
{
    /// <summary>
    /// True when the user is in the Admin role.
    /// </summary>
    public bool IsAdmin { get; init; }
}
