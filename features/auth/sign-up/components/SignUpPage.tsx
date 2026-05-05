"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignUpPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Registration successful, usually requires email confirmation
      // but if disabled, they can login. Let's just redirect to login
      router.push(
        "/auth/login?message=Check your email to confirm your account",
      );
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Đã xảy ra lỗi khi đăng ký",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      setError(null);
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Đã xảy ra lỗi khi đăng nhập với Google",
      );
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-10 text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-50 flex items-center justify-center">
      <section className="w-full max-w-[420px] bg-white dark:bg-zinc-950 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-8 md:p-10 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
        {/* Brand / Header */}
        <header className="w-full text-center mb-10">
          <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
            AutoContent Studio
          </h1>
          <p className="text-base text-zinc-500 dark:text-zinc-400">
            Create a new account
          </p>
        </header>

        {/* Form */}
        <form className="w-full flex flex-col gap-6" onSubmit={handleSignUp}>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg">
              {error}
            </div>
          )}

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-wider text-zinc-500 font-semibold"
              htmlFor="email"
            >
              Email Address
            </label>
            <input
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg h-12 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all"
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              autoComplete="email"
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label
              className="text-xs uppercase tracking-wider text-zinc-500 font-semibold"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg h-12 px-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-50 transition-all"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="new-password"
            />
          </div>

          {/* Sign Up Button */}
          <button
            className="w-full h-12 rounded-lg text-base font-medium mt-2 bg-zinc-950 text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create account"}
          </button>
        </form>

        {/* Divider */}
        <div className="w-full flex items-center gap-4 my-8 text-zinc-400">
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
          <span className="text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full h-12 rounded-lg border text-base font-medium flex items-center justify-center gap-3 text-zinc-950 dark:text-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors disabled:opacity-50"
          type="button"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            ></path>
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            ></path>
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05"
            ></path>
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335"
            ></path>
          </svg>
          Continue with Google
        </button>

        {/* Sign In Link */}
        <p className="mt-8 text-sm text-zinc-500 text-center">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-zinc-950 dark:text-zinc-50 font-medium hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
