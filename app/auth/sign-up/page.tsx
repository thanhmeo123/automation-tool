import { SignUpPage } from "@/features/auth/sign-up";

type SignUpPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function SignUpPageRoute({
  searchParams,
}: SignUpPageProps) {
  const params = await searchParams;
  const rawError = params.error;
  const rawSuccess = params.success;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  const success = Array.isArray(rawSuccess) ? rawSuccess[0] : rawSuccess;

  return <SignUpPage error={error} success={success} />;
}
