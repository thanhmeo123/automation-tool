import Link from "next/link";

export function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 hidden md:flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-zinc-200 dark:border-zinc-800">
        <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Studio
        </span>
      </div>
      <nav className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Dashboard
        </Link>
        <Link
          href="/queue"
          className="px-4 py-2 rounded-md text-sm font-medium transition-colors text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:text-zinc-50 dark:hover:bg-zinc-900"
        >
          Content Queue
        </Link>
      </nav>
    </aside>
  );
}
