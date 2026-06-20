// Shared gate for GPU/CPU-heavy decorative effects (3D canvas, big blurs).
// Defaults to OFF on weak/old devices so the app stays reliable and light.
export function heavyFxCapable(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    const cores = navigator.hardwareConcurrency || 2;
    if (cores < 4) return false;
    // deviceMemory is GB (Chromium only); when present, require a healthy amount.
    const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
    if (typeof mem === "number" && mem < 4) return false;
    // Skip on small viewports (phones) — decoration isn't worth the cost there.
    if (Math.min(window.innerWidth, window.innerHeight) < 640) return false;
    return true;
  } catch {
    return false;
  }
}
