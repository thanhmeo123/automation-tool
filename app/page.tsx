import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  async function signOut() {
    "use server";
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/auth/login");
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-center justify-center gap-4 px-6 py-12">
      <h1 className="text-2xl font-semibold">Supabase Auth Check</h1>
      {user ? (
        <>
          <p className="text-center text-zinc-600 dark:text-zinc-300">
            Signed in as <span className="font-medium">{user.email}</span>
          </p>
          <form action={signOut}>
            <button className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black">
              Sign out
            </button>
          </form>
          <Link href="/queue" className="text-sm underline">
            Open content queue
          </Link>
        </>
      ) : (
        <>
          <p className="text-center text-zinc-600 dark:text-zinc-300">
            You are not signed in.
          </p>
          <Link
            href="/auth/login"
            className="rounded-md bg-black px-4 py-2 text-sm text-white dark:bg-white dark:text-black"
          >
            Go to login
          </Link>
        </>
      )}
    </main>
  );
}
