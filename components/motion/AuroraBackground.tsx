"use client";

/** Ambient depth for app pages: two slow, blurred brand-colored blobs.
 *  Pure CSS animation (no JS loop), pointer-events-none, very low opacity —
 *  effectively free, and auto-stilled under prefers-reduced-motion. */
export function AuroraBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob absolute -top-32 -left-24 w-[36rem] h-[36rem] rounded-full bg-brand/10 blur-[120px]" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-40 -right-24 w-[40rem] h-[40rem] rounded-full bg-accent-violet/10 blur-[130px]" />
    </div>
  );
}
