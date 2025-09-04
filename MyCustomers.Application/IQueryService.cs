using System.Linq.Expressions;
using MyCustomers.Domain;

namespace MyCustomers.Application;

/// <summary>
/// Defines a generic query service interface for query operations on entities with a key, returning DTOs.
/// </summary>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TKey">The type of the entity's key.</typeparam>
/// <typeparam name="TEntityDto">The DTO type.</typeparam>
public interface IQueryService<TEntity, TKey, TEntityDto>
    where TEntity : class, IEntity<TKey>
    where TKey : IEquatable<TKey>, IComparable<TKey>
{
    /// <summary>Gets the total number of entities.</summary>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<long> CountAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets the number of entities matching the specified predicate.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<long> CountAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    );

    /// <summary>Determines whether any entities match the specified predicate.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<bool> ExistsAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    );

    /// <summary>Gets all entities as DTOs.</summary>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntityDto>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets a page of entities as DTOs.</summary>
    /// <param name="skip">The number of entities to skip.</param>
    /// <param name="take">The number of entities to take.</param>
    /// <param name="orderBy">An ordering expression for entities.</param>
    /// <param name="descending">Whether to order descending.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntityDto>> GetPageAsync(
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    );

    /// <summary>Gets a page of entities matching the specified predicate as DTOs.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="skip">The number of entities to skip.</param>
    /// <param name="take">The number of entities to take.</param>
    /// <param name="orderBy">An ordering expression for entities.</param>
    /// <param name="descending">Whether to order descending.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntityDto>> GetPageAsync(
        Expression<Func<TEntity, bool>> predicate,
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    );

    /// <summary>Gets an entity by its identifier as a DTO.</summary>
    /// <param name="id">The identifier of the entity.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The DTO if found; otherwise, null.</returns>
    Task<TEntityDto?> GetByIdAsync(TKey id, CancellationToken cancellationToken = default);

    /// <summary>Finds entities matching the specified predicate and returns them as DTOs.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntityDto>> FindAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    );
}
