namespace MyCustomers.Application.Contracts;

/// <summary>
/// Provides constant values for application service operations.
/// </summary>
public static class AppServiceConstants
{
    /// <summary>
    /// The default number of items to return per page in paginated queries.
    /// </summary>
    public const int DefaultPageSize = 50;

    /// <summary>
    /// The maximum number of items to return per page in paginated queries.
    /// Set to <see cref="int.MaxValue"/> to effectively allow any positive page size.
    /// Use caution: very large page sizes can impact memory, serialization, and network.
    /// </summary>
    public const int MaxPageSize = 100;
}
