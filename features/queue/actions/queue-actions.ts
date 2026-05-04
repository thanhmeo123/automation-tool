"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import {
  createQueueItemSchema,
  updateQueueStatusSchema,
} from "../schema/queue.schema";

export async function createQueueItem(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsed = createQueueItemSchema.safeParse({
    content: String(formData.get("content") ?? ""),
    platform: String(formData.get("platform") ?? ""),
  });

  if (!parsed.success) {
    return;
  }

  const content = parsed.data.content;
  const platform = parsed.data.platform ? parsed.data.platform : null;

  await supabase.from("content_queue").insert({
    user_id: user.id,
    content,
    platform,
    status: "draft",
  });

  revalidatePath("/queue");
}

export async function updateQueueStatus(formData: FormData) {
  const supabase = await createClient();
  const parsed = updateQueueStatusSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) return;

  await supabase
    .from("content_queue")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  revalidatePath("/queue");
}

export async function deleteQueueItem(formData: FormData) {
  const supabase = await createClient();
  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await supabase.from("content_queue").delete().eq("id", id);
  revalidatePath("/queue");
}
