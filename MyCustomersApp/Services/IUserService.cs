using MyCustomersApp.Models;

namespace MyCustomersApp.Services;

public interface IUserService
{
    Task<IEnumerable<UserInfo>> GetUsersAsync();
    Task<UserInfo?> GetUserAsync(string id);
    Task<UserInfo?> CreateUserAsync(CreateUserRequest user);
    Task<UserInfo?> UpdateUserAsync(string id, UpdateUserRequest user);
    Task<bool> DeleteUserAsync(string id);
}