namespace MyCustomersApp.Models;

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

public class RegisterRequest
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
}

public class CreateUserRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
}

public class UpdateUserRequest
{
    public string? NewEmail { get; set; }
    public string? NewPassword { get; set; }
    public bool? IsAdmin { get; set; }
}

public class AuthResponse
{
    public bool Success { get; set; }
    public string Token { get; set; } = string.Empty;
    public string Message { get; set; } = string.Empty;
    public UserInfo? User { get; set; }
}

public class UserInfo
{
    public string Id { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
    public string DisplayName => Email ?? "Unknown User";
}

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string? Email { get; set; } = string.Empty;
    public bool IsAdmin { get; set; } = false;
}

public class PagedUserResponse
{
    public List<UserDto> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public bool HasNextPage { get; set; }
}