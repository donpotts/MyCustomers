import DatasetIcon from "@mui/icons-material/Dataset";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import { List, Toolbar } from "@mui/material";
import type { JSX } from "react";
import NavListItem from "./NavListItem";

/**
 * NavListPage interface defines the structure for each navigation item.
 */
interface NavListPage {
  /** The display text for the navigation item. */
  text: string;
  /** The URL to navigate to when the item is clicked. */
  href: string;
  /** The icon to display for the navigation item. */
  icon: JSX.Element;
  /** Whether to match all subroutes of the item. */
  matchAll?: boolean;
  /** Whether this item should only be shown to admin users. */
  adminOnly?: boolean;
}

/**
 * Props for the NavList component.
 */
export interface NavListProps {
  /** Whether the current user is an admin. */
  isAdmin?: boolean;
}

const pages: NavListPage[] = [
  {
    text: "Home",
    href: "/",
    icon: <HomeIcon />,
    matchAll: true,
  },
  {
    text: "Customers",
    href: "/customers",
    icon: <DatasetIcon />,
  },
  {
    text: "Users",
    href: "/users",
    icon: <PeopleIcon />,
    adminOnly: true,
  },
];

/**
 * NavList component renders a list of navigation items for the application.
 */
export default function NavList({ isAdmin }: NavListProps) {
  const visiblePages = pages.filter(page => !page.adminOnly || isAdmin);

  return (
    <>
      <Toolbar />
      <List>
        {visiblePages.map((page) => (
          <NavListItem
            key={page.href}
            href={page.href}
            icon={page.icon}
            text={page.text}
            matchAll={page.matchAll}
          />
        ))}
      </List>
    </>
  );
}
