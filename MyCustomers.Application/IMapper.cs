namespace MyCustomers.Application;

/// <summary>
/// Maps between <typeparamref name="TEntity"/> and <typeparamref name="TEntityDto"/>.
/// </summary>
public interface IMapper<TEntity, TEntityDto>
{
    /// <summary>
    /// Converts <typeparamref name="TEntity"/> to <typeparamref name="TEntityDto"/>.
    /// </summary>
    TEntityDto MapToDto(TEntity entity);
}
