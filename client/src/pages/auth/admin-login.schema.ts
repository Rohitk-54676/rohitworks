import { z } from "zod";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required"),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;