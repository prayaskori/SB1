"use client";

import { Bookmark } from "@/types";
import { motion, AnimatePresence } from "framer-motion";
import { BookmarkIcon, Inbox } from "lucide-react";
import BookmarkItem from "./BookmarkItem";
import { TooltipProvider } from "@/components/ui/tooltip";

interface BookmarkListProps {
  bookmarks: Bookmark[];
  onBookmarkDeleted: (id: string) => void;
}

export default function BookmarkList({
  bookmarks,
  onBookmarkDeleted,
}: BookmarkListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookmarkIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Your Bookmarks
          </h2>
          {bookmarks.length > 0 && (
            <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
              {bookmarks.length}
            </span>
          )}
        </div>
      </div>

      {/* Bookmark list or empty state */}
      <TooltipProvider delayDuration={300}>
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 px-6 py-16 dark:border-gray-800 dark:bg-gray-900/50"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 dark:bg-gray-800">
              <Inbox className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-gray-100">
              No bookmarks yet
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Add your first bookmark using the form above to get started.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-2">
            <AnimatePresence mode="popLayout">
              {bookmarks.map((bookmark) => (
                <BookmarkItem
                  key={bookmark.id}
                  bookmark={bookmark}
                  onDeleted={onBookmarkDeleted}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </TooltipProvider>
    </motion.div>
  );
}
