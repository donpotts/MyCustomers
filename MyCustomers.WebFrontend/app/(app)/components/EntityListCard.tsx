import { Card, CardActionArea, CardContent, Typography } from "@mui/material";
import NextLink from "next/link";

/**
 * Props for the EntityListCard component.
 */
export interface EntityListCardProps {
  /** The title of the card. */
  title: string;
  /** The URL to navigate to when the card is clicked. */
  href: string;
  /** The details to display in the card. */
  details: {
    /** The label for the detail. */
    label: string;
    /** The value to display. */
    value: string;
  }[];
}

/**
 * EntityListCard component displays a card for an entity with a title and details.
 */
export default function EntityListCard({
  title,
  href,
  details,
}: EntityListCardProps) {
  return (
    <Card sx={{ height: "100%" }}>
      <CardActionArea href={href} LinkComponent={NextLink}>
        <CardContent>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          {details.map(({ label, value }) => (
            <Typography key={label} variant="body1" color="textSecondary">
              {label}: {value}
            </Typography>
          ))}
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
