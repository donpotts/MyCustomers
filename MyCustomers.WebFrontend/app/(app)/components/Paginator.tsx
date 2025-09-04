"use client";

import { Pagination, PaginationItem } from "@mui/material";
import NextLink from "next/link";

/**
 * Props for the Paginator component.
 */
export interface PaginatorProps {
  /** The total number of items to paginate. */
  count: number;
  /** The current page number. */
  page?: number;
  /** Template for the URL of each page. */
  pageHrefTemplate: string;
}

/**
 * Paginator component displays pagination controls.
 */
export default function Paginator({
  count,
  page,
  pageHrefTemplate,
}: PaginatorProps) {
  return (
    <Pagination
      color="primary"
      count={count}
      page={page}
      showFirstButton
      showLastButton
      renderItem={(item) => (
        <PaginationItem
          component={NextLink}
          href={
            item.page
              ? pageHrefTemplate.replace("{page}", item.page.toString())
              : "#"
          }
          {...item}
        />
      )}
    />
  );
}
