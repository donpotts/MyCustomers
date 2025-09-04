"use client";

import LogoutIcon from "@mui/icons-material/Logout";
import {
  Avatar,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { useState } from "react";

/**
 * Props for the UserMenu component.
 */
export interface UserMenuProps {
  /** The current authentication session or null if not authenticated. */
  session: Session | null;
}

/**
 * UserMenu component that displays a user avatar and dropdown menu.
 * Shows the user's initial in an avatar and provides logout functionality.
 */
export default function UserMenu({ session }: UserMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Tooltip title={session?.user?.email}>
        <IconButton
          onClick={handleClick}
          edge="end"
          aria-label="user menu"
          aria-controls="user-menu"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <Avatar
            sx={{
              color: (theme) => theme.palette.secondary.contrastText,
              bgcolor: (theme) => theme.palette.secondary.main,
            }}
          >
            {session?.user?.email?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>
      </Tooltip>
      <Menu
        id="user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
      >
        <MenuItem onClick={() => signOut()}>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
}
