import { z } from "zod";

/**
 * Schema for registering.
 */
export const schema = z
  .object({
    email: z.email(),
    password: z
      .string()
      .min(6, "Must be at least 6 characters long")
      .regex(/[A-Z]/, "Must contain an uppercase letter")
      .regex(/[a-z]/, "Must contain a lowercase letter")
      .regex(/[0-9]/, "Must contain a digit")
      .regex(/[\W_]/, "Must contain a special character"),
    // must be same value as password
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    error: "Passwords must match",
    path: ["confirmPassword"],
  });

/**
 * Form data schema for registering.
 */
export type RegisterFormDataSchema = z.infer<typeof schema>;
