using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyCustomers.Application.Customers;
using MyCustomers.Application.Contracts.Customers;

namespace MyCustomers.Application;

/// <summary>
/// Provides extension methods for configuring application services in the host builder.
/// </summary>
public static class HostingExtensions
{
    /// <summary>
    /// Registers application layer services with the dependency injection container.
    /// </summary>
    /// <param name="builder">The <see cref="IHostApplicationBuilder"/> to add services to.</param>
    /// <returns>The same <see cref="IHostApplicationBuilder"/> instance so that multiple calls can be chained.</returns>
    public static IHostApplicationBuilder AddApplicationServices(
        this IHostApplicationBuilder builder
    )
    {
builder.Services.AddScoped<ICustomerAppService, CustomerAppService>();

        return builder;
    }
}
