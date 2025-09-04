import type { ActionState } from "./types/ActionState";
import type { ApiError } from "./types/ApiError";

/**
 * Handles API errors that may occur during action processing.
 * @param error - The error object returned from the API.
 * @param data - The form data submitted with the request.
 * @return An ActionState object containing error messages or the data.
 */
export function handleApiActionError<T>(
  error: ApiError,
  data?: Partial<Record<keyof T, FormDataEntryValue | undefined>>,
): ActionState<T> {
  if (error.details) {
    if ("errors" in error.details) {
      return {
        errors: error.details.errors as Partial<
          Record<keyof T, string[] | undefined>
        >,
        data,
      };
    }

    if (error.details.detail) {
      return {
        errorMessage: error.details.detail,
        showSnackbar: error.status === 500,
        data,
      };
    }

    if (error.details.title) {
      return {
        errorMessage: error.details.title,
        showSnackbar: error.status === 500,
        data,
      };
    }
  }

  return handleUnknownActionError<T>(error, data);
}

/**
 * Handles unknown errors that may occur during action processing.
 * @param error - The unknown error object.
 * @param data - The form data submitted with the request.
 * @return An ActionState object containing the error message and the data.
 */
export function handleUnknownActionError<T>(
  error: unknown,
  data?: Partial<Record<keyof T, FormDataEntryValue | undefined>>,
): ActionState<T> {
  console.error("Error while processing request:", error);

  return {
    errorMessage: "An error occurred while processing your request.",
    showSnackbar: true,
    data,
  };
}
