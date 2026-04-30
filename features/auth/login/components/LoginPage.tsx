import Link from "next/link";
import { login } from "../../actions/auth-actions";

type LoginPageProps = {
  message?: string;
};

export function LoginPage({ message }: LoginPageProps) {
  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50">
      <section className="mx-auto flex w-full max-w-[420px] flex-col items-center rounded-xl border border-zinc-200 bg-white p-10 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] dark:border-zinc-800 dark:bg-zinc-950 dark:shadow-none">
        <header className="mb-10 w-full text-center">
          <h1 className="mb-2 text-[30px] font-semibold leading-[1.3]">
            AutoContent Studio
          </h1>
          <p className="text-base leading-normal text-zinc-500 dark:text-zinc-400">
            Sign in to your account
          </p>
        </header>

        <form className="flex w-full flex-col gap-6">
          {message ? (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-400">
              {message}
            </p>
          ) : null}

          <div className="flex flex-col gap-2">
            <label
              className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 transition-all duration-200 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              id="email"
              name="email"
              placeholder="name@company.com"
              required
              type="email"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label
                className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
                htmlFor="password"
              >
                Password
              </label>
              <Link
                className="text-sm text-zinc-500 transition-colors duration-200 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
                href="#"
              >
                Forgot?
              </Link>
            </div>
            <input
              className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-3 text-base text-zinc-900 transition-all duration-200 focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              id="password"
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
              type="password"
            />
          </div>

          <button
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-zinc-950 py-3 text-sm font-medium text-white transition-colors duration-200 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
            formAction={login}
          >
            <span>Log in</span>
          </button>
        </form>
      </section>
    </main>
  );
}
