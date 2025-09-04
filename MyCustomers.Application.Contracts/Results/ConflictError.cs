using FluentResults;

namespace MyCustomers.Application.Contracts.Results;

/// <summary>
/// Represents an error indicating a conflict, such as a duplicate resource or violation of a uniqueness constraint.
/// </summary>
/// <param name="message">The error message describing the conflict.</param>
public class ConflictError(string message) : Error(message) { }
