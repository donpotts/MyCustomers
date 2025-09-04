using System.ComponentModel.DataAnnotations;

namespace MyCustomers.Application.Contracts.Customers;

/// <summary>
/// Data transfer object for creating or updating a customer.
/// </summary>
/// <param name="Name">The name of the customer.</param>

/// <param name="Email">The email of the customer.</param>

/// <param name="Number">The number of the customer (optional).</param>

/// <param name="Notes">The notes of the customer (optional).</param>

/// <param name="CreatedDate">The created date of the customer.</param>

/// <param name="ModifiedDate">The modified date of the customer.</param>

public record CreateUpdateCustomerDto(
    [property: Required] string Name,
    [property: Required] string Email,
    string? Number,
    string? Notes,
    [property: Required] DateTime CreatedDate,
    [property: Required] DateTime ModifiedDate
);
