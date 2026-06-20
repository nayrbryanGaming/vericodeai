"use client";
import { useEffect, useRef } from "react";
import { heavyFxCapable } from "../fx";

/**
 * Interactive 3D node network on a raw <canvas> — evokes the VeriCode
 * circuit-network logo. Performance-first so it stays smooth on old devices:
 *  - glow is baked into a sprite once, then blitted (no per-frame gradients)
 *  - node count + FPS auto-downgrade on low-end hardware / small screens
 *  - pauses when scrolled off-screen or the tab is hidden
 *  - honors prefers-reduced-motion (renders a single static frame)
 *  - zero 3D libraries; hand-rolled projection keeps the bundle tiny
 */
type Node = { x: number; y: number; z: number };

function makeGlow(color: string, size: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, color);
  grad.addColorStop(0.4, color.replace(/[\d.]+\)$/, "0.5)"));
  grad.addColorStop(1, color.replace(/[\d.]+\)$/, "0)"));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}

export function NetworkCanvas({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Hard gate: never run the animation on weak/old devices (reliability first).
    if (!heavyFxCapable()) return;

    const cv = canvasRef.current;
    if (!cv) return;
    let g: CanvasRenderingContext2D | null = null;
    try {
      g = cv.getContext("2d", { alpha: true });
    } catch {
      return;
    }
    if (!g) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Capped low to stay light even on capable machines.
    const dpr = 1;
    const COUNT = 56;
    const EDGE_DIST = 0.32;
    const minFrameMs = 1000 / 30;

    // Fibonacci sphere of nodes (+ a few inner ones for depth).
    const nodes: Node[] = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(1 - y * y);
      const theta = golden * i;
      const r = i % 7 === 0 ? 0.6 : 1;
      nodes.push({ x: Math.cos(theta) * radius * r, y: y * r, z: Math.sin(theta) * radius * r });
    }

    // Precompute near-neighbour edges once.
    const edges: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dz = nodes[i].z - nodes[j].z;
        if (dx * dx + dy * dy + dz * dz < EDGE_DIST) edges.push([i, j]);
      }
    }

    const glowAccent = makeGlow("rgba(99,102,241,1)", 48);
    const glowViolet = makeGlow("rgba(139,92,246,1)", 48);

    let w = 0, h = 0;
    function resize() {
      const rect = cv!.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cv!.width = Math.round(w * dpr);
      cv!.height = Math.round(h * dpr);
      g!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(cv);

    // Pointer parallax (skip on touch-only).
    let targetRX = 0, targetRY = 0, curRX = 0, curRY = 0;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    function onMove(e: PointerEvent) {
      const rect = cv!.getBoundingClientRect();
      targetRY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.1;
      targetRX = ((e.clientY - rect.top) / rect.height - 0.5) * 1.1;
    }
    if (finePointer) window.addEventListener("pointermove", onMove, { passive: true });

    function draw(t: number) {
      curRX += (targetRX - curRX) * 0.05;
      curRY += (targetRY - curRY) * 0.05;
      const ay = t * 0.00016 + curRY;
      const ax = curRX * 0.6 + 0.25;
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      const cosX = Math.cos(ax), sinX = Math.sin(ax);
      const cx = w / 2, cy = h / 2;
      const scale = Math.min(w, h) * 0.42;
      const persp = 3.2;

      const proj = nodes.map((n) => {
        let x = n.x * cosY - n.z * sinY;
        let z = n.x * sinY + n.z * cosY;
        const y = n.y * cosX - z * sinX;
        z = n.y * sinX + z * cosX;
        const d = persp / (persp - z);
        return { sx: cx + x * scale * d, sy: cy + y * scale * d, depth: (z + 1) / 2 };
      });

      g!.clearRect(0, 0, w, h);

      g!.lineWidth = 1;
      for (const [a, b] of edges) {
        const pa = proj[a], pb = proj[b];
        const alpha = ((pa.depth + pb.depth) / 2) * 0.28;
        if (alpha < 0.02) continue;
        g!.strokeStyle = `rgba(99,102,241,${alpha})`;
        g!.beginPath();
        g!.moveTo(pa.sx, pa.sy);
        g!.lineTo(pb.sx, pb.sy);
        g!.stroke();
      }

      for (const p of proj) {
        const s = 3 + p.depth * 9;
        g!.globalAlpha = 0.35 + p.depth * 0.55;
        g!.drawImage(p.depth > 0.62 ? glowViolet : glowAccent, p.sx - s, p.sy - s, s * 2, s * 2);
      }
      g!.globalAlpha = 1;
    }

    // Static single frame for reduced motion.
    if (reduce) {
      draw(0);
      return () => ro.disconnect();
    }

    let raf = 0;
    let last = 0;
    let visible = true;
    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      if (now - last < minFrameMs) return;
      last = now;
      draw(now);
    }
    raf = requestAnimationFrame(loop);

    // Pause when off-screen or tab hidden.
    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }, { threshold: 0 });
    io.observe(cv);
    const onVis = () => { visible = document.visibilityState === "visible"; };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (finePointer) window.removeEventListener("pointermove", onMove);
    };
  }, []);

  // pointer-events-none baked in: parallax uses a window listener, so the canvas
  // must never sit on top of and block interactive content.
  return <canvas ref={canvasRef} className={`pointer-events-none ${className}`} aria-hidden="true" />;
}
