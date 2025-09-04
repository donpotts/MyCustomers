"use client";

import { useActionState } from "react";
import { Container } from "@mui/material";
import type { UserDto } from "@/app/lib/types/UserDto";
import PageBackButton from "../../../components/PageBackButton";
import UserForm from "../../components/UserForm";
import { updateUserAction } from "./actions";

interface EditUserClientProps {
  user: UserDto;
  id: string;
}

/**
 * Edit User client component.
 */
export default function EditUserClient({ user, id }: EditUserClientProps) {
  const [state, action, isPending] = useActionState(
    updateUserAction.bind(null, id),
    {},
  );

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <PageBackButton label="User Details" href={`/users/${id}`} />
      <UserForm
        user={user}
        state={state}
        action={action}
        isPending={isPending}
      />
    </Container>
  );
}