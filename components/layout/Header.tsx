export function Header() {
  return (
    <header className="h-16 shrink-0 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6">
      <div className="flex md:hidden">
        {/* Mobile menu toggle would go here */}
        <span className="text-xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          Studio
        </span>
      </div>

      {/* Desktop spacing to push user section right */}
      <div className="hidden md:flex flex-1"></div>

      <div className="flex items-center gap-4">
        {/* User profile dropdown would go here */}
        <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
          <span className="text-xs font-semibold">US</span>
        </div>
      </div>
    </header>
  );
}
