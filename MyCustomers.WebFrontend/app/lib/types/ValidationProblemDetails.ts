import type { ProblemDetails } from "./ProblemDetails";

/**
 * A {@link ProblemDetails} for validation errors.
 */
export interface ValidationProblemDetails extends ProblemDetails {
  /** The validation errors. */
  errors: Record<string, string[]>;
}
