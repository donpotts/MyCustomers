using FluentResults;

namespace MyCustomers.Domain.Customers;

/// <summary>
/// Represents a customer.
/// </summary>
public class Customer : IEntity<Guid>
{
    /// <inheritdoc />
    public Guid Id { get; private set; }

    /// <summary>
    /// Gets the name of the customer.
    /// </summary>
    public string Name { get; private set; }

    /// <summary>
    /// Gets the email of the customer.
    /// </summary>
    public string Email { get; private set; }

    /// <summary>
    /// Gets the number of the customer.
    /// </summary>
    public string? Number { get; private set; }

    /// <summary>
    /// Gets the notes of the customer.
    /// </summary>
    public string? Notes { get; private set; }

    /// <summary>
    /// Gets the created date of the customer.
    /// </summary>
    public DateTime CreatedDate { get; private set; }

    /// <summary>
    /// Gets the modified date of the customer.
    /// </summary>
    public DateTime ModifiedDate { get; private set; }

    /// <summary>
    /// Required by EF Core and serialization. Do not use directly.
    /// </summary>
    private Customer()
    {
        Name = null!;
        Email = null!;
    }

    /// <summary>
    /// Initializes a new instance of <see cref="Customer"/> with the specified values.
    /// <para>This constructor does not perform validation; it expects values that have already been validated.</para>
    /// </summary>
    /// <param name="id">The unique identifier of the customer.</param>
    /// <param name="name">The validated name of the customer.</param>
    /// <param name="email">The validated email of the customer.</param>
    /// <param name="number">The validated number of the customer.</param>
    /// <param name="notes">The validated notes of the customer.</param>
    /// <param name="createdDate">The validated created date of the customer.</param>
    /// <param name="modifiedDate">The validated modified date of the customer.</param>
    private Customer(
        Guid id,
        string name,
        string email,
        string? number,
        string? notes,
        DateTime createdDate,
        DateTime modifiedDate
    )
    {
        Id = id;
        Name = name;
        Email = email;
        Number = number;
        Notes = notes;
        CreatedDate = createdDate;
        ModifiedDate = modifiedDate;
    }

    /// <summary>
    /// Creates a new <see cref="Customer"/> instance if the provided values are valid.
    /// </summary>
    /// <param name="id">The unique identifier of the customer.</param>
    /// <param name="name">The validated name of the customer.</param>
    /// <param name="email">The validated email of the customer.</param>
    /// <param name="number">The validated number of the customer.</param>
    /// <param name="notes">The validated notes of the customer.</param>
    /// <param name="createdDate">The validated created date of the customer.</param>
    /// <param name="modifiedDate">The validated modified date of the customer.</param>
    public static Result<Customer> Create(
        Guid id,
        string name,
        string email,
        string? number,
        string? notes,
        DateTime createdDate,
        DateTime modifiedDate
    )
    {
        var customer = new Customer(
            id,
            name,
            email,
            number,
            notes,
            createdDate,
            modifiedDate
        );
        return Result.Ok(customer);
    }

    /// <summary>
    /// Updates the name of the customer.
    /// </summary>
    /// <param name="name">The new name value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateName(string name)
    {
        Name = name;
        return Result.Ok();
    }

    /// <summary>
    /// Updates the email of the customer.
    /// </summary>
    /// <param name="email">The new email value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateEmail(string email)
    {
        Email = email;
        return Result.Ok();
    }

    /// <summary>
    /// Updates the number of the customer.
    /// </summary>
    /// <param name="number">The new number value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateNumber(string? number)
    {
        Number = number;
        return Result.Ok();
    }

    /// <summary>
    /// Updates the notes of the customer.
    /// </summary>
    /// <param name="notes">The new notes value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateNotes(string? notes)
    {
        Notes = notes;
        return Result.Ok();
    }

    /// <summary>
    /// Updates the created date of the customer.
    /// </summary>
    /// <param name="createdDate">The new created date value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateCreatedDate(DateTime createdDate)
    {
        CreatedDate = createdDate;
        return Result.Ok();
    }

    /// <summary>
    /// Updates the modified date of the customer.
    /// </summary>
    /// <param name="modifiedDate">The new modified date value.</param>
    /// <returns>A <see cref="Result"/> indicating success.</returns>
    public Result UpdateModifiedDate(DateTime modifiedDate)
    {
        ModifiedDate = modifiedDate;
        return Result.Ok();
    }
}
