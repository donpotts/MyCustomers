namespace MyCustomers.Application;

/// <summary>
/// Defines a unit of work contract for committing changes to the data store and managing transactions.
/// </summary>
public interface IUnitOfWork
{
    /// <summary>
    /// Persists all changes made in the current unit of work to the data store asynchronously.
    /// </summary>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The number of state entries written to the database.</returns>
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Begins a new database transaction asynchronously.
    /// </summary>
    Task BeginTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Commits the current database transaction asynchronously.
    /// </summary>
    Task CommitTransactionAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Rolls back the current database transaction asynchronously.
    /// </summary>
    Task RollbackTransactionAsync(CancellationToken cancellationToken = default);
}
