"use client";

import { createClient } from "@/lib/supabase/client";
import { Profile } from "@/types";
import { useEffect, useState } from "react";
import { User, Save, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProfileCardProps {
  userId: string;
  userEmail: string;
  profile: Profile | null;
  onProfileUpdated: (profile: Profile) => void;
}

function getInitials(fullName: string | null, email: string) {
  if (fullName && fullName.trim()) {
    return fullName
      .trim()
      .split(/\s+/)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("")
      .slice(0, 2);
  }

  return email.slice(0, 2).toUpperCase();
}

export default function ProfileCard({
  userId,
  userEmail,
  profile,
  onProfileUpdated,
}: ProfileCardProps) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setAvatarUrl(profile?.avatar_url ?? "");
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const supabase = createClient();

    const { data, error } = await supabase
      .from("profiles")
      .upsert(
        {
          id: userId,
          full_name: fullName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        },
        { onConflict: "id" }
      )
      .select("*")
      .single();

    if (error) {
      if (error.code === "42P01") {
        toast.error(
          "Profiles table is missing. Run supabase/migration_profile.sql in Supabase SQL Editor."
        );
      } else {
        toast.error(`Failed to update profile: ${error.message}`);
      }
      setSaving(false);
      return;
    }

    onProfileUpdated(data as Profile);
    toast.success("Profile updated.");
    setSaving(false);
  };

  const displayName = fullName.trim() || profile?.full_name || "User";
  const effectiveAvatar = avatarUrl.trim() || profile?.avatar_url || "";

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
          <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          Profile
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {effectiveAvatar ? (
              <img
                src={effectiveAvatar}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              getInitials(displayName, userEmail)
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
              {displayName}
            </p>
            <p className="truncate text-xs text-gray-500 dark:text-gray-400">
              {userEmail}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <Input
            type="url"
            placeholder="Avatar URL (optional)"
            value={avatarUrl}
            onChange={(e) => setAvatarUrl(e.target.value)}
          />
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Profile
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
