import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button } from "@mui/material";
import NextLink from "next/link";
import type { ReactNode } from "react";
import type { PageDto } from "../../lib/types/PageDto";
import EntityList from "./EntityList";
import PageBackButton from "./PageBackButton";
import PageHeader from "./PageHeader";

/**
 * Props for the EntityListPage component.
 */
export interface EntityListPageProps<T extends { id: string | number }> {
  /** The back navigation link. */
  back?: {
    /** The display label for the back link. */
    label: string;
    /** The URL the back link points to. */
    href: string;
  };
  /** The data to display, including items and total count. */
  data: PageDto<T>;
  /** The number of items to display per page. */
  itemsPerPage: number;
  /** The current page number. */
  page: number;
  /** The URL to navigate to for creating a new entity. */
  createHref: string;
  /** Template for the URL of each page. */
  pageHrefTemplate: string;
  /** Template for the URL of each item. */
  itemHrefTemplate: string;
  /** The singular name of the entity. */
  entityName: string;
  /** The plural name of the entity. */
  entityNamePlural: string;
  /** The actions to display in the header. */
  actions?: ReactNode;
  /** Function to get the name to display for each item. */
  getItemName?: (item: T) => string;
  /** Function to get the fields to display for each item. */
  getItemDetails?: (item: T) => { label: string; value: string }[];
}

/**
 * EntityListPage component displays a list of entities with pagination and a header.
 */
export default function EntityListPage<T extends { id: string | number }>({
  back,
  data,
  itemsPerPage,
  page,
  createHref,
  pageHrefTemplate,
  itemHrefTemplate,
  entityName,
  entityNamePlural,
  actions,
  getItemName,
  getItemDetails,
}: EntityListPageProps<T>) {
  return (
    <>
      {back && <PageBackButton label={back.label} href={back.href} />}
      <PageHeader
        title={entityNamePlural}
        actions={
          actions ? (
            actions
          ) : (
            <>
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                href={createHref}
                LinkComponent={NextLink}
              >
                Create
              </Button>
            </>
          )
        }
      />
      <EntityList<T>
        data={data}
        itemsPerPage={itemsPerPage}
        page={page}
        createHref={createHref}
        pageHrefTemplate={pageHrefTemplate}
        itemHrefTemplate={itemHrefTemplate}
        getItemName={getItemName}
        getItemDetails={getItemDetails}
        entityName={entityName}
        entityNamePlural={entityNamePlural}
      />
    </>
  );
}
