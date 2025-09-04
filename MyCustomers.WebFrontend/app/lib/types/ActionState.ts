/**
 * State object for actions that can fail or have validation errors.
 */
export type ActionState<T> = {
  /** Error message if the action fails. */
  errorMessage?: string;

  /** Success message if the action is successful. */
  successMessage?: string;

  /** Whether to show a snackbar notification. */
  showSnackbar?: boolean;

  /** Validation errors for the action. */
  errors?: Partial<Record<keyof T, string[] | undefined>>;

  /** Form data for the action. */
  data?: Partial<Record<keyof T, FormDataEntryValue | undefined>>;
};
