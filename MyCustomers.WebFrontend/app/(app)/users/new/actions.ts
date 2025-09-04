"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/app/lib/types/ActionState";
import type { ValidationProblemDetails } from "@/app/lib/types/ValidationProblemDetails";
import { CreateUserSchema, type CreateUserFormData } from "../schema";
import { createUser } from "../lib/service";
import { parseCreateUserFormData } from "../lib/utils";

/**
 * Creates a new user.
 * @param _prevState The previous state.
 * @param formData The form data.
 * @returns The action state.
 */
export async function createUserAction(
  _prevState: ActionState<CreateUserFormData>,
  formData: FormData,
): Promise<ActionState<CreateUserFormData>> {
  const data = parseCreateUserFormData(formData);
  const validation = CreateUserSchema.safeParse(data);

  if (!validation.success) {
    return {
      errors: z.flattenError(validation.error).fieldErrors,
      data: {
        email: data.email,
        password: data.password,
        isAdmin: String(data.isAdmin),
      },
    };
  }

  const result = await createUser({
    email: validation.data.email,
    password: validation.data.password,
    isAdmin: validation.data.isAdmin,
  });

  if (!result.success) {
    let errorMessage = "Failed to create user";
    
    if (result.error.details?.title) {
      errorMessage = result.error.details.title;
    } else if (result.error.details && 'errors' in result.error.details && result.error.details.errors) {
      const errors = Object.values(result.error.details.errors).flat() as string[];
      errorMessage = errors[0] || errorMessage;
    }

    return {
      errorMessage,
      showSnackbar: true,
      data: {
        email: data.email,
        password: data.password,
        isAdmin: String(data.isAdmin),
      },
    };
  }

  revalidatePath("/users");
  redirect("/users");
}