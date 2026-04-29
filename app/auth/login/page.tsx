import { AuthForm } from "@/features/auth/components/AuthForm";

export default async function LoginPage(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawMessage = searchParams.message ?? searchParams.error;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <AuthForm message={message} />
    </main>
  );
}
