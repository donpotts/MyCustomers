using FluentResults;
using MyCustomers.Domain.Shared.Results;

namespace MyCustomers.WebApi.Results;

/// <summary>
/// Provides extension methods for mapping <see cref="Result"/> errors to dictionary representations.
/// </summary>
public static class ResultExtensions
{
    /// <summary>
    /// Maps validation errors from a <see cref="Result"/> to a dictionary where the key is the field name and the value is an array of error messages.
    /// </summary>
    /// <param name="result">The <see cref="Result"/> containing errors to map.</param>
    /// <returns>
    /// A <see cref="Dictionary{TKey, TValue}"/> where each key is a field name and each value is an array of error messages for that field.
    /// </returns>
    public static Dictionary<string, string[]> MapValidationErrorsToDictionary(this Result result)
    {
        var errors = result
            .Errors.Where(e => e is ValidationError)
            .Cast<ValidationError>()
            .ToList();
        var dictionary = errors
            .GroupBy(e => e.Field)
            .ToDictionary(e => e.Key, e => e.Select(err => err.Message).ToArray());

        return dictionary;
    }
}
