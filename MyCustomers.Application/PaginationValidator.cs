using FluentResults;
using MyCustomers.Application.Contracts;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.Application;

/// <summary>
/// Provides methods to validate pagination parameters such as <c>skip</c> and <c>take</c>.
/// Ensures that pagination requests conform to expected value ranges for robust API usage.
/// </summary>
public static class PaginationValidator
{
    /// <summary>
    /// Validates the pagination parameters <paramref name="skip"/> and <paramref name="take"/>.
    /// </summary>
    /// <param name="skip">The number of items to skip. Must be greater than or equal to 0 if provided.</param>
    /// <param name="take">The number of items to take. Must be between 1 and <see cref="AppServiceConstants.MaxPageSize"/> if provided.</param>
    /// <returns>
    /// A <see cref="Result"/> indicating whether the pagination parameters are valid.
    /// If invalid, contains one or more <see cref="ValidationError"/> objects describing the issues.
    /// </returns>
    public static Result Validate(int? skip, int? take)
    {
        var skipResult = Result.FailIf(
            skip is not null && skip < 0,
            new ValidationError(nameof(skip), "Skip cannot be negative.")
        );
        var takeMinimumResult = Result.FailIf(
            take is not null && take < 1,
            new ValidationError(nameof(take), "Take must be at least 1.")
        );
        var takeMaximumResult = Result.FailIf(
            take is not null && take > AppServiceConstants.MaxPageSize,
            new ValidationError(
                nameof(take),
                $"Take cannot exceed {AppServiceConstants.MaxPageSize}."
            )
        );

        return Result.Merge(skipResult, takeMinimumResult, takeMaximumResult);
    }
}
