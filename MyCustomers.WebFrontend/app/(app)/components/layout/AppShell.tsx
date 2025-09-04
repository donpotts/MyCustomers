import { Box } from "@mui/material";
import { auth } from "@/auth";
import { getServiceEndpoint } from "@/app/lib/service-discovery";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

/**
 * Props for the AppShell component.
 */
export interface AppShellProps {
  /** The children elements to be rendered inside the AppShell. */
  children: React.ReactNode;
}

/**
 * AppShell component provides the main layout structure for the application,
 * including the top bar, sidebar, and main content areas.
 */
export default async function AppShell({ children }: AppShellProps) {
  const session = await auth();
  let isAdmin = false;

  // Get current user info to check admin status
  if (session?.accessToken) {
    try {
      const currentUserResponse = await fetch(`${getServiceEndpoint("webapi")}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
        cache: "no-store",
      });

      if (currentUserResponse.ok) {
        const currentUser = await currentUserResponse.json();
        isAdmin = currentUser.isAdmin;
      }
    } catch (error) {
      console.error("Failed to fetch user info:", error);
    }
  }

  return (
    <Box sx={{ display: "flex" }}>
      <TopBar session={session} isAdmin={isAdmin} />
      <Sidebar isAdmin={isAdmin} />
      <MainContent>{children}</MainContent>
    </Box>
  );
}
