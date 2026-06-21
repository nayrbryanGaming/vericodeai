"use client";
/**
 * WaterShader — WebGL / GLSL fragment shader water simulation.
 * Renders a real-time procedural water surface with:
 *   - Multi-octave wave displacement (Gerstner-style)
 *   - Caustic light patterns
 *   - Specular highlights from a point light
 *   - Depth-based color gradient (deep ocean blue → surface teal)
 *   - Bokeh bubble particles layered on top (2D canvas overlay)
 * No external dependencies. Bundle impact: ~0 bytes (raw WebGL).
 */
import { useEffect, useRef } from "react";

const VERT_SRC = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAG_SRC = `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;

// ── Hash / noise ──────────────────────────────────────────────────────────────
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float hash1(float n) { return fract(sin(n) * 753.5453123); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);
}

float fbm(vec2 p, int oct) {
  float v=0., a=0.5;
  for (int i=0;i<8;i++) {
    if (i>=oct) break;
    v+=a*noise(p); p=p*2.1+vec2(1.7,9.2); a*=0.5;
  }
  return v;
}

// ── Gerstner waves (3 sets for complexity) ────────────────────────────────────
float gerstner(vec2 uv, vec2 dir, float A, float k, float w, float t) {
  return A * sin(dot(normalize(dir),uv)*k - t*w);
}

// ── Surface height at point ───────────────────────────────────────────────────
float height(vec2 uv, float t) {
  float h = 0.0;
  h += gerstner(uv, vec2(1.0, 0.3), 0.018, 5.0, 1.1, t);
  h += gerstner(uv, vec2(-0.5,1.0), 0.012, 8.0, 1.4, t);
  h += gerstner(uv, vec2(0.8,-0.6), 0.009, 12.0, 1.8, t);
  h += gerstner(uv, vec2(0.2, 0.9), 0.006, 18.0, 2.2, t);
  h += fbm(uv*4.0 + t*0.07, 5) * 0.022;
  h += fbm(uv*9.0 - t*0.05, 4) * 0.010;
  return h;
}

// ── Analytical normal from height field ───────────────────────────────────────
vec3 waterNormal(vec2 uv, float t) {
  float e = 0.002;
  float h  = height(uv, t);
  float hx = height(uv + vec2(e,0), t);
  float hy = height(uv + vec2(0,e), t);
  return normalize(vec3(h-hx, h-hy, e*1.6));
}

// ── Caustic (inverse voronoi-ish) ─────────────────────────────────────────────
float caustic(vec2 uv, float t) {
  vec2 p = uv * 6.0;
  float c = 0.0;
  for (int i=0; i<4; i++) {
    float fi = float(i);
    vec2 q = p + vec2(cos(t*0.32+fi*1.8), sin(t*0.27+fi*2.3)) * 0.7;
    c += abs(sin(q.x+sin(q.y+t*0.22)) + sin(q.y+sin(q.x+t*0.28)));
  }
  return pow(clamp(1.0 - c/8.0, 0.0, 1.0), 2.5) * 2.2;
}

// ── Bokeh circles (fake depth-of-field bubbles) ───────────────────────────────
float bokehCircle(vec2 uv, vec2 center, float radius) {
  float d = length(uv - center);
  float edge = 0.003;
  return smoothstep(radius+edge, radius-edge, d);
}

void main() {
  vec2 fragUV = gl_FragCoord.xy / u_resolution;
  // flip Y so top = 0
  vec2 uv = vec2(fragUV.x, 1.0 - fragUV.y);
  float t = u_time * 0.45;

  // aspect-correct space
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvA = vec2(uv.x * aspect, uv.y);

  // ── Water normal ─────────────────────────────────────────────────────────
  vec3 N = waterNormal(uvA, t);
  vec3 V = vec3(0.0, 0.0, 1.0);

  // ── Lighting ─────────────────────────────────────────────────────────────
  vec3 L1 = normalize(vec3(sin(t*0.1)*0.5+0.2,  cos(t*0.08)*0.3+0.5, 0.75));
  vec3 L2 = normalize(vec3(cos(t*0.07)*0.3-0.4, sin(t*0.09)*0.2+0.3, 0.6));

  // Refraction offset
  vec2 refUV = uvA + N.xy * 0.08;

  // ── Base water colour: very dark navy → teal → bright crest ──────────────
  vec3 deep    = vec3(0.005, 0.018, 0.055);
  vec3 mid     = vec3(0.010, 0.065, 0.155);
  vec3 shallow = vec3(0.025, 0.160, 0.310);
  vec3 crest   = vec3(0.20,  0.55,  0.78);
  vec3 foam    = vec3(0.70,  0.88,  1.00);

  float noiseBase = fbm(refUV*1.8 + t*0.03, 6);
  vec3 baseCol = mix(deep, mid,     clamp(noiseBase*1.8, 0.0, 1.0));
  baseCol      = mix(baseCol, shallow, clamp(noiseBase*2.5-0.5, 0.0, 1.0));

  // Fresnel — bright at glancing
  float fresnel = pow(1.0 - max(dot(N, V), 0.0), 2.8);
  baseCol = mix(baseCol, crest, fresnel * 0.7);

  // Specular highlights (two lights)
  vec3 H1 = normalize(L1+V), H2 = normalize(L2+V);
  float s1 = pow(max(dot(N,H1),0.0), 180.0) * 3.5;
  float s2 = pow(max(dot(N,H2),0.0),  80.0) * 1.2;
  vec3 specCol = vec3(0.65,0.88,1.0)*s1 + vec3(0.4,0.7,0.95)*s2;

  // Caustics
  float caus = caustic(refUV, t);
  vec3 causCol = vec3(0.08, 0.38, 0.72) * caus * 0.22;

  // Surface foam (height crests)
  float h0 = height(uvA, t);
  float foamAmt = smoothstep(0.028, 0.055, h0);
  vec3 foamCol = foam * foamAmt * 0.6;

  // Combine
  vec3 col = baseCol + specCol + causCol + foamCol + vec3(0.002,0.008,0.025);

  // ── Bright bokeh blobs (simulate depth-of-field water droplets) ───────────
  // Use hash-derived stable positions, animated slowly
  float bokehIntensity = 0.0;
  for (int bi=0; bi<8; bi++) {
    float fi = float(bi);
    vec2 bc = vec2(
      hash1(fi * 3.7 + 0.5) * aspect,
      hash1(fi * 2.3 + 1.1) + sin(t * 0.12 + fi) * 0.04
    );
    float br = 0.04 + hash1(fi*5.1) * 0.10;
    float bBlur = smoothstep(br*1.8, br*0.3, length(uvA-bc));
    bokehIntensity += bBlur * (0.08 + hash1(fi*7.3)*0.12);
  }
  col += vec3(0.3, 0.55, 0.85) * bokehIntensity;

  // ── Large soft glow patches ───────────────────────────────────────────────
  float glow1 = exp(-length(uvA - vec2(aspect*0.25, 0.38)) * 2.8) * 0.18;
  float glow2 = exp(-length(uvA - vec2(aspect*0.72, 0.62)) * 3.5) * 0.10;
  col += vec3(0.05,0.20,0.50) * glow1;
  col += vec3(0.02,0.10,0.35) * glow2;

  // ── Vignette ─────────────────────────────────────────────────────────────
  float vig = smoothstep(0.0,0.5,uv.x)*smoothstep(1.0,0.5,uv.x)
            * smoothstep(0.0,0.4,uv.y)*smoothstep(1.0,0.6,uv.y);
  col *= mix(0.18, 1.0, vig*vig*1.1);

  // ── Top edge darkening ────────────────────────────────────────────────────
  col *= mix(0.45, 1.0, smoothstep(0.0, 0.35, uv.y));

  // ── Tone mapping (Reinhard) ───────────────────────────────────────────────
  col = col / (col + vec3(0.7));
  col = pow(col, vec3(0.88)); // gamma

  gl_FragColor = vec4(col, 1.0);
}
`;

