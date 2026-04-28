import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const rawError = params.error;
  const rawSuccess = params.success;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  const success = Array.isArray(rawSuccess) ? rawSuccess[0] : rawSuccess;

  async function signUp(formData: FormData) {
    "use server";

    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    if (!email || !password) {
      redirect("/auth/sign-up?error=Please%20enter%20email%20and%20password");
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      redirect(`/auth/sign-up?error=${encodeURIComponent(error.message)}`);
    }

    redirect("/auth/sign-up?success=Check%20your%20email%20to%20confirm%20account");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center gap-5 px-6">
      <div>
        <h1 className="text-2xl font-semibold">Sign up</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Create a new account with Supabase Auth.
        </p>
      </div>

      {error ? (
        <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      ) : null}

      {success ? (
        <p className="rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          {success}
        </p>
      ) : null}

      <form action={signUp} className="flex flex-col gap-3">
        <input
          name="email"
          type="email"
          placeholder="you@example.com"
          required
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-black"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={6}
          className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none ring-zinc-300 focus:ring-2 dark:border-zinc-700 dark:bg-black"
        />
        <button className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
          Create account
        </button>
      </form>

      <Link
        href="/auth/login"
        className="text-sm text-zinc-600 underline dark:text-zinc-300"
      >
        Already have an account? Sign in
      </Link>
    </main>
  );
}
