"use client";

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Bookmark, Profile } from "@/types";

interface DashboardClientProps {
  userId: string;
  userEmail: string;
  initialBookmarks: Bookmark[];
  initialProfile: Profile | null;
}

export default function DashboardClient({
  userId,
  userEmail,
  initialBookmarks,
  initialProfile,
}: DashboardClientProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const [profile, setProfile] = useState<Profile | null>(initialProfile);

  const handleBookmarkAdded = (bookmark: Bookmark) => {
    setBookmarks((prev) => {
      if (prev.some((b) => b.id === bookmark.id)) return prev;
      return [bookmark, ...prev];
    });
  };

  const handleBookmarkDeleted = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  useEffect(() => {
    const supabase = createClient();

    const bookmarksChannel = supabase
      .channel(`bookmarks-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          const newBookmark = payload.new as Bookmark;
          setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
          });
        }
      )
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "bookmarks",
        },
        (payload) => {
          const deletedId = payload.old.id as string | undefined;
          if (!deletedId) return;
          setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
        }
      )
      .subscribe();

    const profileChannel = supabase
      .channel(`profile-${userId}`)
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
      supabase.removeChannel(bookmarksChannel);
      supabase.removeChannel(profileChannel);
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
        <div className="space-y-8">
          <BookmarkForm userId={userId} onBookmarkAdded={handleBookmarkAdded} />
          <BookmarkList
            bookmarks={bookmarks}
            onBookmarkDeleted={handleBookmarkDeleted}
          />
        </div>
      </main>
    </div>
  );
}
