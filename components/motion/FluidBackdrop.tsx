"use client";
import { useEffect, useState } from "react";
import { heavyFxCapable } from "../fx";

/**
 * Antigravity-style flowing iridescent gradient. Two large conic-gradient blobs
 * that are blurred once and then only rotated/scaled (GPU-composited), so motion
 * is essentially free. Falls back to a static gradient on weak devices.
 */
export function FluidBackdrop() {
  const [on, setOn] = useState(false);
  useEffect(() => setOn(heavyFxCapable()), []);

  if (!on) {
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--brand-light),transparent_60%)]"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="fluid-a absolute left-1/2 top-[34%] h-[34rem] w-[34rem] rounded-full opacity-50 blur-3xl"
        style={{ background: "conic-gradient(from 0deg, #6366f1, #8b5cf6, #22d3ee, #6366f1)" }}
      />
      <div
        className="fluid-b absolute left-[62%] top-[46%] h-[26rem] w-[26rem] rounded-full opacity-40 blur-3xl"
        style={{ background: "conic-gradient(from 120deg, #8b5cf6, #6366f1, #a78bfa, #8b5cf6)" }}
      />
    </div>
  );
}
