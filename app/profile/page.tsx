import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfilePageClient from "@/components/ProfilePageClient";
import { Profile } from "@/types";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  return (
    <ProfilePageClient
      userId={user.id}
      userEmail={user.email ?? ""}
      initialProfile={(profile as Profile | null) ?? null}
    />
  );
}
