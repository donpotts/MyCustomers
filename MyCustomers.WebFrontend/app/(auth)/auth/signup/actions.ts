"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { getServiceEndpoint } from "@/app/lib/service-discovery";
import type { ActionState } from "@/app/lib/types/ActionState";
import type { ApiResult } from "@/app/lib/types/ApiResult";
import type { RegisterRequest } from "@/app/lib/types/RegisterRequest";
import { type RegisterFormDataSchema, schema } from "./schema";

/**
 * Signs up a new user.
 * @param callbackUrl - The URL to redirect to after login.
 * @param _previousState - The previous state of the form.
 * @param formData - The form data submitted by the user.
 * @returns The updated state of the form.
 */
export async function signUp(
  callbackUrl: string | null,
  _previousState: ActionState<RegisterFormDataSchema>,
  formData: FormData,
): Promise<ActionState<RegisterFormDataSchema>> {
  const data = {
    email: formData.get("email") ?? undefined,
    password: formData.get("password") ?? undefined,
    confirmPassword: formData.get("confirmPassword") ?? undefined,
  };
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      data: { email: data.email },
    };
  }

  const registerResult = await register(
    validatedFields.data.email,
    validatedFields.data.password,
  );

  if (!registerResult.success) {
    let errorMessage: string | undefined;

    if (registerResult.error.details) {
      if ("errors" in registerResult.error.details) {
        errorMessage = Object.values(
          registerResult.error.details.errors,
        )[0]?.[0];
      }
    }

    errorMessage ??= "The sign up attempt was unsuccessful.";

    return {
      showSnackbar: true,
      errorMessage,
      data: { email: data.email },
    };
  }

  redirect(
    `/auth/signin${callbackUrl ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`,
  );
}

/**
 * Registers a new user with the provided email and password.
 *
 * Makes an API call to the identity service to create a new user account.
 *
 * @param email - The email address for the new user account. Must be a valid email format.
 * @param password - The password for the new user account. Should meet security requirements.
 * @returns A promise that resolves to an ApiResult indicating success or failure.
 *          On success, returns `{ success: true, data: undefined }`.
 *          On failure, returns `{ success: false, error: { status, details } }` where
 *          status is the HTTP status code and details contain error information.
 */
export async function register(
  email: string,
  password: string,
): Promise<ApiResult<void>> {
  const registerRequest: RegisterRequest = {
    email,
    password,
  };
  const response = await fetch(
    `${getServiceEndpoint("webapi")}/api/identity/register`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(registerRequest),
    },
  );

  if (!response.ok) {
    return {
      success: false,
      error: { status: response.status, details: await response.json() },
    };
  }

  return { success: true, data: undefined };
}
