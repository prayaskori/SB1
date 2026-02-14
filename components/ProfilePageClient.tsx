"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import Header from "@/components/Header";
import ProfileCard from "@/components/ProfileCard";
import { Button } from "@/components/ui/button";
import { Profile } from "@/types";

interface ProfilePageClientProps {
  userId: string;
  userEmail: string;
  initialProfile: Profile | null;
}

export default function ProfilePageClient({
  userId,
  userEmail,
  initialProfile,
}: ProfilePageClientProps) {
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel(`profile-page-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        (payload) => {
          if (payload.eventType === "DELETE") {
            setProfile(null);
            return;
          }

          setProfile(payload.new as Profile);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header
        userEmail={userEmail}
        displayName={profile?.full_name ?? null}
        avatarUrl={profile?.avatar_url ?? null}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-4">
          <Button asChild variant="ghost" className="gap-2 px-0 hover:bg-transparent">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Back to Bookmarks
            </Link>
          </Button>
        </div>

        <ProfileCard
          userId={userId}
          userEmail={userEmail}
          profile={profile}
          onProfileUpdated={setProfile}
        />
      </main>
    </div>
  );
}
