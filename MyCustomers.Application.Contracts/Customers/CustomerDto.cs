namespace MyCustomers.Application.Contracts.Customers;

/// <summary>
/// Data transfer object representing a customer.
/// </summary>
/// <param name="Id">The unique identifier of the customer.</param>
/// <param name="Name">The name of the customer.</param>
/// <param name="Email">The email of the customer.</param>
/// <param name="Number">The number of the customer.</param>
/// <param name="Notes">The notes of the customer.</param>
/// <param name="CreatedDate">The created date of the customer.</param>
/// <param name="ModifiedDate">The modified date of the customer.</param>
public record CustomerDto(
    Guid Id,
    string Name,
    string Email,
    string? Number,
    string? Notes,
    DateTime CreatedDate,
    DateTime ModifiedDate
);
