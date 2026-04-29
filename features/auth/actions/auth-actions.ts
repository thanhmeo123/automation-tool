"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, use zod to validate
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/auth/login?message=" + encodeURIComponent(error.message));
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    redirect("/auth/login?message=" + encodeURIComponent(error.message));
  }

  redirect("/auth/login?message=Check your email to continue sign in process");
}

export async function signout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
