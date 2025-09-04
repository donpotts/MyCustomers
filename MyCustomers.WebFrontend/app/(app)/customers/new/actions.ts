"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createCustomer as createCustomerApi } from "@/app/(app)/customers/lib/service";
import { parseFormData } from "@/app/(app)/customers/lib/utils";
import type { ActionState } from "@/app/lib/types/ActionState";
import {
  handleApiActionError,
  handleUnknownActionError,
} from "@/app/lib/utils";
import { type CustomerFormDataSchema, schema } from "../schema";

/**
 * Creates a new customer.
 * @param _previousState - The previous state of the form.
 * @param formData - The form data submitted by the user.
 * @returns The updated state of the form.
 */
export async function createCustomer(
  _previousState: ActionState<CustomerFormDataSchema>,
  formData: FormData,
): Promise<ActionState<CustomerFormDataSchema>> {
  const data = parseFormData(formData);
  const validatedFields = schema.safeParse(data);

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
      data,
    };
  }

  let result;
  try {
    result = await createCustomerApi(validatedFields.data);
  } catch (error) {
    return handleUnknownActionError<CustomerFormDataSchema>(error, data);
  }

  if (!result.success) {
    return handleApiActionError<CustomerFormDataSchema>(result.error, data);
  }

  redirect(`/customers/${result.data.id}`);
}
