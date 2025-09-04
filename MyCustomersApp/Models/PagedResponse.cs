namespace MyCustomersApp.Models;

public class PagedResponse<T>
{
    public int TotalCount { get; set; }
    public IEnumerable<T> Items { get; set; } = new List<T>();
}