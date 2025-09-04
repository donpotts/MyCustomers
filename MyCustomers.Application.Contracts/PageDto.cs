namespace MyCustomers.Application.Contracts;

/// <summary>
/// Data transfer object representing a page of items with total count metadata.
/// </summary>
/// <typeparam name="T">The type of items in the page.</typeparam>
/// <param name="TotalCount">The total number of items available.</param>
/// <param name="Items">The items in the current page.</param>
public record PageDto<T>(long TotalCount, IReadOnlyList<T> Items);
