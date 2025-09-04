using System.ComponentModel.DataAnnotations;

namespace MyCustomers.Application.Contracts.Users;

/// <summary>
/// Data transfer object for creating a new user.
/// </summary>
/// <param name="Email">The email address of the user.</param>
/// <param name="Password">The password for the user account.</param>
/// <param name="IsAdmin">Used to set user admin.</param>
public record CreateUserDto(
    [property: Required, EmailAddress] string Email,
    [property: Required] string Password,
    [property: Required] bool IsAdmin
);
