import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { QueuePage, type QueueItemType } from "@/features/queue";

export default async function QueuePageRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const { data, error } = await supabase
    .from("content_queue")
    .select("id, content, platform, status, scheduled_at, created_at")
    .order("created_at", { ascending: false })
    .limit(20);

  return (
    <QueuePage data={data as QueueItemType[] | null} error={error?.message} />
  );
}
