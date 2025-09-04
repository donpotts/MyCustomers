using FluentResults;

namespace MyCustomers.Application.Contracts.Results;

/// <summary>
/// Represents an error indicating that access to a requested resource is denied.
/// </summary>
/// <param name="message">The error message describing the access denial condition.</param>
public class AccessDeniedError(string message) : Error(message) { }
