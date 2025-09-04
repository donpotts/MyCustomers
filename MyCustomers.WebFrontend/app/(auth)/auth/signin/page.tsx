import {
  Alert,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import type { Metadata } from "next";
import { getCsrfToken } from "next-auth/react";
import { cookies } from "next/headers";
import NextLink from "next/link";
import CsrfToken from "./components/CsrfToken";

export const metadata: Metadata = {
  title: "Sign In",
};

export default async function SignIn({
  searchParams,
}: PageProps<"/auth/signin">) {
  const { callbackUrl, error } = await searchParams;
  const cookieStore = await cookies();
  const csrfToken = await getCsrfToken({
    req: { headers: { cookie: cookieStore.toString() } },
  });

  return (
    <Container maxWidth="xs" sx={{ my: 4 }}>
      <Typography
        variant="h5"
        component="div"
        sx={{ mb: 2, textAlign: "center" }}
      >
        My Customers
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Sign In
        </Typography>
        <form action="/api/auth/callback/credentials" method="post">
          {!!error && (
            <Alert severity="error">
              The sign in attempt was unsuccessful.
            </Alert>
          )}
          <CsrfToken initialToken={csrfToken} />
          <TextField
            name="email"
            label="Email"
            type="email"
            required
            fullWidth
            margin="normal"
          />
          <TextField
            name="password"
            label="Password"
            type="password"
            required
            fullWidth
            margin="normal"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
        </form>
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Don&apos;t have an account?{" "}
          <Link
            component={NextLink}
            href={`/auth/signup${callbackUrl ? `?callbackUrl=${encodeURIComponent(Array.isArray(callbackUrl) ? callbackUrl[0] : callbackUrl)}` : ""}`}
          >
            Sign Up
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
