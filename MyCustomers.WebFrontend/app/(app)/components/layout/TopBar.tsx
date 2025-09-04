"use client";

import { AppBar, Toolbar, Typography } from "@mui/material";
import type { Session } from "next-auth";
import MobileNavMenu from "./MobileNavMenu";
import UserMenu from "./UserMenu";

/**
 * Props for the TopBar component.
 */
export interface TopBarProps {
  /** The current authentication session or null if not authenticated. */
  session: Session | null;
  /** Whether the current user is an admin. */
  isAdmin?: boolean;
}

/**
 * TopBar component renders the top navigation bar for the application.
 */
export default function TopBar({ session, isAdmin }: TopBarProps) {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <MobileNavMenu isAdmin={isAdmin} />
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          My Customers
        </Typography>
        <UserMenu session={session} />
      </Toolbar>
    </AppBar>
  );
}
