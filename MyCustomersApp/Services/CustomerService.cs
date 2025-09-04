using System.Net.Http.Json;
using MyCustomersApp.Models;

namespace MyCustomersApp.Services;

public class CustomerService : ICustomerService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<CustomerService> _logger;

    public CustomerService(IHttpClientFactory httpClientFactory, ILogger<CustomerService> logger)
    {
        _httpClient = httpClientFactory.CreateClient("ApiClient");
        _logger = logger;
    }

    public async Task<PagedResponse<Customer>?> GetCustomersAsync(int skip = 0, int take = 100)
    {
        try
        {
            // Request a page from the API using the provided skip/take values.
            var response = await _httpClient.GetAsync($"api/customers?skip={skip}&take={take}");
            if (response.IsSuccessStatusCode)
            {
                var pagedResponse = await response.Content.ReadFromJsonAsync<PagedResponse<Customer>>();
                return pagedResponse;
            }
            else
            {
                _logger.LogError("Failed to fetch customers. Status: {StatusCode}, Reason: {ReasonPhrase}",
                    response.StatusCode, response.ReasonPhrase);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customers");
            return null;
        }
    }

    public async Task<Customer?> GetCustomerAsync(Guid id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"api/customers/{id}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Customer>();
            }
            else
            {
                _logger.LogError("Failed to fetch customer {Id}. Status: {StatusCode}", id, response.StatusCode);
                return null;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching customer {Id}", id);
            return null;
        }
    }

    public async Task<Customer?> CreateCustomerAsync(Customer customer)
    {
        try
        {
            _logger.LogInformation("Creating customer: Name={Name}, Email={Email}, Id={Id}", 
                customer.Name, customer.Email, customer.Id);
            
            var response = await _httpClient.PostAsJsonAsync("api/customers", customer);
            if (response.IsSuccessStatusCode)
            {
                var result = await response.Content.ReadFromJsonAsync<Customer>();
                _logger.LogInformation("Customer created successfully: {CustomerId}", result?.Id);
                return result;
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to create customer. Status: {StatusCode}, Error: {Error}", response.StatusCode, errorContent);
                
                // Try to parse the error for more specific feedback
                if (response.StatusCode == System.Net.HttpStatusCode.BadRequest)
                {
                    _logger.LogWarning("Bad request - check customer data validation");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    _logger.LogWarning("Unauthorized - check authentication token");
                }
                else if (response.StatusCode == System.Net.HttpStatusCode.InternalServerError)
                {
                    _logger.LogError("Server error - check API server logs");
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Exception creating customer: {Name}", customer.Name);
        }
        return null;
    }

    public async Task<Customer?> UpdateCustomerAsync(Customer customer)
    {
        try
        {
            var response = await _httpClient.PutAsJsonAsync($"api/customers/{customer.Id}", customer);
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<Customer>();
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to update customer {Id}. Status: {StatusCode}, Error: {Error}", customer.Id, response.StatusCode, errorContent);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating customer {Id}", customer.Id);
        }
        return null;
    }

    public async Task<bool> DeleteCustomerAsync(Guid id)
    {
        try
        {
            var response = await _httpClient.DeleteAsync($"api/customers/{id}");
            if (!response.IsSuccessStatusCode)
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                _logger.LogError("Failed to delete customer {Id}. Status: {StatusCode}, Error: {Error}", id, response.StatusCode, errorContent);
            }
            return response.IsSuccessStatusCode;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting customer {Id}", id);
            return false;
        }
    }
}