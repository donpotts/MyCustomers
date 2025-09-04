import { Box, Container, Toolbar } from "@mui/material";

/**
 * Props for the MainContent component.
 */
export interface MainContentProps {
  /** The children to be rendered inside the main content area. */
  children: React.ReactNode;
}

/**
 * MainContent component serves as the main area for displaying content within the application layout.
 */
export default function MainContent({ children }: MainContentProps) {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: { xs: 2, sm: 3 },
      }}
    >
      <Toolbar />
      <Container>{children}</Container>
    </Box>
  );
}
