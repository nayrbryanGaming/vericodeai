import { cn } from "@/lib/utils";

/** Shimmering placeholder block. Use while API data is loading. */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded-md bg-muted", className)} />;
}

/** Card-shaped skeleton matching the dashboard stat cards. */
export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-4">
      <Skeleton className="w-9 h-9 rounded-lg mb-3" />
      <Skeleton className="h-7 w-16 mb-2" />
      <Skeleton className="h-3 w-24" />
    </div>
  );
}
