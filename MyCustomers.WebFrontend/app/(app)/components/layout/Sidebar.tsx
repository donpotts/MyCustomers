import { Drawer, drawerClasses } from "@mui/material";
import NavList from "./NavList";

/**
 * drawerWidth defines the width of the sidebar navigation drawer.
 */
export const drawerWidth = 240;

/**
 * Props for the Sidebar component.
 */
export interface SidebarProps {
  /** Whether the current user is an admin. */
  isAdmin?: boolean;
}

/**
 * Sidebar component renders a permanent navigation drawer for the application.
 */
export default function Sidebar({ isAdmin }: SidebarProps) {
  return (
    <Drawer
      component="nav"
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .${drawerClasses.paper}`]: {
          width: drawerWidth,
          boxSizing: "border-box",
        },
        display: { xs: "none", md: "block" },
      }}
    >
      <NavList isAdmin={isAdmin} />
    </Drawer>
  );
}
