import { z } from "zod";

export const authSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" })
    .max(50, { message: "Password cannot exceed 50 characters" }),
});

export type AuthInput = z.infer<typeof authSchema>;
