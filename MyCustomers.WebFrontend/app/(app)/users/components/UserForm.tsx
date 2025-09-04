"use client";

import {
  Alert,
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Form from "next/form";
import { useEffect, useState } from "react";
import type { UserDto } from "@/app/lib/types/UserDto";
import type { ActionState } from "@/app/lib/types/ActionState";

interface UserFormProps {
  /** The user being edited (undefined for create). */
  user?: UserDto;
  /** The form action state. */
  state: ActionState<any>;
  /** The form action handler. */
  action: (formData: FormData) => void;
  /** Whether the form is being submitted. */
  isPending: boolean;
}

/**
 * UserForm component for creating and editing users.
 */
export default function UserForm({
  user,
  state,
  action,
  isPending,
}: UserFormProps) {
  const isEdit = !!user;
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (state.showSnackbar && state.errorMessage) {
      setSnackbarOpen(true);
    }
  }, [state]);

  return (
    <Form action={action}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {isEdit ? "Edit User" : "Create New User"}
        </Typography>

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
          type="email"
          required
          fullWidth
          defaultValue={user?.email || ""}
          disabled={isPending}
          error={!!state.errors?.email}
          helperText={state.errors?.email?.[0]}
        />

        <TextField
          name="password"
          label={isEdit ? "New Password (leave blank to keep current)" : "Password"}
          type="password"
          required={!isEdit}
          fullWidth
          disabled={isPending}
          error={!!state.errors?.password}
          helperText={state.errors?.password?.[0]}
        />

        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="isAdmin"
                defaultChecked={user?.isAdmin || false}
                disabled={isPending}
                value="true"
              />
            }
            label="Administrator"
          />
        </FormGroup>

        <Button
          type="submit"
          variant="contained"
          disabled={isPending}
          size="large"
        >
          {isPending ? "Saving..." : isEdit ? "Update User" : "Create User"}
        </Button>
      </Stack>
    </Form>
  );
}