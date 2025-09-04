/**
 * Response payload containing access token information.
 */
export interface AccessTokenResponse {
  /** The access token for API authentication. */
  accessToken: string;

  /** Token expiration time in seconds. */
  expiresIn: number;

  /** The refresh token for obtaining new access tokens. */
  refreshToken: string;

  /** The type of token (e.g., "Bearer"). */
  tokenType?: string | null;
}
