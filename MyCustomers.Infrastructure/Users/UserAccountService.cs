using FluentResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MyCustomers.Application;
using MyCustomers.Application.Contracts;
using MyCustomers.Application.Contracts.Results;
using MyCustomers.Application.Contracts.Users;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.Infrastructure.Users;

/// <summary>
/// Provides user account management services using ASP.NET Core Identity.
/// </summary>
/// <param name="currentUserService">The current user service to access authenticated user information.</param>
/// <param name="userManager">The ASP.NET Core Identity user manager.</param>
public class UserAccountService(
    ICurrentUserService currentUserService,
    UserManager<IdentityUser> userManager,
    IMapper<IdentityUser, UserDto> mapper
) : IUserAccountService
{
    private readonly ICurrentUserService _currentUserService = currentUserService;
    private readonly UserManager<IdentityUser> _userManager = userManager;
    private readonly IMapper<IdentityUser, UserDto> _mapper = mapper;

    /// <inheritdoc />
    public async Task<Result<UserDto>> GetCurrentUserAsync(
        CancellationToken cancellationToken = default
    )
    {
        var userResult = await GetCurrentIdentityUserAsync();

        if (userResult.IsFailed)
        {
            return userResult.ToResult<UserDto>();
        }

        var dto = _mapper.MapToDto(userResult.Value) with
        {
            IsAdmin = await _userManager.IsInRoleAsync(userResult.Value, "Admin")
        };

        return Result.Ok(dto);
    }

    /// <inheritdoc />
    public async Task<Result<PageDto<UserDto>>> ListUsersAsync(
        int? skip = null,
        int? take = null,
        CancellationToken cancellationToken = default
    )
    {
        var paginationResult = PaginationValidator.Validate(skip, take);

        if (paginationResult.IsFailed)
        {
            return paginationResult;
        }

        skip ??= 0;
        take ??= AppServiceConstants.DefaultPageSize;

        var isAdminResult = await CurrentUserIsAdminAsync();

        if (isAdminResult.IsFailed)
        {
            return isAdminResult.ToResult<PageDto<UserDto>>();
        }

        var usersQueryable = _userManager.Users.AsNoTracking();

        var totalCount = await usersQueryable.CountAsync(cancellationToken);

        var usersPage = await usersQueryable
            .Skip(skip.Value)
            .Take(take.Value)
            .ToListAsync(cancellationToken);

        // Get admins for the page (cheaper than calling IsInRoleAsync per user in most cases)
        var adminsInRole = await _userManager.GetUsersInRoleAsync("Admin");
        var adminIds = new HashSet<string>(adminsInRole.Select(a => a.Id));

        var items = usersPage
            .Select(u =>
            {
                var dto = _mapper.MapToDto(u);
                return dto with { IsAdmin = adminIds.Contains(u.Id) };
            })
            .ToList();

        return new PageDto<UserDto>(totalCount, items);
    }

    /// <inheritdoc />
    public async Task<Result<UserDto>> CreateUserAsync(
        CreateUserDto dto,
        CancellationToken cancellationToken = default
    )
    {
        var isAdminResult = await CurrentUserIsAdminAsync();

        if (isAdminResult.IsFailed)
        {
            return isAdminResult.ToResult<UserDto>();
        }

        IdentityUser newUser = new() { UserName = dto.Email, Email = dto.Email };

        var createResult = await _userManager.CreateAsync(newUser, dto.Password);

        if (!createResult.Succeeded)
        {
            return Result.Fail(createResult.Errors.Select(e => new Error(e.Description)));
        }

        if (dto.IsAdmin)
        {
            var addToRoleResult = await _userManager.AddToRoleAsync(newUser, "Admin");
            if (!addToRoleResult.Succeeded)
            {
                // Try to clean up the created user to avoid leaving an account without intended role
                await _userManager.DeleteAsync(newUser);
                return Result.Fail(addToRoleResult.Errors.Select(e => new Error(e.Description)));
            }
        }

        var resultDto = _mapper.MapToDto(newUser) with
        {
            IsAdmin = await _userManager.IsInRoleAsync(newUser, "Admin")
        };

        return Result.Ok(resultDto);
    }

    /// <inheritdoc />
    public async Task<Result<UserDto>> GetUserByIdAsync(
        string id,
        CancellationToken cancellationToken = default
    )
    {
        var isAdminResult = await CurrentUserIsAdminAsync();

        if (isAdminResult.IsFailed)
        {
            return isAdminResult.ToResult<UserDto>();
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user is null)
        {
            return Result.Fail(new ResourceNotFoundError("User not found."));
        }

        var dto = _mapper.MapToDto(user) with
        {
            IsAdmin = await _userManager.IsInRoleAsync(user, "Admin")
        };

        return Result.Ok(dto);
    }

    /// <inheritdoc />
    public async Task<Result<UserDto>> UpdateUserAsync(
        string id,
        UpdateUserDto dto,
        CancellationToken cancellationToken = default
    )
    {
        var isAdminResult = await CurrentUserIsAdminAsync();

        if (isAdminResult.IsFailed)
        {
            return isAdminResult.ToResult<UserDto>();
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user is null)
        {
            return Result.Fail(new ResourceNotFoundError("User not found."));
        }

        if (!string.IsNullOrWhiteSpace(dto.NewEmail))
        {
            var emailResult = await _userManager.SetEmailAsync(user, dto.NewEmail);
            if (!emailResult.Succeeded)
            {
                return Result.Fail(emailResult.Errors.Select(e => new Error(e.Description)));
            }

            var nameResult = await _userManager.SetUserNameAsync(user, dto.NewEmail);
            if (!nameResult.Succeeded)
            {
                return Result.Fail(nameResult.Errors.Select(e => new Error(e.Description)));
            }
        }

        if (!string.IsNullOrWhiteSpace(dto.NewPassword))
        {
            var hasPassword = await _userManager.HasPasswordAsync(user);

            if (hasPassword)
            {
                var removePasswordResult = await _userManager.RemovePasswordAsync(user);
                if (!removePasswordResult.Succeeded)
                {
                    return Result.Fail(
                        removePasswordResult.Errors.Select(e => new Error(e.Description))
                    );
                }
            }

            var addPasswordResult = await _userManager.AddPasswordAsync(user, dto.NewPassword);
            if (!addPasswordResult.Succeeded)
            {
                return Result.Fail(addPasswordResult.Errors.Select(e => new Error(e.Description)));
            }
        }

        // Handle admin role changes when provided
        if (dto.IsAdmin.HasValue)
        {
            var currentlyAdmin = await _userManager.IsInRoleAsync(user, "Admin");

            if (dto.IsAdmin.Value && !currentlyAdmin)
            {
                var addToRoleResult = await _userManager.AddToRoleAsync(user, "Admin");
                if (!addToRoleResult.Succeeded)
                {
                    return Result.Fail(addToRoleResult.Errors.Select(e => new Error(e.Description)));
                }
            }
            else if (!dto.IsAdmin.Value && currentlyAdmin)
            {
                // Prevent removing admin role from yourself
                var currentUser = await GetCurrentIdentityUserAsync();
                if (currentUser.IsFailed)
                {
                    return currentUser.ToResult<UserDto>();
                }

                if (currentUser.Value.Id == user.Id)
                {
                    return Result.Fail(new ConflictError("Users cannot remove their own admin role."));
                }

                var removeFromRoleResult = await _userManager.RemoveFromRoleAsync(user, "Admin");
                if (!removeFromRoleResult.Succeeded)
                {
                    return Result.Fail(removeFromRoleResult.Errors.Select(e => new Error(e.Description)));
                }
            }
        }

        var resultDto = _mapper.MapToDto(user) with
        {
            IsAdmin = await _userManager.IsInRoleAsync(user, "Admin")
        };

        return Result.Ok(resultDto);
    }

    /// <inheritdoc />
    public async Task<Result> DeleteUserAsync(
        string id,
        CancellationToken cancellationToken = default
    )
    {
        var isAdminResult = await CurrentUserIsAdminAsync();

        if (isAdminResult.IsFailed)
        {
            return isAdminResult;
        }

        var currentUser = await GetCurrentIdentityUserAsync();

        if (currentUser.IsFailed)
        {
            return currentUser.ToResult();
        }

        if (currentUser.Value.Id == id)
        {
            return Result.Fail(new ConflictError("Users cannot delete their own account."));
        }

        var user = await _userManager.FindByIdAsync(id);

        if (user is null)
        {
            return Result.Fail(new ResourceNotFoundError("User not found."));
        }

        // Prevent deleting the last Admin account
        var isTargetAdmin = await _userManager.IsInRoleAsync(user, "Admin");
        if (isTargetAdmin)
        {
            var admins = await _userManager.GetUsersInRoleAsync("Admin");
            if (admins.Count <= 1)
            {
                return Result.Fail(new ConflictError("Cannot delete the last admin user."));
            }
        }

        var deleteResult = await _userManager.DeleteAsync(user);

        if (!deleteResult.Succeeded)
        {
            return Result.Fail(deleteResult.Errors.Select(e => new Error(e.Description)));
        }

        return Result.Ok();
    }

    /// <summary>
    /// Gets the current authenticated user's Identity information.
    /// </summary>
    /// <returns>A result containing the current user's IdentityUser object or an error if not found or not authenticated.</returns>
    private async Task<Result<IdentityUser>> GetCurrentIdentityUserAsync()
    {
        if (!_currentUserService.IsAuthenticated || _currentUserService.UserId is null)
        {
            return Result.Fail(new AccessDeniedError("User is not authenticated."));
        }

        var user = await _userManager.FindByIdAsync(_currentUserService.UserId);

        if (user is null)
        {
            return Result.Fail(new AccessDeniedError("User not found."));
        }

        return Result.Ok(user);
    }

    /// <summary>
    /// Checks if the current authenticated user is in the Admin role.
    /// </summary>
    /// <returns>A result indicating success if the user is an admin, or an error if not authenticated or not an admin.</returns>
    private async Task<Result> CurrentUserIsAdminAsync()
    {
        var userResult = await GetCurrentIdentityUserAsync();

        if (userResult.IsFailed)
        {
            return userResult.ToResult();
        }

        var isAdmin = await _userManager.IsInRoleAsync(userResult.Value, "Admin");

        return isAdmin ? Result.Ok() : Result.Fail(new AccessDeniedError("User is not an admin."));
    }
}
