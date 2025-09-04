using FluentResults;

namespace MyCustomers.Domain.Shared.Results;

/// <summary>
/// Represents an error indicating that a requested resource was not found.
/// </summary>
/// <param name="message">The error message describing the not found condition.</param>
public class ResourceNotFoundError(string message) : Error(message) { }
