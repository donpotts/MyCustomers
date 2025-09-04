using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyCustomers.Application;
using MyCustomers.Application.Contracts.Customers;
using MyCustomers.Application.Contracts.Users;
using MyCustomers.Application.Customers;
using MyCustomers.Domain.Customers;
using MyCustomers.Infrastructure.Persistence;
using MyCustomers.Infrastructure.Customers;
using MyCustomers.Infrastructure.Users;

namespace MyCustomers.Infrastructure;

/// <summary>
/// Provides extension methods for configuring infrastructure services in the host builder.
/// </summary>
public static class HostingExtensions
{
    /// <summary>
    /// Registers infrastructure layer services with the dependency injection container.
    /// </summary>
    /// <param name="builder">The <see cref="IHostApplicationBuilder"/> to add services to.</param>
    /// <param name="dbConnectionName">The name of the database connection string.</param>
    /// <returns>The same <see cref="IHostApplicationBuilder"/> instance so that multiple calls can be chained.</returns>
    public static IHostApplicationBuilder AddInfrastructureServices(
        this IHostApplicationBuilder builder,
        string dbConnectionName
    )
    {
        builder.AddPersistenceServices(dbConnectionName);

        builder.Services.AddScoped<IUnitOfWork, EfCoreUnitOfWork<ApplicationDbContext>>();
        builder.Services.AddSingleton<IGuidGenerator, SequentialGuidGenerator>();

        var customerMapper = new CustomerMapper();
        builder.Services.AddSingleton<IMapper<Customer, CustomerDto>>(customerMapper);
        builder.Services.AddSingleton<IQueryableMapper<Customer, CustomerDto>>(customerMapper);

        builder.Services.AddSingleton<IMapper<IdentityUser, UserDto>, UserMapper>();
        builder.Services.AddScoped<IUserAccountService, UserAccountService>();

        return builder;
    }
}
