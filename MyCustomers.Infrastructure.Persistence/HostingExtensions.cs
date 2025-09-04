using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MyCustomers.Application;
using MyCustomers.Application.Contracts.Customers;
using MyCustomers.Application.Customers;
using MyCustomers.Domain;
using MyCustomers.Domain.Customers;

namespace MyCustomers.Infrastructure.Persistence;

/// <summary>
/// Provides extension methods for configuring persistence services in the host builder.
/// </summary>
public static class HostingExtensions
{
    /// <summary>
    /// Registers persistence layer services, such as DbContext and repositories, with the dependency injection container.
    /// </summary>
    /// <param name="builder">The <see cref="IHostApplicationBuilder"/> to add services to.</param>
    /// <param name="dbConnectionName">The name of the database connection string.</param>
    /// <returns>The same <see cref="IHostApplicationBuilder"/> instance so that multiple calls can be chained.</returns>
    public static IHostApplicationBuilder AddPersistenceServices(
        this IHostApplicationBuilder builder,
        string dbConnectionName
    )
    {
        builder.AddNpgsqlDbContext<ApplicationDbContext>(dbConnectionName);

        builder.Services.AddScoped<IUnitOfWork, EfCoreUnitOfWork<ApplicationDbContext>>();

        builder.Services.AddScoped<
            IRepository<Customer, Guid>,
            EfCoreRepository<ApplicationDbContext, Customer, Guid>
        >();
        builder.Services.AddScoped<
            IQueryService<Customer, Guid, CustomerDto>,
            EfCoreQueryService<ApplicationDbContext, Customer, Guid, CustomerDto>
        >();

        return builder;
    }

    /// <summary>
    /// Ensures the database for the specified <see cref="DbContext"/> is created and applies any pending migrations.
    /// </summary>
    /// <typeparam name="TContext">The type of the <see cref="DbContext"/> to initialize.</typeparam>
    /// <param name="host">The <see cref="IHost"/> instance containing the service provider.</param>
    /// <returns>The same <see cref="IHost"/> instance, allowing for method chaining.</returns>
    public static IHost InitializeDatabase<TContext>(this IHost host)
        where TContext : DbContext
    {
        using var scope = host.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<TContext>();

        if (dbContext.Database.GetMigrations().Any())
        {
            dbContext.Database.Migrate();
        }
        else
        {
            dbContext.Database.EnsureCreated();
        }

        if (!dbContext.Set<IdentityRole>().Any())
        {
            RoleStore<IdentityRole> roleStore = new(dbContext);
            roleStore
                .CreateAsync(
                    new IdentityRole("Admin")
                    {
                        NormalizedName = "ADMIN",
                        ConcurrencyStamp = Guid.NewGuid().ToString(),
                    }
                )
                .GetAwaiter()
                .GetResult();

            dbContext.SaveChanges();
        }

        if (!dbContext.Set<IdentityUser>().Any())
        {
            IdentityUser admin = new()
            {
                UserName = "admin@example.com",
                NormalizedUserName = "ADMIN@EXAMPLE.COM",
                Email = "admin@example.com",
                NormalizedEmail = "ADMIN@EXAMPLE.COM",
                SecurityStamp = Guid.NewGuid().ToString(),
                ConcurrencyStamp = Guid.NewGuid().ToString(),
            };

            PasswordHasher<IdentityUser> passwordHasher = new();
            admin.PasswordHash = passwordHasher.HashPassword(admin, "Admin123!");

            UserStore<IdentityUser> userStore = new(dbContext);
            userStore.CreateAsync(admin).GetAwaiter().GetResult();

            userStore.AddToRoleAsync(admin, "ADMIN").GetAwaiter().GetResult();

            dbContext.SaveChanges();
        }

        return host;
    }
}
