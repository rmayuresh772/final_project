import { z } from "zod";

export const registerSchema = z.object({
  organizationName: z
    .string()
    .min(3, "Organization name must be at least 3 characters"),

  organizationSlug: z
    .string()
    .min(3)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers and hyphens"),

  name: z
    .string()
    .min(2, "Name is required"),

  email: z
    .string()
    .email("Invalid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;