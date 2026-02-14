"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Link, Type, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export default function BookmarkForm() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !url.trim()) {
      toast.error("Both title and URL are required.");
      return;
    }

    try {
      new URL(url.trim());
    } catch {
      toast.error("Please enter a valid URL (e.g., https://example.com).");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      toast.error("Session expired. Please sign in again.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("bookmarks").insert({
      title: title.trim(),
      url: url.trim(),
      user_id: user.id,
    });

    if (insertError) {
      toast.error(insertError.message);
    } else {
      setTitle("");
      setUrl("");
      toast.success("Bookmark added successfully!");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
            <Plus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Add Bookmark
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <Type className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Bookmark title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Link className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="url"
                placeholder="https://example.com"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Bookmark
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
