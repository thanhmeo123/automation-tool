import { z } from "zod";

export const generateContentSchema = z.object({
  prompt: z
    .string()
    .trim()
    .min(5, "Prompt must be at least 5 characters")
    .max(1000, "Prompt is too long"),
  platform: z
    .enum(["blog", "twitter", "linkedin", "facebook", "instagram"])
    .default("blog"),
  tone: z
    .enum(["professional", "casual", "humorous", "inspirational"])
    .default("professional"),
  length: z.enum(["short", "medium", "long"]).default("medium"),
});

export type GenerateContentInput = z.infer<typeof generateContentSchema>;
