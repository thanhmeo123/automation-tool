import { redirect } from "next/navigation";
import { QueuePage } from "@/features/queue";
import { getQueueItems } from "@/features/queue/api/queries";

export default async function QueuePageRoute() {
  const { data, error } = await getQueueItems();

  if (error === "Unauthorized") {
    redirect("/auth/login");
  }

  return <QueuePage data={data} error={error} />;
}
