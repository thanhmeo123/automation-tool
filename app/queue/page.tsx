import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

type QueueItem = {
  id: string;
  content: string | null;
  platform: string | null;
  status: string | null;
  scheduled_at: string | null;
  created_at: string | null;
};

const createQueueItemSchema = z.object({
  content: z.string().trim().min(1).max(5000),
  platform: z.string().trim().max(100).optional(),
});

const updateQueueStatusSchema = z.object({
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

export default async function QueuePage() {
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

  async function createQueueItem(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      redirect("/auth/login");
    }

    const parsed = createQueueItemSchema.safeParse({
      content: String(formData.get("content") ?? ""),
      platform: String(formData.get("platform") ?? ""),
    });
    if (!parsed.success) {
      revalidatePath("/queue");
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

  async function updateQueueStatus(formData: FormData) {
    "use server";
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

  async function deleteQueueItem(formData: FormData) {
    "use server";
    const supabase = await createClient();
    const id = String(formData.get("id") ?? "");
    if (!id) return;
    await supabase.from("content_queue").delete().eq("id", id);
    revalidatePath("/queue");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Content Queue</h1>
        <Link href="/" className="text-sm underline">
          Back to home
        </Link>
      </div>

      <section className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-medium">Create draft</h2>
        <form action={createQueueItem} className="flex flex-col gap-3">
          <textarea
            name="content"
            required
            placeholder="Write your post content..."
            className="min-h-24 rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-black"
          />
          <input
            name="platform"
            placeholder="Platform (facebook, instagram...)"
            className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-black"
          />
          <div>
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
              Save to queue
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-md border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="mb-3 text-sm font-medium">Recent items</h2>
        {error ? (
          <div className="space-y-3">
            <p className="text-sm text-red-600">
              Failed to load queue: {error.message}
            </p>
            <form action="/queue">
              <button className="rounded-md border border-zinc-400 px-3 py-1 text-sm">
                Retry
              </button>
            </form>
          </div>
        ) : data && data.length > 0 ? (
          <ul className="space-y-2">
            {(data as QueueItem[]).map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-3 rounded-md border border-zinc-200 p-3 dark:border-zinc-800"
              >
                <div className="space-y-1">
                  <p className="text-sm">{item.content || "(empty content)"}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    {item.platform || "unknown"} · {item.status || "draft"}
                  </p>
                </div>
                <form action={deleteQueueItem}>
                  <div className="mb-1">
                    <input type="hidden" name="id" value={item.id} />
                    <select
                      name="status"
                      defaultValue={item.status || "draft"}
                      className="rounded border border-zinc-300 bg-white px-2 py-1 text-xs dark:border-zinc-700 dark:bg-black"
                    >
                      <option value="draft">draft</option>
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="scheduled">scheduled</option>
                      <option value="published">published</option>
                      <option value="failed">failed</option>
                    </select>
                    <button
                      formAction={updateQueueStatus}
                      className="ml-2 text-xs underline"
                    >
                      Update
                    </button>
                  </div>
                  <input type="hidden" name="id" value={item.id} />
                  <button className="text-xs underline">Delete</button>
                </form>
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-2">
            <p className="text-sm text-zinc-600 dark:text-zinc-300">
              No queue items yet.
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create your first draft from the form above.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
