"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Trash2, Loader2, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

interface BookmarkItemProps {
  bookmark: Bookmark;
}

function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return "";
  }
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BookmarkItem({ bookmark }: BookmarkItemProps) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();

    const { error: deleteError } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", bookmark.id);

    if (deleteError) {
      toast.error(`Failed to delete: ${deleteError.message}`);
      setDeleting(false);
    } else {
      toast.success("Bookmark deleted.");
    }
  };

  const faviconUrl = getFaviconUrl(bookmark.url);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.2 }}
      className="group flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-gray-300 hover:shadow-md dark:border-gray-800 dark:bg-gray-900 dark:hover:border-gray-700"
    >
      {/* Favicon */}
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800">
        {faviconUrl ? (
          <img
            src={faviconUrl}
            alt=""
            className="h-5 w-5"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
            }}
          />
        ) : null}
        <Globe className={`h-5 w-5 text-gray-400 ${faviconUrl ? "hidden" : ""}`} />
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <a
          href={bookmark.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link flex items-center gap-1.5"
        >
          <h3 className="truncate text-sm font-medium text-gray-900 group-hover/link:text-blue-600 dark:text-gray-100 dark:group-hover/link:text-blue-400 transition-colors">
            {bookmark.title}
          </h3>
          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-gray-400 opacity-0 transition-opacity group-hover/link:opacity-100" />
        </a>
        <div className="mt-1 flex items-center gap-3">
          <p className="truncate text-xs text-gray-500 dark:text-gray-400">
            {bookmark.url}
          </p>
          <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <Clock className="h-3 w-3" />
            {formatDate(bookmark.created_at)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDelete}
            disabled={deleting}
            className="h-8 w-8 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Delete bookmark</TooltipContent>
      </Tooltip>
    </motion.div>
  );
}
