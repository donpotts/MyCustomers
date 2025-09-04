"use client";

import { Alert, Button, Snackbar, TextField } from "@mui/material";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import { signUp } from "../actions";

/**
 * Props for the SignUpForm component.
 */
export interface SignUpFormProps {
  /** The URL to redirect to after a successful registration. */
  callbackUrl: string | null;
}

/**
 * SignUpForm component for registering users.
 */
export default function SignUpForm({ callbackUrl }: SignUpFormProps) {
  const signUpWithCallbackUrl = signUp.bind(null, callbackUrl);
  const [state, formAction, pending] = useActionState(
    signUpWithCallbackUrl,
    {},
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (state.showSnackbar && state.errorMessage) {
      setSnackbarOpen(true);
    }
  }, [state]);

  return (
    <Form action={formAction}>
      {state.errorMessage && !state.showSnackbar && (
        <Alert severity="error">{state.errorMessage}</Alert>
      )}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        autoHideDuration={6000}
        open={snackbarOpen}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert variant="filled" severity="error">
          {state.errorMessage}
        </Alert>
      </Snackbar>
      <TextField
        name="email"
        label="Email"
        required
        fullWidth
        margin="normal"
        defaultValue={state.data?.email ?? ""}
        error={!!state.errors?.email}
        helperText={state.errors?.email?.[0]}
        disabled={pending}
      />
      <TextField
        name="password"
        label="Password"
        type="password"
        required
        fullWidth
        margin="normal"
        defaultValue={state.data?.password ?? ""}
        error={!!state.errors?.password}
        helperText={state.errors?.password?.[0]}
        disabled={pending}
      />
      <TextField
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        required
        fullWidth
        margin="normal"
        defaultValue={state.data?.confirmPassword ?? ""}
        error={!!state.errors?.confirmPassword}
        helperText={state.errors?.confirmPassword?.[0]}
        disabled={pending}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        fullWidth
        sx={{ mt: 2 }}
        disabled={pending}
        loadingPosition="start"
        loading={pending}
      >
        {pending ? "Registering..." : "Register"}
      </Button>
    </Form>
  );
}
