namespace MyCustomers.Infrastructure.Persistence;

/// <summary>
/// Projects a queryable of <typeparamref name="TEntity"/> to a queryable of <typeparamref name="TEntityDto"/>.
/// </summary>
/// <typeparam name="TEntity">The entity type.</typeparam>
/// <typeparam name="TEntityDto">The DTO type.</typeparam>
public interface IQueryableMapper<TEntity, TEntityDto>
{
    /// <summary>
    /// Projects a queryable of <typeparamref name="TEntity"/> to <typeparamref name="TEntityDto"/>.
    /// </summary>
    IQueryable<TEntityDto> ProjectToDto(IQueryable<TEntity> queryable);
}
