import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import theme from "./theme";

/**
 * Props for the MuiProvider component.
 */
export interface MuiProviderProps {
  /** The children components to be wrapped by the MuiProvider. */
  children: React.ReactNode;
}

/**
 * MuiProvider component wraps the application with MUI's ThemeProvider and CssBaseline.
 */
export default function MuiProvider({ children }: MuiProviderProps) {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
}
