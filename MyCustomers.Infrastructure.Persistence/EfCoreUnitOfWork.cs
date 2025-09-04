using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using MyCustomers.Application;

namespace MyCustomers.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core implementation of the unit of work pattern for any DbContext.
/// </summary>
/// <typeparam name="TContext">The type of the DbContext.</typeparam>
public sealed class EfCoreUnitOfWork<TContext>(TContext dbContext)
    : IUnitOfWork,
        IDisposable,
        IAsyncDisposable
    where TContext : DbContext
{
    /// <summary>
    /// The database context used by this unit of work.
    /// </summary>
    private readonly TContext _dbContext = dbContext;

    /// <summary>
    /// The current database transaction managed by this unit of work, or <c>null</c> if no transaction is active.
    /// </summary>
    private IDbContextTransaction? _currentTransaction;

    /// <inheritdoc />
    public Task<int> SaveChangesAsync(CancellationToken cancellationToken = default) =>
        _dbContext.SaveChangesAsync(cancellationToken);

    /// <inheritdoc />
    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction != null)
        {
            return;
        }

        _currentTransaction = await _dbContext.Database.BeginTransactionAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null)
        {
            return;
        }

        await _currentTransaction.CommitAsync(cancellationToken);
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    /// <inheritdoc />
    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        if (_currentTransaction == null)
        {
            return;
        }

        await _currentTransaction.RollbackAsync(cancellationToken);
        await _currentTransaction.DisposeAsync();
        _currentTransaction = null;
    }

    /// <summary>
    /// Disposes the current transaction if it exists (asynchronously).
    /// </summary>
    public async ValueTask DisposeAsync()
    {
        if (_currentTransaction != null)
        {
            await _currentTransaction.DisposeAsync();
            _currentTransaction = null;
        }
    }

    /// <summary>
    /// Disposes the current transaction if it exists (synchronously).
    /// </summary>
    public void Dispose()
    {
        if (_currentTransaction != null)
        {
            _currentTransaction.Dispose();
            _currentTransaction = null;
        }
    }
}
