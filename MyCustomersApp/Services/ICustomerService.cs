using MyCustomersApp.Models;

namespace MyCustomersApp.Services;

public interface ICustomerService
{
    Task<PagedResponse<Customer>?> GetCustomersAsync(int skip = 0, int take = 100);
    Task<Customer?> GetCustomerAsync(Guid id);
    Task<Customer?> CreateCustomerAsync(Customer customer);
    Task<Customer?> UpdateCustomerAsync(Customer customer);
    Task<bool> DeleteCustomerAsync(Guid id);
}
