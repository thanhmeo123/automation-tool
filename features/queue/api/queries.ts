import { createClient } from "@/lib/supabase/server";
import { type QueueItemType } from "../schema/queue.schema";

export async function getQueueItems(): Promise<{
  data: QueueItemType[] | null;
  error: string | null;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { data: null, error: "Unauthorized" };
  }

  const { data, error } = await supabase
    .from("content_queue")
    .select("id, content, platform, status, scheduled_at, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as QueueItemType[], error: null };
}
