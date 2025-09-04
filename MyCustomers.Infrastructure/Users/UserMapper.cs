using Microsoft.AspNetCore.Identity;
using Riok.Mapperly.Abstractions;
using MyCustomers.Application;
using MyCustomers.Application.Contracts.Users;

namespace MyCustomers.Infrastructure.Users;

/// <summary>
/// Mapperly implementation for mapping between IdentityUser and UserDto.
/// </summary>
[Mapper]
public partial class UserMapper : IMapper<IdentityUser, UserDto>
{
    /// <inheritdoc />
    [MapperIgnoreSource(nameof(IdentityUser.AccessFailedCount))]
    [MapperIgnoreSource(nameof(IdentityUser.ConcurrencyStamp))]
    [MapperIgnoreSource(nameof(IdentityUser.EmailConfirmed))]
    [MapperIgnoreSource(nameof(IdentityUser.LockoutEnabled))]
    [MapperIgnoreSource(nameof(IdentityUser.LockoutEnd))]
    [MapperIgnoreSource(nameof(IdentityUser.NormalizedEmail))]
    [MapperIgnoreSource(nameof(IdentityUser.NormalizedUserName))]
    [MapperIgnoreSource(nameof(IdentityUser.PasswordHash))]
    [MapperIgnoreSource(nameof(IdentityUser.PhoneNumber))]
    [MapperIgnoreSource(nameof(IdentityUser.PhoneNumberConfirmed))]
    [MapperIgnoreSource(nameof(IdentityUser.SecurityStamp))]
    [MapperIgnoreSource(nameof(IdentityUser.TwoFactorEnabled))]
    [MapperIgnoreSource(nameof(IdentityUser.UserName))]
    public partial UserDto MapToDto(IdentityUser entity);
}
