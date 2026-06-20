import Link from "next/link";
import { Home, Compass } from "lucide-react";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 text-center">
      <Logo size="md" />
      <div className="mt-10 flex items-center gap-4">
        <span className="text-5xl font-bold text-foreground">404</span>
        <span className="h-12 w-px bg-border" />
        <p className="text-sm text-muted-foreground text-left max-w-xs">
          This page could not be found. It may have moved, or the link is out of date.
        </p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-brand-foreground hover:bg-brand-text transition-colors"
        >
          <Home className="w-4 h-4" /> Go to Dashboard
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted transition-colors"
        >
          <Compass className="w-4 h-4" /> Back to Home
        </Link>
      </div>
    </div>
  );
}
