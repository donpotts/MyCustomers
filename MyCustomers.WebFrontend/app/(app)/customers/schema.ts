import { z } from "zod";

/**
 * Schema for creating and editing customers.
 */
export const schema = z.object({
  name: z
    .string(),
  email: z
    .string(),
  number: z
    .string()
    .regex(
      /^(\+?[1-9]\d{1,14}|\(\d{3}\)[\s.-]?\d{3}[\s.-]?\d{4}|\d{3}[\s.-]?\d{3}[\s.-]?\d{4})$/,
      { message: "Invalid phone number format" }
    )
    .optional(),
  notes: z
    .string()
    .optional(),
  createdDate: z
    .iso.datetime(),
  modifiedDate: z
    .iso.datetime(),
});

/**
 * Form data schema for creating and editing customers.
 */
export type CustomerFormDataSchema = z.infer<typeof schema>;
