"use client";
import { useEffect, useState } from "react";
import { heavyFxCapable } from "../fx";

/** Ambient depth for app pages: two slow, blurred brand-colored blobs.
 *  Pure CSS animation (no JS loop). Rendered only on capable devices and with
 *  modest blur so it never overloads old GPUs. */
export function AuroraBackground() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(heavyFxCapable()), []);
  if (!on) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="aurora-blob absolute -top-24 -left-16 w-72 h-72 rounded-full bg-brand/10 blur-3xl" />
      <div className="aurora-blob aurora-blob-2 absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-accent-violet/10 blur-3xl" />
    </div>
  );
}
