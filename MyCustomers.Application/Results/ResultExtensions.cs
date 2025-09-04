using FluentResults;
using MyCustomers.Application.Contracts.Results;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.Application.Results;

/// <summary>
/// Provides extension methods for mapping <see cref="Result"/> errors to application service error results.
/// </summary>
internal static class ResultExtensions
{
    /// <summary>
    /// Maps errors in a <see cref="Result"/> to application service error results.
    /// </summary>
    /// <param name="result">The <see cref="Result"/> containing errors to map.</param>
    /// <returns>
    /// The original <see cref="Result"/> if successful, or a mapped error result for known error types (e.g., <see cref="ConflictError"/>, <see cref="ValidationError"/>).
    /// </returns>
    public static Result MapErrorsToAppServiceResult(this Result result)
    {
        if (result.IsSuccess)
        {
            return result;
        }

        var notFoundError = result.Errors.Where(e => e is ResourceNotFoundError).FirstOrDefault();

        if (notFoundError is not null)
        {
            return Result.Fail(notFoundError);
        }

        var validationErrors = result.Errors.Where(e => e is ValidationError).ToList();

        if (validationErrors.Count > 0)
        {
            return Result.Fail(validationErrors);
        }

        return result;
    }
}
