"use client";

import MenuIcon from "@mui/icons-material/Menu";
import { Box, Drawer, IconButton, drawerClasses } from "@mui/material";
import { useState } from "react";
import NavList from "./NavList";
import { drawerWidth } from "./Sidebar";

/**
 * Props for the MobileNavMenu component.
 */
export interface MobileNavMenuProps {
  /** Whether the current user is an admin. */
  isAdmin?: boolean;
}

/**
 * MobileNavMenu component provides a responsive navigation menu for mobile devices.
 * It includes a button to toggle the menu and a drawer containing the navigation links.
 */
export default function MobileNavMenu({ isAdmin }: MobileNavMenuProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <IconButton
        color="inherit"
        edge="start"
        sx={{ mr: 2, display: { md: "none" } }}
        onClick={() => setOpen(!open)}
        aria-label="toggle navigation menu"
        aria-controls="mobile-nav-menu"
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        id="mobile-nav-menu"
        aria-label="navigation menu"
        component="nav"
        variant="temporary"
        open={open}
        onClose={() => setOpen(false)}
        sx={{
          display: { xs: "block", md: "none" },
          [`& .${drawerClasses.paper}`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        slotProps={{
          root: {
            keepMounted: true,
          },
        }}
      >
        <Box
          role="presentation"
          onClick={() => setOpen(false)}
          sx={{ width: drawerWidth }}
        >
          <NavList isAdmin={isAdmin} />
        </Box>
      </Drawer>
    </>
  );
}
