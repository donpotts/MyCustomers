"use client";

import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import type { JSX } from "react";

/**
 * Props for the NavListItem component.
 */
export interface NavListItemProps {
  /** The URL to navigate to when the item is clicked. */
  href: string;
  /** The icon to display in the list item. */
  icon: JSX.Element;
  /** The text to display in the list item. */
  text: string;
  /** Whether to match the href exactly or just the prefix. */
  matchAll?: boolean;
}

/**
 * NavListItem component renders a navigation list item with an icon and text.
 * It highlights the item if the current path matches the href.
 */
export default function NavListItem({
  href,
  icon,
  text,
  matchAll,
}: NavListItemProps) {
  const pathname = usePathname();
  const lowerPath = pathname.toLowerCase();
  const lowerHref = href.toLowerCase();
  const isActive =
    (matchAll ?? false)
      ? lowerPath === lowerHref
      : lowerPath === lowerHref || lowerPath.startsWith(`${lowerHref}/`);

  return (
    <ListItem disablePadding>
      <ListItemButton
        LinkComponent={NextLink}
        href={href}
        selected={isActive}
        aria-current={isActive ? "page" : undefined}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        <ListItemText primary={text} />
      </ListItemButton>
    </ListItem>
  );
}
