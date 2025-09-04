/**
 * Data transfer object for creating or updating a user.
 */
export interface CreateUpdateUserDto {
  /** The email address of the user. */
  email: string;
  /** The password for the user account (required for create, optional for update). */
  password?: string;
  /** Whether the user has admin privileges. */
  isAdmin: boolean;
}