import type { ProblemDetails } from "./ProblemDetails";
import type { ValidationProblemDetails } from "./ValidationProblemDetails";

/**
 * Represents error details returned by the API.
 */
export type ApiErrorDetails = ValidationProblemDetails | ProblemDetails;
