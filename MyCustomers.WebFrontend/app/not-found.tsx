import { Box, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Box textAlign="center" sx={{ my: 4 }}>
      <Typography variant="h1" color="primary" gutterBottom>
        404
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1">
        Sorry, the page you are looking for does not exist or has been moved.
      </Typography>
    </Box>
  );
}
