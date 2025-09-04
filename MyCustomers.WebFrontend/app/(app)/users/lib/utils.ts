import type { UserDto } from "@/app/lib/types/UserDto";

/**
 * Gets the display name for a user.
 * @param user The user.
 * @returns The display name.
 */
export function getUserDisplayName(user: UserDto): string {
  return user.email || "Unknown User";
}

/**
 * Gets the role display text for a user.
 * @param user The user.
 * @returns The role display text.
 */
export function getUserRole(user: UserDto): string {
  return user.isAdmin ? "Admin" : "User";
}

/**
 * Parses form data for user creation.
 * @param formData The FormData object to parse.
 * @returns An object containing the parsed form data.
 */
export function parseCreateUserFormData(formData: FormData) {
  return {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    isAdmin: formData.get("isAdmin") === "true",
  };
}

/**
 * Parses form data for user updates.
 * @param formData The FormData object to parse.
 * @returns An object containing the parsed form data.
 */
export function parseUpdateUserFormData(formData: FormData) {
  return {
    email: formData.get("email") as string,
    password: (formData.get("password") as string) || undefined,
    isAdmin: formData.get("isAdmin") === "true",
  };
}