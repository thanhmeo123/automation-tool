import {
  createQueueItem,
  updateQueueStatus,
  deleteQueueItem,
} from "../actions/queue-actions";

export type QueueItemType = {
  id: string;
  content: string | null;
  platform: string | null;
  status: string | null;
  scheduled_at: string | null;
  created_at: string | null;
};

type QueuePageProps = {
  data: QueueItemType[] | null;
  error?: string;
};

export function QueuePage({ data, error }: QueuePageProps) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
          Content Queue
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Manage your scheduled and drafted posts.
        </p>
      </header>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Create Draft
        </h2>
        <form action={createQueueItem} className="flex flex-col gap-4">
          <textarea
            name="content"
            required
            placeholder="Write your post content..."
            className="min-h-[120px] w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50"
          />
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <input
              name="platform"
              placeholder="Platform (e.g., facebook, instagram)"
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-zinc-900 focus:ring-1 focus:ring-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50 dark:focus:border-zinc-50 dark:focus:ring-zinc-50 sm:max-w-xs"
            />
            <button className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
              Save to queue
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="mb-4 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
          Recent Items
        </h2>

        {error ? (
          <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/50">
            <p className="text-sm text-red-600 dark:text-red-400">
              Failed to load queue: {error}
            </p>
          </div>
        ) : data && data.length > 0 ? (
          <ul className="flex flex-col gap-3">
            {data.map((item) => (
              <li
                key={item.id}
                className="flex flex-col gap-4 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between"
              >
                <div className="flex-1 space-y-1">
                  <p className="text-sm text-zinc-950 dark:text-zinc-50 whitespace-pre-wrap">
                    {item.content || "(empty content)"}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {item.platform || "unknown"} ·{" "}
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        item.status === "published"
                          ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                          : item.status === "failed"
                            ? "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
                            : "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                      }`}
                    >
                      {item.status || "draft"}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2 sm:flex-col sm:items-end">
                  <form
                    action={updateQueueStatus}
                    className="flex items-center gap-2"
                  >
                    <input type="hidden" name="id" value={item.id} />
                    <select
                      name="status"
                      defaultValue={item.status || "draft"}
                      className="rounded-md border border-zinc-300 bg-white px-2 py-1.5 text-xs outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
                    >
                      <option value="draft">draft</option>
                      <option value="pending">pending</option>
                      <option value="approved">approved</option>
                      <option value="scheduled">scheduled</option>
                      <option value="published">published</option>
                      <option value="failed">failed</option>
                    </select>
                    <button className="rounded-md bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700">
                      Update
                    </button>
                  </form>
                  <form action={deleteQueueItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button className="text-xs font-medium text-red-600 transition-colors hover:text-red-700 dark:text-red-400 dark:hover:text-red-300">
                      Delete
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/50">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
              No queue items yet
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Create your first draft from the form above.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
