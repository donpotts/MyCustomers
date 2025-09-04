import type { ApiErrorDetails } from "./ApiErrorDetails";

/**
 * Represents an error response from the API.
 */
export type ApiError = {
  /** The HTTP status code of the error response. */
  status: number;

  /** Details about the error. */
  details?: ApiErrorDetails;
};
