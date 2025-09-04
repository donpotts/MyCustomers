import SecurityIcon from "@mui/icons-material/Security";
import StorageIcon from "@mui/icons-material/Storage";
import { Box, Grid, Paper, Typography } from "@mui/material";

export default function Home() {
  return (
    <>
      <Box sx={{ mt: 4, mb: 6, textAlign: "center" }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to My Customers
        </Typography>
        <Typography variant="h5" color="textSecondary" component="div">
          Effortlessly manage your data—either through this interface or
          programmatically using the REST API.
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 2 }}>
          Get started by choosing an option from the menu.
        </Typography>
      </Box>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        Key Features
      </Typography>
      <Grid container spacing={2} sx={{ justifyContent: "center" }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <StorageIcon />
              Easy Data Management
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Create, read, update, and delete records with a simple interface
              or directly via the REST API.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Typography
              variant="h6"
              sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
            >
              <SecurityIcon />
              Reliable & Secure
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Built with modern best practices to help keep your data safe and
              accessible, no matter how you connect.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
