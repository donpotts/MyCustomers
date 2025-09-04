using Microsoft.AspNetCore.Identity;
using Microsoft.OpenApi.Models;
using Scalar.AspNetCore;
using MyCustomers.Application;
using MyCustomers.Application.Contracts.Users;
using MyCustomers.Infrastructure;
using MyCustomers.Infrastructure.Persistence;
using MyCustomers.ServiceDefaults;
using MyCustomers.WebApi.Customers;
using MyCustomers.WebApi.Users;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi(options =>
{
    options.AddDocumentTransformer(
        (document, context, cancellationToken) =>
        {
            document.Components ??= new OpenApiComponents();
            document.Components.SecuritySchemes = new Dictionary<string, OpenApiSecurityScheme>
            {
                ["Bearer"] = new OpenApiSecurityScheme
                {
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    In = ParameterLocation.Header,
                    Description = "Access token from login endpoint",
                },
            };

            document.SecurityRequirements =
            [
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                        },
                        Array.Empty<string>()
                    },
                },
            ];

            return Task.CompletedTask;
        }
    );
});

builder.Services.AddProblemDetails();

// Add CORS support for localhost development
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost", policy =>
    {
        policy
            .SetIsOriginAllowed(origin =>
            {
                if (string.IsNullOrEmpty(origin)) return false;
                var uri = new Uri(origin);
                return uri.Host == "localhost" || uri.Host == "127.0.0.1";
            })
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

builder.AddInfrastructureServices("mycustomersdb");
builder.AddApplicationServices();

builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

builder.Services.AddAuthorization();

builder
    .Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddRoles<IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
    app.MapGet("/", () => Results.Redirect("/scalar")).ExcludeFromDescription();
}

app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowLocalhost");

app.UseExceptionHandler();
app.UseStatusCodePages();

app.MapDefaultEndpoints();

app.MapCustomerEndpoints();

app.MapGroup("/api/identity").WithTags("Identity").MapIdentityApi<IdentityUser>();
app.MapUserEndpoints();

app.InitializeDatabase<ApplicationDbContext>();

app.Run();
