using System.Security.Claims;
using MyCustomers.Application.Contracts.Users;

namespace MyCustomers.WebApi.Users;

/// <summary>
/// Provides access to the current authenticated user's information from HTTP context.
/// </summary>
/// <param name="httpContextAccessor">The HTTP context accessor to retrieve user claims.</param>
public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    private readonly HttpContext? _httpContext = httpContextAccessor.HttpContext;

    /// <inheritdoc />
    public string? UserId => _httpContext?.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    /// <inheritdoc />
    public string? Email => _httpContext?.User.FindFirst(ClaimTypes.Email)?.Value;

    /// <inheritdoc />
    public bool IsAuthenticated => _httpContext?.User.Identity?.IsAuthenticated ?? false;
}
