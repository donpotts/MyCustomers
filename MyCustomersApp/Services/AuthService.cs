using System.Net.Http.Json;
using System.Text.Json;
using Microsoft.JSInterop;
using MyCustomersApp.Models;

namespace MyCustomersApp.Services;

public class AuthService : IAuthService
{
    private readonly HttpClient _httpClient;
    private readonly HttpClient _publicHttpClient;
    private readonly IJSRuntime _jsRuntime;
    private readonly ILogger<AuthService> _logger;
    private UserInfo? _currentUser;

    public event Action<bool>? AuthStateChanged;

    public AuthService(IHttpClientFactory httpClientFactory, IJSRuntime jsRuntime, ILogger<AuthService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("ApiClient");
        _publicHttpClient = httpClientFactory.CreateClient("PublicApiClient");
        _jsRuntime = jsRuntime;
        _logger = logger;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            var identityRequest = new
            {
                email = request.Email,
                password = request.Password
            };
            
            var response = await _publicHttpClient.PostAsJsonAsync("api/identity/login", identityRequest);
            
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<JsonElement>();
                var accessToken = result.GetProperty("accessToken").GetString();
                
                if (!string.IsNullOrEmpty(accessToken))
                {
                    await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "authToken", accessToken);
                    
                    // Get user details including admin status from the API
                    var userDetails = await GetUserDetailsAsync(accessToken);
                    
                    await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "userInfo", JsonSerializer.Serialize(userDetails));
                    _currentUser = userDetails;
                    AuthStateChanged?.Invoke(true);
                    
                    return new AuthResponse 
                    { 
                        Success = true, 
                        Token = accessToken,
                        User = userDetails 
                    };
                }
            }
            
            var errorContent = await response.Content.ReadAsStringAsync();
            return new AuthResponse { Success = false, Message = "Login failed: " + errorContent };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return new AuthResponse { Success = false, Message = "Login failed" };
        }
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        try
        {
            // Create Identity API compatible request
            var identityRequest = new
            {
                email = request.Email,
                password = request.Password
            };
            
            var response = await _publicHttpClient.PostAsJsonAsync("api/identity/register", identityRequest);
            
            if (response.IsSuccessStatusCode)
            {
                // Identity API returns different format, create our own response
                var user = new UserInfo
                {
                    Id = Guid.NewGuid().ToString(),
                    Email = request.Email,
                    IsAdmin = false
                };
                
                // Store registered user in localStorage for user management
                await StoreRegisteredUser(user);
                
                // For now, we'll consider registration successful but won't have a token
                // The user will need to log in separately
                return new AuthResponse 
                { 
                    Success = true, 
                    Message = "Registration successful. Please log in.",
                    User = user
                };
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                return new AuthResponse { Success = false, Message = "Registration failed: " + errorContent };
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return new AuthResponse { Success = false, Message = "Registration failed" };
        }
    }

    public async Task LogoutAsync()
    {
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "authToken");
        await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "userInfo");
        _currentUser = null;
        AuthStateChanged?.Invoke(false);
    }

    public async Task<bool> IsAuthenticatedAsync()
    {
        try
        {
            var token = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "authToken");
            return !string.IsNullOrEmpty(token);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error checking authentication status");
            return false;
        }
    }

    public async Task<UserInfo?> GetCurrentUserAsync()
    {
        if (_currentUser != null) return _currentUser;
        
        try
        {
            var userInfoJson = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "userInfo");
            if (!string.IsNullOrEmpty(userInfoJson))
            {
                _currentUser = JsonSerializer.Deserialize<UserInfo>(userInfoJson);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting current user");
        }
        
        return _currentUser;
    }

    private async Task<UserInfo> GetUserDetailsAsync(string accessToken)
    {
        try
        {
            // Create a temporary HttpClient with the auth token to get user details
            using var tempClient = new HttpClient();
            tempClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);
            tempClient.BaseAddress = new Uri(_httpClient.BaseAddress!.ToString());
            
            var response = await tempClient.GetAsync("api/users/me");
            if (response.IsSuccessStatusCode)
            {
                var userDto = await response.Content.ReadFromJsonAsync<UserDto>();
                if (userDto != null)
                {
                    return new UserInfo
                    {
                        Id = userDto.Id,
                        Email = userDto.Email,
                        IsAdmin = userDto.IsAdmin
                    };
                }
            }
            else
            {
                _logger.LogWarning("Failed to get user details from API, using fallback. Status: {StatusCode}", response.StatusCode);
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogWarning("Error content: {ErrorContent}", errorContent);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user details from API, using fallback");
        }
        
        // Fallback: create basic user info without admin status
        return new UserInfo
        {
            Id = Guid.NewGuid().ToString(),
            Email = "unknown@example.com",
            IsAdmin = false
        };
    }

    private async Task StoreRegisteredUser(UserInfo user)
    {
        try
        {
            var registeredUsersJson = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "registeredUsers");
            var registeredUsers = new List<UserInfo>();
            
            if (!string.IsNullOrEmpty(registeredUsersJson))
            {
                registeredUsers = JsonSerializer.Deserialize<List<UserInfo>>(registeredUsersJson) ?? new List<UserInfo>();
            }
            
            // Add user if not already exists
            if (!registeredUsers.Any(u => u.Email!.Equals(user.Email, StringComparison.OrdinalIgnoreCase)))
            {
                registeredUsers.Add(user);
                var updatedJson = JsonSerializer.Serialize(registeredUsers);
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "registeredUsers", updatedJson);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error storing registered user");
        }
    }
}