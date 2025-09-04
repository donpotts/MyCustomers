using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using MyCustomers.Application;
using MyCustomers.Domain;

namespace MyCustomers.Infrastructure.Persistence;

/// <summary>
/// Entity Framework Core implementation of the generic query service pattern for any DbContext.
/// </summary>
/// <typeparam name="TContext">The type of the DbContext.</typeparam>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TKey">The type of the entity's key.</typeparam>
/// <typeparam name="TEntityDto">The DTO type.</typeparam>
public class EfCoreQueryService<TContext, TEntity, TKey, TEntityDto>(
    TContext dbContext,
    IQueryableMapper<TEntity, TEntityDto> queryableMapper
) : IQueryService<TEntity, TKey, TEntityDto>
    where TContext : DbContext
    where TEntity : class, IEntity<TKey>
    where TKey : IEquatable<TKey>, IComparable<TKey>
{
    /// <summary>
    /// Gets the DbSet for the entity type.
    /// </summary>
    protected DbSet<TEntity> DbSet { get; } = dbContext.Set<TEntity>();

    /// <summary>
    /// Gets the mapper to project entities to DTOs.
    /// </summary>
    protected IQueryableMapper<TEntity, TEntityDto> QueryableMapper { get; } = queryableMapper;

    /// <inheritdoc />
    public async Task<long> CountAsync(CancellationToken cancellationToken = default) =>
        await DbSet.AsNoTracking().LongCountAsync(cancellationToken);

    /// <inheritdoc />
    public async Task<long> CountAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) => await DbSet.AsNoTracking().LongCountAsync(predicate, cancellationToken);

    /// <inheritdoc />
    public async Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) => await DbSet.AsNoTracking().AnyAsync(predicate, cancellationToken);

    /// <inheritdoc />
    public async Task<List<TEntityDto>> GetAllAsync(
        CancellationToken cancellationToken = default
    ) => await QueryableMapper.ProjectToDto(DbSet.AsNoTracking()).ToListAsync(cancellationToken);

    /// <inheritdoc />
    public async Task<List<TEntityDto>> GetPageAsync(
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

        return await QueryableMapper
            .ProjectToDto(orderedQuery.Skip(skip).Take(take))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<List<TEntityDto>> GetPageAsync(
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

        return await QueryableMapper
            .ProjectToDto(orderedQuery.Skip(skip).Take(take))
            .ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<TEntityDto?> GetByIdAsync(
        TKey id,
        CancellationToken cancellationToken = default
    )
    {
        if (id == null)
        {
            return default;
        }

        return await QueryableMapper
            .ProjectToDto(DbSet.AsNoTracking().Where(e => e.Id.Equals(id)))
            .FirstOrDefaultAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<List<TEntityDto>> FindAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    ) =>
        await QueryableMapper
            .ProjectToDto(DbSet.AsNoTracking().Where(predicate))
            .ToListAsync(cancellationToken);
}

/// <summary>
/// Entity Framework Core implementation of the generic query service pattern for any DbContext, allowing a custom mapper type.
/// </summary>
/// <typeparam name="TContext">The type of the DbContext.</typeparam>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TKey">The type of the entity's key.</typeparam>
/// <typeparam name="TEntityDto">The DTO type.</typeparam>
/// <typeparam name="TQueryableMapper">The type of the queryable mapper.</typeparam>
public class EfCoreQueryService<TContext, TEntity, TKey, TEntityDto, TQueryableMapper>(
    TContext dbContext,
    TQueryableMapper queryableMapper
) : EfCoreQueryService<TContext, TEntity, TKey, TEntityDto>(dbContext, queryableMapper)
    where TContext : DbContext
    where TEntity : class, IEntity<TKey>
    where TKey : IEquatable<TKey>, IComparable<TKey>
    where TQueryableMapper : IQueryableMapper<TEntity, TEntityDto>
{
    protected new TQueryableMapper QueryableMapper { get; } = queryableMapper;
}
