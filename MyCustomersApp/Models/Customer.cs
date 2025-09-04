namespace MyCustomersApp.Models;

public class Customer
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string? Number { get; set; }
    public string? Notes { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime UpdatedDate { get; set; }
    public string? FirstName { get; set; }
    public string? LastName { get; set; }
    
    public string FullName => !string.IsNullOrEmpty(FirstName) && !string.IsNullOrEmpty(LastName) 
        ? $"{FirstName} {LastName}" 
        : Name;
}