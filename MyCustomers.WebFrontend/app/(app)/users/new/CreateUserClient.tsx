"use client";

import { useActionState } from "react";
import { Container } from "@mui/material";
import PageBackButton from "../../components/PageBackButton";
import UserForm from "../components/UserForm";
import { createUserAction } from "./actions";

/**
 * Create User client component.
 */
export default function CreateUserClient() {
  const [state, action, isPending] = useActionState(createUserAction, {});

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <PageBackButton label="Users" href="/users" />
      <UserForm
        state={state}
        action={action}
        isPending={isPending}
      />
    </Container>
  );
}