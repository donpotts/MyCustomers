using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using MyCustomers.Domain.Customers;

namespace MyCustomers.Infrastructure.Persistence.Customers;

/// <summary>
/// Configures the EF Core mapping for the <see cref="Customer"/> domain model, including its value objects and relationships.
/// Sets up key constraints, owned types, property settings, and navigation properties.
/// </summary>
public class CustomerConfiguration : IEntityTypeConfiguration<Customer>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Customer> builder)
    {
        builder.ToTable("Customers");

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id).ValueGeneratedNever();

        builder.Property(p => p.Name).IsRequired();

        builder.Property(p => p.Email).IsRequired();

        builder.Property(p => p.CreatedDate).IsRequired();

        builder.Property(p => p.ModifiedDate).IsRequired();
    }
}
