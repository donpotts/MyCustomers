namespace MyCustomers.Application;

/// <summary>
/// Provides an interface for generating GUIDs.
/// </summary>
public interface IGuidGenerator
{
    /// <summary>
    /// Creates a new GUID.
    /// </summary>
    /// <returns>A newly generated <see cref="Guid"/>.</returns>
    Guid Create();
}
