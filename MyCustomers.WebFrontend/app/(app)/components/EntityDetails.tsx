import { Divider, Grid, Paper, Stack, Typography } from "@mui/material";

/**
 * Props for the EntityDetails component.
 */
export interface EntityDetailsProps {
  /** List of entity details to display. */
  details: {
    /** The label of the detail item. */
    label: string;
    /** The value of the detail item. */
    value: string;
  }[];
}

/**
 * EntityDetails component displays the details of an entity.
 */
export default function EntityDetails({ details }: EntityDetailsProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 1 }}
      >
        <Typography
          variant="subtitle2"
          sx={{ textTransform: "uppercase", letterSpacing: 0.5 }}
        >
          Details
        </Typography>
      </Stack>
      <Divider sx={{ mb: 1 }} />
      <Grid container spacing={2}>
        {details.map((item) => (
          <Grid size={{ xs: 12, sm: 6 }} key={item.label}>
            <Typography variant="caption" color="textSecondary">
              {item.label}
            </Typography>
            <Typography variant="body1">{item.value}</Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
}
