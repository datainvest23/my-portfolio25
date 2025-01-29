// src/app/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Portfolio from "@/components/Portfolio";

export default async function PrivatePage() {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen">
      <Portfolio />
    </main>
  );
}
