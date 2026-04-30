import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "../actions/auth-actions";
import Link from "next/link";

export function AuthForm({ message }: { message?: string }) {
  return (
    <div className="w-full max-w-[420px] bg-white dark:bg-zinc-950 rounded-2xl shadow-[0px_4px_20px_rgba(0,0,0,0.04)] dark:shadow-none p-8 md:p-10 border border-zinc-200 dark:border-zinc-800 flex flex-col items-center">
      {/* Brand / Header */}
      <div className="w-full text-center mb-10">
        <h1 className="text-3xl font-semibold text-zinc-950 dark:text-zinc-50 mb-2">
          AutoContent Studio
        </h1>
        <p className="text-base text-zinc-500 dark:text-zinc-400">
          Sign in to your account
        </p>
      </div>

      {/* Form */}
      <form className="w-full flex flex-col gap-6">
        {message && (
          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg">
            {message}
          </div>
        )}

        {/* Email Input */}
        <div className="flex flex-col gap-2">
          <Label
            className="text-xs uppercase tracking-wider text-zinc-500 font-semibold"
            htmlFor="email"
          >
            Email Address
          </Label>
          <Input
            className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg h-12 px-4 shadow-sm"
            id="email"
            name="email"
            type="email"
            placeholder="name@company.com"
            required
          />
        </div>

        {/* Password Input */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <Label
              className="text-xs uppercase tracking-wider text-zinc-500 font-semibold"
              htmlFor="password"
            >
              Password
            </Label>
            <Link
              href="#"
              className="text-sm text-zinc-500 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors"
            >
              Forgot?
            </Link>
          </div>
          <Input
            className="w-full bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 rounded-lg h-12 px-4 shadow-sm"
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            minLength={6}
          />
        </div>

        {/* Login Button */}
        <Button
          className="w-full h-12 text-base font-medium mt-2 bg-zinc-950 hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200 transition-colors"
          formAction={login}
        >
          Log in
        </Button>
      </form>

      {/* Divider */}
      <div className="w-full flex items-center gap-4 my-8 text-zinc-400">
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
        <span className="text-sm">or</span>
        <div className="flex-1 h-px bg-zinc-200 dark:bg-zinc-800"></div>
      </div>

      {/* Google Login */}
      <Button
        variant="outline"
        className="w-full h-12 text-base font-medium flex gap-3 text-zinc-950 dark:text-zinc-50 dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900"
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
      </Button>

      {/* Sign Up Link */}
      <p className="mt-8 text-sm text-zinc-500 text-center">
        Don&apos;t have an account?{" "}
        <Link
          href="/auth/sign-up"
          className="text-zinc-950 dark:text-zinc-50 font-medium hover:underline transition-all"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
