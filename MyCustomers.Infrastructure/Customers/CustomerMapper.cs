using Riok.Mapperly.Abstractions;
using MyCustomers.Application;
using MyCustomers.Application.Contracts.Customers;
using MyCustomers.Domain.Customers;
using MyCustomers.Infrastructure.Persistence;

namespace MyCustomers.Infrastructure.Customers;

/// <summary>
/// Mapperly implementation for mapping between Customer and CustomerDto.
/// </summary>
[Mapper]
public partial class CustomerMapper
    : IMapper<Customer, CustomerDto>,
        IQueryableMapper<Customer, CustomerDto>
{
    /// <inheritdoc />
    public partial CustomerDto MapToDto(Customer customer);

    /// <inheritdoc />
    public partial IQueryable<CustomerDto> ProjectToDto(IQueryable<Customer> queryable);
}
