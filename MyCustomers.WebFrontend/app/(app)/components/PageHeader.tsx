import { Stack, Typography } from "@mui/material";
import React, { ReactNode } from "react";

/**
 * Props for the PageHeader component.
 */
export interface PageHeaderProps {
  /** The title of the page. */
  title: string;
  /** The actions to display in the header. */
  actions?: ReactNode;
}

/**
 * PageHeader component displays the header for a page, including the title and actions.
 */
export default function PageHeader({ title, actions }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={2}
      sx={{ mb: 2 }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          wordBreak: "break-word",
          overflow: "hidden",
          display: "-webkit-box",
          WebkitLineClamp: 1,
          WebkitBoxOrient: "vertical",
        }}
      >
        {title}
      </Typography>
      {actions && (
        <Stack
          direction="row"
          gap={1}
          sx={{ alignSelf: { xs: "flex-end", sm: "auto" }, flexWrap: "wrap" }}
        >
          {actions}
        </Stack>
      )}
    </Stack>
  );
}
