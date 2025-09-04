using System.ComponentModel.DataAnnotations;

namespace MyCustomers.Application.Contracts.Users;

/// <summary>
/// Data transfer object for updating user information.
/// </summary>
/// <param name="NewEmail">The new email address for the user (optional).</param>
/// <param name="NewPassword">The new password for the user (optional).</param>
/// <param name="IsAdmin">Used to set user admin.</param>
public record UpdateUserDto([property: EmailAddress] string? NewEmail, string? NewPassword, bool? IsAdmin);
