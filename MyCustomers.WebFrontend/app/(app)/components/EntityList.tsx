import { Grid, Stack } from "@mui/material";
import { noCase } from "change-case";
import { titleCase } from "title-case";
import type { PageDto } from "../../lib/types/PageDto";
import EmptyState from "./EmptyState";
import EntityListCard from "./EntityListCard";
import Paginator from "./Paginator";

/**
 * Props for the EntityList component.
 */
export interface EntityListProps<T extends { id: string | number }> {
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
  /** Function to get the name to display for each item. */
  getItemName?: (item: T) => string;
  /** Function to get the fields to display for each item. */
  getItemDetails?: (item: T) => { label: string; value: string }[];
}

/**
 * EntityList component displays a list of entities with pagination and a create button.
 */
export default function EntityList<T extends { id: string | number }>({
  data,
  itemsPerPage,
  page,
  createHref,
  pageHrefTemplate,
  itemHrefTemplate,
  entityName,
  entityNamePlural,
  getItemName,
  getItemDetails,
}: EntityListProps<T>) {
  return (
    <>
      {data.totalCount > 0 ? (
        <>
          <Grid container spacing={3}>
            {data.items.map((item) => {
              return (
                <Grid size={{ xs: 12, md: 6 }} key={item.id}>
                  <EntityListCard
                    title={getItemName ? getItemName(item) : item.id.toString()}
                    href={itemHrefTemplate.replace("{id}", String(item.id))}
                    details={getItemDetails ? getItemDetails(item) : []}
                  />
                </Grid>
              );
            })}
          </Grid>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            sx={{ mt: 4, mb: 2 }}
          >
            <Paginator
              count={Math.ceil(data.totalCount / itemsPerPage)}
              page={page}
              pageHrefTemplate={pageHrefTemplate}
            />
          </Stack>
        </>
      ) : (
        <EmptyState
          title={`No ${noCase(entityNamePlural)} found`}
          description={`You can create a new ${noCase(entityName)} to get started.`}
          buttonText={`Create ${titleCase(entityName)}`}
          buttonHref={createHref}
        />
      )}
    </>
  );
}
