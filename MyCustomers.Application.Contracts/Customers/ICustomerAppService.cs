using FluentResults;

namespace MyCustomers.Application.Contracts.Customers;

/// <summary>
/// Application service contract for managing customers.
/// </summary>
public interface ICustomerAppService
{
    /// <summary>
    /// Gets a customer by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the customer.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The result containing the customer if found; otherwise, an error.</returns>
    Task<Result<CustomerDto>> GetAsync(Guid id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Lists customers with pagination.
    /// </summary>
    /// <param name="skip">The number of customers to skip.</param>
    /// <param name="take">The number of customers to take.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The result containing a page of customers.</returns>
    Task<Result<PageDto<CustomerDto>>> ListAsync(
        int? skip = null,
        int? take = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Creates a new customer.
    /// </summary>
    /// <param name="dto">The data for the new customer.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The result containing the created customer.</returns>
    Task<Result<CustomerDto>> CreateAsync(
        CreateUpdateCustomerDto dto,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Updates an existing customer.
    /// </summary>
    /// <param name="id">The unique identifier of the customer to update.</param>
    /// <param name="dto">The updated customer data.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The result containing the updated customer.</returns>
    Task<Result<CustomerDto>> UpdateAsync(
        Guid id,
        CreateUpdateCustomerDto dto,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes a customer by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the customer to delete.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The result indicating success or failure.</returns>
    Task<Result> DeleteAsync(Guid id, CancellationToken cancellationToken = default);
}
