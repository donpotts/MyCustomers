using MyCustomers.Application;

namespace MyCustomers.Infrastructure;

/// <summary>
/// Generates sequential GUIDs using version 7 GUIDs.
/// </summary>
public class SequentialGuidGenerator : IGuidGenerator
{
    /// <inheritdoc />
    public Guid Create()
    {
        return Guid.CreateVersion7();
    }
}
