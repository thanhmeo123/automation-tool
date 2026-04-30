import { LoginPage } from "@/features/auth/login";

export default async function LoginPageRoute(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = await props.searchParams;
  const rawMessage = searchParams.message ?? searchParams.error;
  const message = Array.isArray(rawMessage) ? rawMessage[0] : rawMessage;

  return <LoginPage message={message} />;
}
