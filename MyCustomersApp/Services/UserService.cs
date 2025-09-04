using System.Net.Http.Json;
using MyCustomersApp.Models;

namespace MyCustomersApp.Services;

public class UserService : IUserService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<UserService> _logger;
    private readonly IAuthService _authService;

    public UserService(IHttpClientFactory httpClientFactory, ILogger<UserService> logger, IAuthService authService)
    {
        _httpClient = httpClientFactory.CreateClient("ApiClient");
        _logger = logger;
        _authService = authService;
    }

    public async Task<IEnumerable<UserInfo>> GetUsersAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("api/users");
            if (response.IsSuccessStatusCode)
            {
                // API returns PageDto<UserDto>, need to extract the Items and convert to UserInfo
                var pagedResponse = await response.Content.ReadFromJsonAsync<PagedUserResponse>();
                if (pagedResponse?.Items != null)
                {
                    return pagedResponse.Items.Select(dto => new UserInfo
                    {
                        Id = dto.Id,
                        Email = dto.Email,
                        IsAdmin = dto.IsAdmin
                    });
                }
                return Array.Empty<UserInfo>();
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("Access denied by API: User does not have admin privileges");
                return Array.Empty<UserInfo>();
            }
            else
            {
                _logger.LogError("Failed to fetch users. Status: {StatusCode}", response.StatusCode);
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error content: {ErrorContent}", errorContent);
                return Array.Empty<UserInfo>();
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching users");
            return Array.Empty<UserInfo>();
        }
    }

    public async Task<UserInfo?> GetUserAsync(string id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"api/users/{id}");
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
                return null;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("Access denied by API: User does not have admin privileges");
                return null;
            }
            else
            {
                _logger.LogError("Failed to fetch user {Id}. Status: {StatusCode}", id, response.StatusCode);
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Error content: {ErrorContent}", errorContent);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching user {Id}", id);
            return null;
        }
    }

    public async Task<UserInfo?> CreateUserAsync(CreateUserRequest user)
    {
        try
        {
            var response = await _httpClient.PostAsJsonAsync("api/users", user);
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
                return null;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("Access denied by API: User does not have admin privileges");
                return null;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create user. Status: {StatusCode}, Error: {Error}", response.StatusCode, errorContent);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating user");
            return null;
        }
    }

    public async Task<UserInfo?> UpdateUserAsync(string id, UpdateUserRequest user)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync($"api/users/{id}", user);
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
                return null;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("Access denied by API: User does not have admin privileges");
                return null;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to update user {Id}. Status: {StatusCode}, Error: {Error}", id, response.StatusCode, errorContent);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating user {Id}", id);
            return null;
        }
    }

    public async Task<bool> DeleteUserAsync(string id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"api/users/{id}");
            if (response.IsSuccessStatusCode || response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return true;
            }
            else if (response.StatusCode == System.Net.HttpStatusCode.Forbidden)
            {
                _logger.LogWarning("Access denied by API: User does not have admin privileges");
                return false;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to delete user {Id}. Status: {StatusCode}, Error: {Error}", id, response.StatusCode, errorContent);
                return false;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting user {Id}", id);
            return false;
        }
    }
}