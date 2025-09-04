using Microsoft.JSInterop;
using MudBlazor;

namespace MyCustomersApp.Services;

public class ThemeService : IThemeService
{
    private readonly IJSRuntime _jsRuntime;
    private bool _isDarkMode = false;

    public bool IsDarkMode => _isDarkMode;
    public MudTheme CurrentTheme { get; } = new();

    public event Action? OnThemeChanged;

    public ThemeService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
        SetupTheme();
    }

    private void SetupTheme()
    {
        CurrentTheme.PaletteDark = new PaletteDark()
        {
            Primary = "#1976d2",
            Secondary = "#f06292",
            Tertiary = "#1EC8A5",
            AppbarBackground = "#1e1e2e",
            AppbarText = "#e0e0e0",
            DrawerBackground = "#181825",
            DrawerText = "#e0e0e0",
            DrawerIcon = "#e0e0e0"
        };

        CurrentTheme.PaletteLight = new PaletteLight()
        {
            Primary = "#1976d2",
            Secondary = "#f06292",
            Tertiary = "#1EC8A5",
            AppbarBackground = "#1976d2",
            AppbarText = "#ffffff",
            DrawerBackground = "#ffffff",
            DrawerText = "#424242"
        };
    }

    public async Task ToggleThemeAsync()
    {
        _isDarkMode = !_isDarkMode;
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "darkMode", _isDarkMode);
        OnThemeChanged?.Invoke();
    }

    public async Task SetThemeAsync(bool isDark)
    {
        _isDarkMode = isDark;
        await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "darkMode", _isDarkMode);
        OnThemeChanged?.Invoke();
    }

    public async Task InitializeAsync()
    {
        try
        {
            var darkMode = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "darkMode");
            _isDarkMode = bool.TryParse(darkMode, out var isDark) && isDark;
            OnThemeChanged?.Invoke();
        }
        catch
        {
            _isDarkMode = false;
        }
    }
}