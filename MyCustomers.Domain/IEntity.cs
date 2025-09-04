namespace MyCustomers.Domain;

/// <summary>
/// Represents a base interface for all entities with an Id.
/// </summary>
public interface IEntity<TKey>
    where TKey : IEquatable<TKey>, IComparable<TKey>
{
    /// <summary>
    /// Gets the unique identifier for the entity.
    /// </summary>
    TKey Id { get; }
}
