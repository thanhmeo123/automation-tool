import { createClient } from "@/lib/supabase/server";
import { DashboardPage } from "@/features/dashboard";

export default async function DashboardRoute() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <DashboardPage user={user} />;
}
