using FluentResults;

namespace MyCustomers.Domain.Shared.Results;

/// <summary>
/// Provides extension methods for mapping validation errors on <see cref="Result"/> and <see cref="Result{T}"/>.
/// </summary>
public static class ResultExtensions
{
    /// <summary>
    /// Maps all <see cref="ValidationError"/> errors in the result to use the specified field name.
    /// </summary>
    /// <param name="result">The result to map errors for.</param>
    /// <param name="field">The field name to use in mapped validation errors.</param>
    /// <returns>A new <see cref="Result"/> with mapped validation errors.</returns>
    public static Result MapValidationErrors(this Result result, string field)
    {
        return result.MapErrors(e =>
            e is ValidationError ? new ValidationError(field, e.Message) : e
        );
    }

    /// <summary>
    /// Maps all <see cref="ValidationError"/> errors in the result to use the specified field name.
    /// </summary>
    /// <typeparam name="T">The type of the value contained in the result.</typeparam>
    /// <param name="result">The result to map errors for.</param>
    /// <param name="field">The field name to use in mapped validation errors.</param>
    /// <returns>A new <see cref="Result{T}"/> with mapped validation errors.</returns>
    public static Result<T> MapValidationErrors<T>(this Result<T> result, string field)
    {
        return result.MapErrors(e =>
            e is ValidationError ? new ValidationError(field, e.Message) : e
        );
    }
}
