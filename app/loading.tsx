import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header skeleton */}
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-5 w-36" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-9 w-32 rounded-lg" />
          </div>
        </div>
      </header>

      {/* Content skeleton */}
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="space-y-8">
          {/* Form skeleton */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <Skeleton className="mb-4 h-6 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* List skeleton */}
          <div>
            <Skeleton className="mb-4 h-6 w-40" />
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900"
                >
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-64" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
