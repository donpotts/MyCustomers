"use client";

import { Alert, Button, Snackbar, TextField } from "@mui/material";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";
import type { ActionState } from "@/app/lib/types/ActionState";
import type { CustomerFormDataSchema } from "../schema";

/**
 * Props for the CustomerForm component.
 */
export interface CustomerFormProps {
  /** The label for the submit button. */
  submitLabel: string;
  /** The label for the submit button when pending. */
  submitPendingLabel: string;
  /** The action to perform on form submission. */
  action: (
    /** The previous state of the form. */
    previousState: ActionState<CustomerFormDataSchema>,
    /** The form data to submit. */
    formData: FormData,
  ) => Promise<ActionState<CustomerFormDataSchema>>;
  /** The initial state of the form. */
  initialState: ActionState<CustomerFormDataSchema>;
}

/**
 * CustomerForm component for creating and editing customers.
 */
export default function CustomerForm({
  submitLabel,
  submitPendingLabel,
  action,
  initialState,
}: CustomerFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
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
        name="name"
        label="Name"
        required
        fullWidth
        margin="normal"
        defaultValue={state.data?.name ?? ""}
        error={!!state.errors?.name}
        helperText={state.errors?.name?.[0]}
        disabled={pending}
      />
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
        name="number"
        label="Number"
        fullWidth
        margin="normal"
        defaultValue={state.data?.number ?? ""}
        error={!!state.errors?.number}
        helperText={state.errors?.number?.[0]}
        disabled={pending}
      />
      <TextField
        name="notes"
        label="Notes"
        fullWidth
        margin="normal"
        defaultValue={state.data?.notes ?? ""}
        error={!!state.errors?.notes}
        helperText={state.errors?.notes?.[0]}
        disabled={pending}
      />
      <input
        type="hidden"
        name="createdDate"
        value={typeof state.data?.createdDate === 'string' ? state.data.createdDate : new Date().toISOString()}
      />
      <input
        type="hidden"
        name="modifiedDate"
        value={typeof state.data?.modifiedDate === 'string' ? state.data.modifiedDate : new Date().toISOString()}
      />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={pending}
        loadingPosition="start"
        loading={pending}
      >
        {pending ? submitPendingLabel : submitLabel}
      </Button>
    </Form>
  );
}
