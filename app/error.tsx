"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-100 dark:bg-red-900/30">
          <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          An unexpected error occurred. Please try again.
        </p>
        <Button onClick={reset} className="mt-6" variant="outline">
          <RefreshCw className="h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  );
}
