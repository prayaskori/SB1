import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/Header";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Bookmark } from "@/types";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Header userEmail={user.email ?? ""} />

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="space-y-8">
          <BookmarkForm />
          <BookmarkList
            initialBookmarks={(bookmarks as Bookmark[]) ?? []}
            userId={user.id}
          />
        </div>
      </main>
    </div>
  );
}
