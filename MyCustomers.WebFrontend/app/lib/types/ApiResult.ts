import type { ApiError } from "./ApiError";

/**
 * Represents the result of an API call.
 */
export type ApiResult<T> =
  | {
      /** Indicates whether the API call was successful. */
      success: true;
      /** The data returned from the API. */
      data: T;
      error?: undefined;
    }
  | {
      /** Indicates whether the API call was successful. */
      success: false;
      /** The error returned from the API. */
      error: ApiError;
      data?: undefined;
    };
