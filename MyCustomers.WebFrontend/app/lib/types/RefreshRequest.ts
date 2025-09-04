/**
 * Request payload for refreshing access tokens.
 */
export interface RefreshRequest {
  /** The refresh token used to obtain a new access token. */
  refreshToken: string;
}
