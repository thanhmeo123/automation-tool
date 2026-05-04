import { z } from "zod";

export const createQueueItemSchema = z.object({
  content: z.string().trim().min(1, "Content cannot be empty").max(5000),
  platform: z.string().trim().max(100).optional(),
});

export const updateQueueStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum([
    "draft",
    "pending",
    "approved",
    "scheduled",
    "published",
    "failed",
  ]),
});
