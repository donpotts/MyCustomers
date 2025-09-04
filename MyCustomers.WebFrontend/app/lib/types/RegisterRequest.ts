/**
 * Request payload for user registration.
 */
export interface RegisterRequest {
  /** The user's email address. */
  email: string;

  /** The user's password. */
  password: string;
}
