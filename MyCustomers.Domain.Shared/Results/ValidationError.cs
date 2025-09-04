using FluentResults;

namespace MyCustomers.Domain.Shared.Results;

/// <summary>
/// Represents a validation error for a specific field.
/// </summary>
/// <param name="field">The name of the field that failed validation.</param>
/// <param name="message">The error message describing the validation failure.</param>
public class ValidationError(string field, string message) : Error(message)
{
    /// <summary>
    /// Gets the name of the field that failed validation.
    /// </summary>
    public string Field { get; } = field;
}
