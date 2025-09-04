import EditIcon from "@mui/icons-material/Edit";
import { Button, Grid, Stack } from "@mui/material";
import NextLink from "next/link";
import DeleteButton from "./DeleteButton";
import EntityDetails from "./EntityDetails";
import PageBackButton from "./PageBackButton";
import PageHeader from "./PageHeader";
import RelatedEntitiesList from "./RelatedEntitiesList";

/**
 * Props for the EntityPage component.
 */
export interface EntityPageProps {
  /** The back navigation link. */
  back?: {
    /** The display label for the back link. */
    label: string;
    /** The URL the back link points to. */
    href: string;
  };
  /** The title of the entity page. */
  title: string;
  /** Additional actions to display in the page header. */
  additionalActions?: React.ReactNode;
  /** The URL for editing the entity. */
  editHref: string;
  /** The action to delete the entity. */
  deleteAction: () => Promise<void>;
  /** The details of the entity. */
  details: {
    /** The display label for the detail. */
    label: string;
    /** The value of the detail. */
    value: string;
  }[];
  /** The related entities for the entity. */
  relatedEntities?: {
    /** The name of the related entity. */
    entityName: string;
    /** The plural name of the related entity. */
    entityNamePlural: string;
    /** The total count of related entities. */
    totalCount: number;
    /** The URL to create a new related entity. */
    createHref: string;
    /** The URL template for the related entity item containing `{id}`. */
    itemHrefTemplate: string;
    /** The URL for the list of related entities. */
    listHref: string;
    /** The list of related entities. */
    listItems: {
      /** The unique identifier of the related entity. */
      id: string;
      /** The label of the related entity. */
      label: string;
    }[];
  }[];
}

/**
 * EntityDetailView component displays the details of a specific entity.
 */
export default function EntityPage({
  back,
  title,
  additionalActions,
  editHref,
  deleteAction,
  details,
  relatedEntities,
}: EntityPageProps) {
  return (
    <>
      {back && <PageBackButton label={back.label} href={back.href} />}
      <PageHeader
        title={title}
        actions={
          <>
            <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
              {additionalActions}
            </Stack>
            <Stack direction="row" gap={1} sx={{ flexWrap: "wrap" }}>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                href={editHref}
                LinkComponent={NextLink}
              >
                Edit
              </Button>
              <DeleteButton deleteAction={deleteAction} />
            </Stack>
          </>
        }
      />
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <EntityDetails details={details} />
        </Grid>
        {relatedEntities &&
          relatedEntities.map((relatedEntity) => (
            <Grid size={{ xs: 12, md: 6 }} key={relatedEntity.entityName}>
              <RelatedEntitiesList
                entityName={relatedEntity.entityName}
                entityNamePlural={relatedEntity.entityNamePlural}
                totalCount={relatedEntity.totalCount}
                createHref={relatedEntity.createHref}
                itemHrefTemplate={relatedEntity.itemHrefTemplate}
                listHref={relatedEntity.listHref}
                listItems={relatedEntity.listItems}
              />
            </Grid>
          ))}
      </Grid>
    </>
  );
}
