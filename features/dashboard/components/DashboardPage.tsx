import Link from "next/link";
import { type User } from "@supabase/supabase-js";
import { signout } from "../../auth/actions/auth-actions";

export function DashboardPage({ user }: { user: User | null }) {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 py-8">
      <header>
        <h1 className="text-3xl font-bold text-zinc-950 dark:text-zinc-50 tracking-tight">
          Dashboard
        </h1>
        <p className="mt-2 text-base text-zinc-500 dark:text-zinc-400">
          Welcome to AutoContent Studio! Here is an overview of your workspace.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Status Card */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Account Status
          </h2>
          {user ? (
            <div className="mt-4 flex flex-col gap-4">
              <p className="text-base text-zinc-900 dark:text-zinc-50 truncate">
                <span className="font-medium">{user.email}</span>
              </p>
              <form action={signout}>
                <button className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200">
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-4">
              <p className="text-base text-zinc-500 dark:text-zinc-400">
                You are not signed in.
              </p>
              <Link
                href="/auth/login"
                className="inline-flex items-center justify-center rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                Go to login
              </Link>
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
          <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
            Quick Actions
          </h2>
          <div className="mt-4 flex flex-col gap-2">
            <Link
              href="/queue"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-50 hover:text-zinc-950 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50 dark:hover:bg-zinc-900"
            >
              Open Content Queue
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
