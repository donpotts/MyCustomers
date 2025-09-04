"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import type { ActionState } from "@/app/lib/types/ActionState";
import type { ValidationProblemDetails } from "@/app/lib/types/ValidationProblemDetails";
import { UpdateUserSchema, type UpdateUserFormData } from "../../schema";
import { updateUser } from "../../lib/service";
import { parseUpdateUserFormData } from "../../lib/utils";

/**
 * Updates a user.
 * @param id The ID of the user to update.
 * @param _prevState The previous state.
 * @param formData The form data.
 * @returns The action state.
 */
export async function updateUserAction(
  id: string,
  _prevState: ActionState<UpdateUserFormData>,
  formData: FormData,
): Promise<ActionState<UpdateUserFormData>> {
  const data = parseUpdateUserFormData(formData);
  const validation = UpdateUserSchema.safeParse(data);

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

  const updateData: any = {
    newEmail: validation.data.email,
    isAdmin: validation.data.isAdmin,
  };

  if (validation.data.password) {
    updateData.newPassword = validation.data.password;
  }

  const result = await updateUser(id, updateData);

  if (!result.success) {
    let errorMessage = "Failed to update user";
    
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

  revalidatePath(`/users/${id}`);
  revalidatePath("/users");
  redirect(`/users/${id}`);
}