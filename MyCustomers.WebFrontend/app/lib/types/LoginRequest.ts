/**
 * Request payload for user login.
 */
export interface LoginRequest {
  /** The user's email address. */
  email: string;

  /** The user's password. */
  password: string;

  /** Two-factor authentication code. */
  twoFactorCode?: string | null;

  /** Two-factor recovery code. */
  twoFactorRecoveryCode?: string | null;
}
