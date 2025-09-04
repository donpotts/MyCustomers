import { z } from "zod";

export const CreateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  isAdmin: z.coerce.boolean(),
});

export const UpdateUserSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().optional(),
  isAdmin: z.coerce.boolean(),
});

export type CreateUserFormData = z.infer<typeof CreateUserSchema>;
export type UpdateUserFormData = z.infer<typeof UpdateUserSchema>;