using System.Linq.Expressions;

namespace MyCustomers.Domain;

/// <summary>
/// Defines a generic repository interface for CRUD and query operations on entities with a key.
/// </summary>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TKey">The type of the entity's key.</typeparam>
public interface IRepository<TEntity, TKey>
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

    /// <summary>Gets all entities.</summary>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntity>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>Gets a page of entities.</summary>
    /// <param name="skip">The number of entities to skip.</param>
    /// <param name="take">The number of entities to take.</param>
    /// <param name="orderBy">An ordering expression for entities.</param>
    /// <param name="descending">Whether to order descending.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntity>> GetPageAsync(
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    );

    /// <summary>Gets a page of entities matching the specified predicate.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="skip">The number of entities to skip.</param>
    /// <param name="take">The number of entities to take.</param>
    /// <param name="orderBy">An ordering expression for entities.</param>
    /// <param name="descending">Whether to order descending.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntity>> GetPageAsync(
        Expression<Func<TEntity, bool>> predicate,
        int skip,
        int take,
        Expression<Func<TEntity, object>>? orderBy = null,
        bool descending = false,
        CancellationToken cancellationToken = default
    );

    /// <summary>Gets an entity by its identifier.</summary>
    /// <param name="id">The identifier of the entity.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    /// <returns>The entity if found; otherwise, null.</returns>
    Task<TEntity?> GetByIdAsync(TKey id, CancellationToken cancellationToken = default);

    /// <summary>Finds entities matching the specified predicate.</summary>
    /// <param name="predicate">A filter expression to match entities.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task<List<TEntity>> FindAsync(
        Expression<Func<TEntity, bool>> predicate,
        CancellationToken cancellationToken = default
    );

    /// <summary>Adds a new entity.</summary>
    /// <param name="entity">The entity to add.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task AddAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>Adds a range of new entities.</summary>
    /// <param name="entities">The entities to add.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task AddRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    );

    /// <summary>Updates an existing entity.</summary>
    /// <param name="entity">The entity to update.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>Updates a range of existing entities.</summary>
    /// <param name="entities">The entities to update.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task UpdateRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    );

    /// <summary>Deletes an entity.</summary>
    /// <param name="entity">The entity to delete.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task DeleteAsync(TEntity entity, CancellationToken cancellationToken = default);

    /// <summary>Deletes a range of entities.</summary>
    /// <param name="entities">The entities to delete.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task DeleteRangeAsync(
        IEnumerable<TEntity> entities,
        CancellationToken cancellationToken = default
    );

    /// <summary>Deletes entities by their identifiers.</summary>
    /// <param name="ids">The identifiers of the entities to delete.</param>
    /// <param name="cancellationToken">A token to cancel the operation.</param>
    Task DeleteRangeByIdsAsync(
        IEnumerable<TKey> ids,
        CancellationToken cancellationToken = default
    );
}
