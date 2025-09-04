using MudBlazor;

namespace MyCustomersApp.Services;

public interface IThemeService
{
    bool IsDarkMode { get; }
    MudTheme CurrentTheme { get; }
    Task ToggleThemeAsync();
    Task SetThemeAsync(bool isDark);
    Task InitializeAsync();
    event Action OnThemeChanged;
}