function compileShader(gl: WebGLRenderingContext, type: number, src: string): WebGLShader | null {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

function createProgram(gl: WebGLRenderingContext): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;
  const prog = gl.createProgram();
  if (!prog) return null;
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(prog));
    return null;
  }
  return prog;
}

// Bokeh bubble overlay drawn on a separate 2D canvas
function drawBokeh(ctx: CanvasRenderingContext2D, W: number, H: number, t: number, bubbles: BokehBubble[]) {
  ctx.clearRect(0, 0, W, H);
  for (const b of bubbles) {
    b.y -= b.vy;
    b.x += Math.sin(t * 0.001 * b.drift + b.phase) * 0.3;
    if (b.y < -b.r * 4) {
      b.y = H + b.r * 4;
      b.x = Math.random() * W;
    }

    const alpha = b.alpha * (0.7 + 0.3 * Math.sin(t * 0.002 * b.drift + b.phase));
    const g2 = ctx.createRadialGradient(
      b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.05,
      b.x, b.y, b.r * 1.8
    );
    g2.addColorStop(0, `rgba(180,230,255,${alpha})`);
    g2.addColorStop(0.35, `rgba(100,180,255,${alpha * 0.65})`);
    g2.addColorStop(0.7, `rgba(40,120,200,${alpha * 0.2})`);
    g2.addColorStop(1, "rgba(0,60,150,0)");
    ctx.fillStyle = g2;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.r * 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Rim highlight
    ctx.beginPath();
    ctx.arc(b.x - b.r * 0.25, b.y - b.r * 0.25, b.r * 0.25, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${alpha * 0.8})`;
    ctx.fill();
  }
}

interface BokehBubble {
  x: number; y: number; r: number;
  vy: number; alpha: number; drift: number; phase: number;
}

export function WaterShader({ className = "" }: { className?: string }) {
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const bokehCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const glCanvas = glCanvasRef.current;
    const bokehCanvas = bokehCanvasRef.current;
    if (!glCanvas || !bokehCanvas) return;

    // ── WebGL setup ──────────────────────────────────────────────────────────
    const gl = glCanvas.getContext("webgl", { antialias: false, powerPreference: "high-performance" });
    if (!gl) return; // fallback — page still works without WebGL

    const prog = createProgram(gl);
    if (!prog) return;
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const posLoc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, "u_time");
    const uRes  = gl.getUniformLocation(prog, "u_resolution");

    // ── 2D Bokeh setup ───────────────────────────────────────────────────────
    const ctx2d = bokehCanvas.getContext("2d");
    const BUBBLE_COUNT = 55;
    const bubbles: BokehBubble[] = [];

    function initBubbles(W: number, H: number) {
      bubbles.length = 0;
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        bubbles.push({
          x: Math.random() * W,
          y: Math.random() * H,
          r: 3 + Math.random() * 18,
          vy: 0.15 + Math.random() * 0.5,
          alpha: 0.07 + Math.random() * 0.35,
          drift: 0.5 + Math.random() * 2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    }

    // ── Resize ───────────────────────────────────────────────────────────────
    let W = 0, H = 0;
    function resize() {
      const el = containerRef.current;
      if (!el || !glCanvas || !bokehCanvas || !gl) return;
      W = el.offsetWidth;
      H = el.offsetHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      glCanvas.width  = Math.round(W * dpr);
      glCanvas.height = Math.round(H * dpr);
      glCanvas.style.width  = W + "px";
      glCanvas.style.height = H + "px";
      bokehCanvas.width  = W;
      bokehCanvas.height = H;
      bokehCanvas.style.width  = W + "px";
      bokehCanvas.style.height = H + "px";
      gl.viewport(0, 0, glCanvas.width, glCanvas.height);
      if (bubbles.length === 0) initBubbles(W, H);
    }

    let raf = 0;
    let start = 0;

    function loop(now: number) {
      raf = requestAnimationFrame(loop);
      if (!start) start = now;
      const t = (now - start) * 0.001;

      if (!glCanvas || !bokehCanvas || !gl) return;

      // WebGL water
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, glCanvas.width, glCanvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Bokeh bubbles
      if (ctx2d) drawBokeh(ctx2d, W, H, now, bubbles);
    }

    resize();
    const ro = new ResizeObserver(resize);
    if (containerRef.current) ro.observe(containerRef.current);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* CSS keyframes for crossfade */}
      <style>{`
        @keyframes wf-splash {
          0%,100% { opacity: 0; }
          20%,45% { opacity: 0.55; }
        }
        @keyframes wf-bokeh {
          0%,50%,100% { opacity: 0; }
          65%,85%     { opacity: 0.48; }
        }
      `}</style>

      {/* WebGL water surface — base layer */}
      <canvas
        ref={glCanvasRef}
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      />

      {/* AI-generated water splash — screen blend crossfade */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/water-splash.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
          animation: "wf-splash 16s ease-in-out infinite",
          opacity: 0,
        }}
        aria-hidden="true"
      />
      {/* AI-generated bokeh droplets — offset phase */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "url('/water-bokeh.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          mixBlendMode: "screen",
          animation: "wf-bokeh 16s ease-in-out infinite",
          opacity: 0,
        }}
        aria-hidden="true"
      />

      {/* Bokeh bubble canvas overlay */}
      <canvas
        ref={bokehCanvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        aria-hidden="true"
      />
    </div>
  );
}
