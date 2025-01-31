import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Portfolio from "@/components/Portfolio";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    redirect("/login"); // ✅ Redirects unauthorized users
  }

  return (
    <main className="min-h-screen">
      <Portfolio />
    </main>
  );
}
