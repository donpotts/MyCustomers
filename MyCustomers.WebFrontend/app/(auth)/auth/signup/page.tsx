import { Container, Link, Paper, Typography } from "@mui/material";
import type { Metadata } from "next";
import NextLink from "next/link";
import SignUpForm from "./components/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default async function SignUp({
  searchParams,
}: PageProps<"/auth/signup">) {
  const { callbackUrl } = await searchParams;

  const callbackUrlValue = Array.isArray(callbackUrl)
    ? callbackUrl[0]
    : (callbackUrl ?? null);

  const decodedCallbackUrl = callbackUrlValue
    ? decodeURIComponent(callbackUrlValue)
    : null;

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
          Sign Up
        </Typography>
        <SignUpForm callbackUrl={decodedCallbackUrl} />
        <Typography sx={{ mt: 2, textAlign: "center" }}>
          Already have an account?{" "}
          <Link
            component={NextLink}
            href={`/auth/signin${callbackUrlValue ? `?callbackUrl=${encodeURIComponent(callbackUrlValue)}` : ""}`}
          >
            Sign In
          </Link>
        </Typography>
      </Paper>
    </Container>
  );
}
