using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using MyCustomers.Domain;

namespace MyCustomers.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core implementation of the generic repository pattern for any DbContext.
/// </summary>
/// <typeparam name="TContext">The type of the DbContext.</typeparam>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TKey">The type of the entity's key.</typeparam>
public class EfCoreRepository<TContext, TEntity, TKey>(TContext dbContext)
    : IRepository<TEntity, TKey>
    where TContext : DbContext
    where TEntity : class, IEntity<TKey>
    where TKey : IEquatable<TKey>, IComparable<TKey>
{
    /// <summary>
    /// Gets the DbSet for the entity type.
    /// </summary>
    protected DbSet<TEntity> DbSet { get; } = dbContext.Set<TEntity>();

    /// <inheritdoc />
    public async Task<long> CountAsync(CancellationToken cancellationToken = default) =>
        await DbSet.LongCountAsync(cancellationToken);

    /// <inheritdoc />
    public async Task<long> CountAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) => await DbSet.LongCountAsync(predicate, cancellationToken);

    /// <inheritdoc />
    public async Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) => await DbSet.AnyAsync(predicate, cancellationToken);

    /// <inheritdoc />
    public async Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default) =>
        await DbSet.ToListAsync(cancellationToken);

    /// <inheritdoc />
    public async Task<List<TEntity>> GetPageAsync(
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    )
    {
        orderBy ??= e => e.Id;

        var orderedQuery = descending
            ? DbSet.AsNoTracking().OrderByDescending(orderBy)
            : DbSet.AsNoTracking().OrderBy(orderBy);

        return await orderedQuery.Skip(skip).Take(take).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<List<TEntity>> GetPageAsync(
        Expression<Func<TEntity, bool>> predicate,
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    )
    {
        orderBy ??= e => e.Id;

        var filteredQuery = DbSet.AsNoTracking().Where(predicate);
        var orderedQuery = descending
            ? filteredQuery.OrderByDescending(orderBy)
            : filteredQuery.OrderBy(orderBy);

        return await orderedQuery.Skip(skip).Take(take).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken = default)
    {
        if (id == null)
        {
            return null;
        }

        return await DbSet.FindAsync([id], cancellationToken);
    }

    /// <inheritdoc />
    public async Task<List<TEntity>> FindAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) => await DbSet.Where(predicate).ToListAsync(cancellationToken);

    /// <inheritdoc />
    public async Task AddAsync(TEntity entity, CancellationToken cancellationToken = default) =>
        await DbSet.AddAsync(entity, cancellationToken);

    /// <inheritdoc />
    public async Task AddRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    ) => await DbSet.AddRangeAsync(entities, cancellationToken);

    /// <inheritdoc />
    public Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        if (DbSet.Entry(entity).State == EntityState.Detached)
        {
            DbSet.Update(entity);
        }

        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task UpdateRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    )
    {
        var detachedEntities = entities.Where(e => DbSet.Entry(e).State == EntityState.Detached);

        DbSet.UpdateRange(detachedEntities);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task DeleteAsync(TEntity entity, CancellationToken cancellationToken = default)
    {
        DbSet.Remove(entity);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public Task DeleteRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    )
    {
        DbSet.RemoveRange(entities);
        return Task.CompletedTask;
    }

    /// <inheritdoc />
    public async Task DeleteRangeByIdsAsync(
        IEnumerable<TKey> ids,
        CancellationToken cancellationToken = default
    )
    {
        var entities = await FindAsync(e => ids.Contains(e.Id), cancellationToken);
        await DeleteRangeAsync(entities, cancellationToken);
    }
}
