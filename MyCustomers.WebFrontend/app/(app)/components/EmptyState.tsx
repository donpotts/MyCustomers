import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Button, Container, Typography } from "@mui/material";
import NextLink from "next/link";

/**
 * Props for the EmptyState component.
 */
export interface EmptyStateProps {
  /** The title to display in the empty state. */
  title: string;
  /** The description to display in the empty state. */
  description: string;
  /** The text for the button to create a new entity. */
  buttonText: string;
  /** The URL to navigate to when the button is clicked. */
  buttonHref: string;
}

/**
 * EmptyState component to display when there are no items to show.
 */
export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
}: EmptyStateProps) {
  return (
    <Container maxWidth="sm" disableGutters sx={{ textAlign: "center", my: 2 }}>
      <Typography variant="h3" component="div">
        <AddCircleOutlineIcon color="primary" fontSize="inherit" />
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
        {description}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href={buttonHref}
        startIcon={<AddCircleOutlineIcon />}
        LinkComponent={NextLink}
      >
        {buttonText}
      </Button>
    </Container>
  );
}
