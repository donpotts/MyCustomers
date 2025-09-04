import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Button,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { noCase } from "change-case";
import NextLink from "next/link";
import { titleCase } from "title-case";
import { MAX_RELATED_ENTITIES_LIST_ITEMS } from "../../lib/constants";
import EmptyState from "./EmptyState";

/**
 * Props for the RelatedEntitiesList component.
 */
export interface RelatedEntitiesListProps {
  /** The name of the related entity. */
  entityName: string;
  /** The plural name of the related entity. */
  entityNamePlural: string;
  /** The total count of related entities. */
  totalCount: number;
  /** The URL for creating a new related entity. */
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
}

/**
 * RelatedEntitiesList component displays a list of related entities.
 */
export default function RelatedEntitiesList({
  entityName,
  entityNamePlural,
  totalCount,
  createHref,
  itemHrefTemplate,
  listHref,
  listItems,
}: RelatedEntitiesListProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, height: "100%" }}>
      <Stack sx={{ height: "100%" }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          gap={1}
          sx={{ mb: 1 }}
        >
          <Typography
            variant="subtitle2"
            sx={{
              textTransform: "uppercase",
              letterSpacing: 0.5,
              wordBreak: "break-word",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 1,
            }}
          >
            {entityNamePlural}
          </Typography>
          <Button
            size="small"
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            href={createHref}
            LinkComponent={NextLink}
            sx={{ flexShrink: 0 }}
          >
            Create
          </Button>
        </Stack>
        <Divider sx={{ mb: 1 }} />
        {totalCount > 0 ? (
          <>
            <List disablePadding sx={{ flexGrow: 1, mb: 1 }}>
              {listItems
                .slice(0, MAX_RELATED_ENTITIES_LIST_ITEMS)
                .map((item) => (
                  <ListItem key={item.id} disablePadding>
                    <ListItemButton
                      disableGutters
                      href={itemHrefTemplate.replace("{id}", item.id)}
                      LinkComponent={NextLink}
                    >
                      <ListItemText
                        primary={item.label}
                        sx={{
                          wordBreak: "break-word",
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 1,
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
            </List>
            <Button
              size="small"
              variant="outlined"
              fullWidth
              href={listHref}
              LinkComponent={NextLink}
            >
              View All ({totalCount})
            </Button>
          </>
        ) : (
          <Stack justifyContent="center" sx={{ height: "100%" }}>
            <EmptyState
              title={`No ${noCase(entityNamePlural)}`}
              description={`Create a new ${noCase(entityName)} to get started.`}
              buttonText={`Create ${titleCase(entityName)}`}
              buttonHref={createHref}
            />
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}
