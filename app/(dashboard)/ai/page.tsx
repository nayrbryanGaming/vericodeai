"use client";
// API_KEY: POST /api/ai/chat — body: { message, mode, history } — returns: streamed { token }
// API_KEY: GET /api/ai/conversations — returns: Conversation[]
// API_KEY: DELETE /api/ai/conversations/{id}
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Sparkles, Send, Plus, Bug, Code2, FileText, Wand2,
  Lightbulb, MessageSquare, Search, User, Mic, Globe,
  ChevronDown, Copy, ThumbsUp, ThumbsDown, RotateCcw,
  Paperclip, Zap,
} from "lucide-react";
import { VideoBackground } from "@/components/ui/VideoBackground";

const HEADLINES = [
  "Ask anything to VeriCode AI,",
  "Debug your code instantly,",
  "Generate a React component,",
  "Explain algorithms clearly,",
  "Prepare for your interview,",
  "Analyze your dataset now,",
];

const STARTER_PROMPTS = [
  { icon: Lightbulb, label: "Summarize the key points of quantum computing", color: "#f59e0b" },
  { icon: FileText,  label: "Draft a privacy policy for my mobile app",      color: "#6366f1" },
  { icon: Bug,       label: "Analyze this customer dataset and find trends",  color: "#22d3ee" },
  { icon: Code2,     label: "Generate a React component for a pricing table", color: "#22c55e" },
];

const MAIN_MODES = [
  { id: "general", label: "General", icon: Globe },
  { id: "code",    label: "Code",    icon: Code2  },
];

const AI_MODES = [
  { id: "explain",   label: "Explain Code",     icon: Lightbulb     },
  { id: "debug",     label: "Debug Error",       icon: Bug           },
  { id: "generate",  label: "Generate Code",     icon: Code2         },
  { id: "improve",   label: "Improve Code",      icon: Wand2         },
  { id: "project",   label: "Project Guidance",  icon: FileText      },
  { id: "interview", label: "Interview Prep",    icon: MessageSquare },
];

// Pre-computed to avoid SSR/hydration mismatch
const WATER_PARTICLES = [
  { x: 8,  size: 3,   delay: 0.0, dur: 6.2, opacity: 0.22 },
  { x: 17, size: 4.5, delay: 1.3, dur: 7.8, opacity: 0.17 },
  { x: 24, size: 2,   delay: 2.7, dur: 5.4, opacity: 0.30 },
  { x: 33, size: 5,   delay: 0.5, dur: 8.1, opacity: 0.15 },
  { x: 41, size: 3.5, delay: 3.2, dur: 6.9, opacity: 0.25 },
  { x: 52, size: 2.5, delay: 1.8, dur: 7.3, opacity: 0.20 },
  { x: 60, size: 4,   delay: 4.1, dur: 5.8, opacity: 0.18 },
  { x: 68, size: 3,   delay: 0.9, dur: 9.0, opacity: 0.28 },
  { x: 75, size: 5.5, delay: 2.4, dur: 6.5, opacity: 0.14 },
  { x: 82, size: 2,   delay: 3.7, dur: 7.1, opacity: 0.32 },
  { x: 90, size: 4,   delay: 1.1, dur: 8.4, opacity: 0.19 },
  { x: 95, size: 3,   delay: 5.0, dur: 5.6, opacity: 0.24 },
  { x: 13, size: 2.5, delay: 6.2, dur: 7.0, opacity: 0.16 },
  { x: 47, size: 3.5, delay: 4.8, dur: 8.7, opacity: 0.21 },
  { x: 57, size: 2,   delay: 7.3, dur: 6.3, opacity: 0.27 },
];

const BOKEH_ORBS = [
  { size: 380, x: 12, y: 22, color: "rgba(56,140,255,0.11)",  delay: 0,  dur: 20 },
  { size: 240, x: 72, y: 58, color: "rgba(139,92,246,0.09)",  delay: 4,  dur: 26 },
  { size: 300, x: 42, y: 78, color: "rgba(34,211,238,0.07)",  delay: 8,  dur: 22 },
  { size: 200, x: 85, y: 20, color: "rgba(99,102,241,0.11)",  delay: 2,  dur: 18 },
  { size: 160, x: 22, y: 85, color: "rgba(56,189,248,0.08)",  delay: 6,  dur: 24 },
  { size: 280, x: 58, y: 35, color: "rgba(167,139,250,0.07)", delay: 10, dur: 30 },
];

interface Msg { role: "user" | "assistant"; content: string; id: string }

function demoReply(mode: string, prompt: string): string {
  const intros: Record<string, string> = {
    explain:   "Here's a clear breakdown:",
    debug:     "Let me trace through the issue step by step:",
    generate:  "Here's an implementation you can build upon:",
    improve:   "A few targeted refactors will tighten this up significantly:",
    project:   "Here's a suggested architecture for your project:",
    interview: "Here's how I'd approach this in a technical interview:",
    general:   "Great question — here's my analysis:",
    code:      "Here's the code solution with inline explanations:",
  };
  return `${intros[mode] ?? "Here's my take:"}\n\nYou asked about: "${prompt.slice(0, 100)}"\n\nThis is a live streaming demo rendered token-by-token. Connect the VeriCode AI backend at /api/ai/chat to unlock real context-aware answers with syntax highlighting, code execution, conversation memory, and full server-sent event streaming.\n\n**Key capabilities:**\n• Context-aware multi-language code analysis\n• Real-time syntax highlighted responses\n• Persistent conversation history\n• Export to GitHub Gist`;
}

// ── Bokeh orbs floating behind everything ─────────────────────────────────────
function BokehOrbs() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {BOKEH_ORBS.map((orb, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width:  orb.size,
            height: orb.size,
            left:  `${orb.x}%`,
            top:   `${orb.y}%`,
            transform: "translate(-50%,-50%)",
            borderRadius: "50%",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(50px)",
            animation: `bk${i} ${orb.dur}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Water drop particles ──────────────────────────────────────────────────────
function WaterParticles() {
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
      {WATER_PARTICLES.map((p, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left:   `${p.x}%`,
            top:    "-12px",
            width:  `${p.size}px`,
            height: `${p.size * 2.4}px`,
            borderRadius: "50% 50% 50% 50% / 28% 28% 72% 72%",
            background: `rgba(120,200,255,${p.opacity})`,
            boxShadow: `0 0 ${p.size * 2}px rgba(100,180,255,${p.opacity * 0.6})`,
            filter: "blur(0.8px)",
            animation: `wdrop ${p.dur}s linear infinite`,
            animationDelay: `${p.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

// ── Typing headline with gradient text ────────────────────────────────────────
function TypingHeadline() {
  const [idx,   setIdx]   = useState(0);
  const [text,  setText]  = useState("");
  const [phase, setPhase] = useState<"type" | "pause" | "erase">("type");

  useEffect(() => {
    const target = HEADLINES[idx];
    let t: ReturnType<typeof setTimeout>;

    if (phase === "type") {
      if (text.length < target.length) {
        t = setTimeout(() => setText(target.slice(0, text.length + 1)), 50);
      } else {
        t = setTimeout(() => setPhase("pause"), 2500);
      }
    } else if (phase === "pause") {
      t = setTimeout(() => setPhase("erase"), 100);
    } else {
      if (text.length > 0) {
        t = setTimeout(() => setText(text.slice(0, -1)), 28);
      } else {
        setIdx(i => (i + 1) % HEADLINES.length);
        setPhase("type");
      }
    }
    return () => clearTimeout(t);
  }, [text, phase, idx]);

  return (
    <h1
      style={{
        fontSize: "clamp(1.75rem, 3.2vw, 2.75rem)",
        fontWeight: 700,
        letterSpacing: "-0.025em",
        background: "linear-gradient(135deg, #ffffff 20%, #93c5fd 55%, #c4b5fd 85%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        backgroundClip: "text",
        filter: "drop-shadow(0 0 28px rgba(96,165,250,0.35))",
        lineHeight: 1.2,
        textAlign: "center",
        minHeight: "1.25em",
      }}
    >
      {text}
      <span
        style={{
          display: "inline-block",
          width: "3px",
          height: "0.82em",
          verticalAlign: "middle",
          marginLeft: "4px",
          background: "linear-gradient(180deg, #60a5fa, #a78bfa)",
          boxShadow: "0 0 14px #60a5fa, 0 0 32px rgba(96,165,250,0.45)",
          borderRadius: "2px",
          animation: "vc-blink 0.85s steps(1) infinite",
          WebkitTextFillColor: "initial",
        }}
      />
    </h1>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function MessageBubble({ msg, isLast, streaming }: { msg: Msg; isLast: boolean; streaming: boolean }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex gap-3 group ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
        style={{
          background: isUser ? "rgba(99,102,241,0.22)" : "rgba(34,211,238,0.15)",
          border:     `1px solid ${isUser ? "rgba(99,102,241,0.45)" : "rgba(34,211,238,0.35)"}`,
          boxShadow:  isUser ? "0 0 14px rgba(99,102,241,0.3)" : "0 0 14px rgba(34,211,238,0.2)",
        }}
      >
        {isUser
          ? <User     size={14} style={{ color: "#818cf8" }} />
          : <Sparkles size={14} style={{ color: "#22d3ee" }} />}
      </div>

      <div className={`flex-1 min-w-0 ${isUser ? "flex flex-col items-end" : ""}`}>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.38)", marginBottom: "4px", fontWeight: 500 }}>
          {isUser ? "You" : "VeriCode AI"}
        </p>
        <div
          style={{
            maxWidth: "85%",
            borderRadius: isUser ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            padding: "10px 16px",
            fontSize: "14px",
            lineHeight: "1.65",
            whiteSpace: "pre-wrap",
            color: isUser ? "#e2e8f0" : "#d1e8ff",
            background: isUser
              ? "linear-gradient(135deg, rgba(99,102,241,0.28), rgba(139,92,246,0.22))"
              : "rgba(255,255,255,0.05)",
            border: isUser ? "1px solid rgba(99,102,241,0.4)" : "1px solid rgba(255,255,255,0.09)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            boxShadow: isUser
              ? "0 4px 24px rgba(99,102,241,0.2)"
              : "0 4px 16px rgba(0,0,0,0.25)",
          }}
        >
          {msg.content}
          {streaming && isLast && !isUser && (
            <span
              style={{
                display: "inline-block", width: "2px", height: "14px",
                marginLeft: "3px", verticalAlign: "middle",
                background: "#22d3ee", boxShadow: "0 0 8px #22d3ee",
                animation: "vc-blink 0.7s steps(1) infinite",
              }}
            />
          )}
        </div>

        {!isUser && !streaming && (
          <div className="flex gap-1 mt-1.5 opacity-0 group-hover:opacity-100" style={{ transition: "opacity 0.2s" }}>
            {[{ I: Copy, t: "Copy" }, { I: ThumbsUp, t: "Good" }, { I: ThumbsDown, t: "Bad" }, { I: RotateCcw, t: "Retry" }].map(({ I, t }) => (
              <button
                key={t} title={t}
                style={{ color: "rgba(255,255,255,0.28)", padding: "4px", borderRadius: "6px", background: "none", border: "none", cursor: "pointer" }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.7)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.28)")}
              >
                <I size={12} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Glass input panel — the main "kaca buram" effect ─────────────────────────
interface InputPanelProps {
  input: string; streaming: boolean; activeMode: string; activeAIMode: string;
  showModeMenu: boolean; textRef: React.RefObject<HTMLTextAreaElement | null>;
  onInput: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSend: () => void; onModeChange: (id: string) => void;
  onAIModeChange: (id: string) => void; onToggleModeMenu: () => void;
  compact?: boolean; focused?: boolean; onFocus?: () => void; onBlur?: () => void;
}

function GlassInputPanel({
  input, streaming, activeMode, activeAIMode, showModeMenu,
  textRef, onInput, onKeyDown, onSend, onModeChange, onAIModeChange,
  onToggleModeMenu, compact = false, focused = false, onFocus, onBlur,
}: InputPanelProps) {
  const sendActive = input.trim().length > 0 && !streaming;

  return (
    <div style={{ position: "relative", borderRadius: "22px" }}>
      {/* Outer animated glow ring */}
      <div
        style={{
          position: "absolute",
          inset: "-1.5px",
          borderRadius: "23px",
          background: focused
            ? "linear-gradient(135deg, rgba(56,140,255,0.8), rgba(139,92,246,0.7), rgba(34,211,238,0.6), rgba(56,140,255,0.8))"
            : "linear-gradient(135deg, rgba(56,140,255,0.25), rgba(139,92,246,0.20), rgba(34,211,238,0.15), rgba(56,140,255,0.25))",
          backgroundSize: "300% 300%",
          animation: focused ? "ring-spin 3s linear infinite" : "ring-idle 5s ease-in-out infinite",
          opacity: focused ? 1 : 0.7,
          transition: "opacity 0.4s ease",
          zIndex: 0,
        }}
      />
      {/* Soft outer glow blur */}
      <div
        style={{
          position: "absolute",
          inset: "-6px",
          borderRadius: "28px",
          background: focused
            ? "linear-gradient(135deg, rgba(56,140,255,0.18), rgba(139,92,246,0.14), rgba(34,211,238,0.12))"
            : "linear-gradient(135deg, rgba(56,140,255,0.06), rgba(139,92,246,0.05))",
          filter: "blur(8px)",
          transition: "all 0.5s ease",
          zIndex: 0,
        }}
      />

      {/* The actual glass panel */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          // Real frosted glass: less tinted, more transparent so background shows
          background: "rgba(5, 14, 38, 0.42)",
          backdropFilter: "blur(44px) saturate(210%) brightness(1.08)",
          WebkitBackdropFilter: "blur(44px) saturate(210%) brightness(1.08)",
          border: "1px solid rgba(255,255,255,0.20)",
          borderTop: "1px solid rgba(255,255,255,0.32)",
          borderRadius: "22px",
          boxShadow: focused
            ? [
                "0 12px 80px rgba(0,0,0,0.60)",
                "0 0 0 0px rgba(255,255,255,0.08) inset",
                "0 1px 0 rgba(255,255,255,0.30) inset",
                "0 0 70px rgba(56,140,255,0.12) inset",
              ].join(", ")
            : [
                "0 8px 64px rgba(0,0,0,0.55)",
                "0 0 0 0px rgba(255,255,255,0.06) inset",
                "0 1px 0 rgba(255,255,255,0.22) inset",
              ].join(", "),
          overflow: "hidden",
          transition: "box-shadow 0.4s ease, border-color 0.4s ease",
        }}
      >
        {/* Top shimmer sliding highlight */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 30%, rgba(180,210,255,0.8) 50%, rgba(255,255,255,0.6) 70%, transparent 100%)",
            animation: "shimmer-top 4s ease-in-out infinite",
            zIndex: 2,
          }}
        />

        {/* Frosted glass inner highlight — left edge */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "1px",
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0.05) 50%, transparent)",
            zIndex: 2,
          }}
        />

        {/* Mode tabs */}
        {!compact && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2px",
              padding: "12px 16px 0",
              borderBottom: "1px solid rgba(255,255,255,0.09)",
            }}
          >
            {MAIN_MODES.map((m) => {
              const Icon = m.icon;
              const active = activeMode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => onModeChange(m.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: "6px",
                    padding: "8px 16px",
                    fontSize: "13px", fontWeight: 500,
                    background: active ? "rgba(96,165,250,0.10)" : "none",
                    border: "none",
                    borderRadius: "10px 10px 0 0",
                    borderBottom: active ? "2px solid #60a5fa" : "2px solid transparent",
                    color: active ? "#93c5fd" : "rgba(255,255,255,0.40)",
                    cursor: "pointer",
                    transition: "all 0.18s",
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.color = "rgba(255,255,255,0.40)"; }}
                >
                  <Icon size={14} />
                  {m.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Textarea */}
        <div style={{ padding: compact ? "12px 16px 4px" : "16px 16px 4px" }}>
          <textarea
            ref={textRef}
            value={input}
            onChange={onInput}
            onKeyDown={onKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            rows={1}
            placeholder="Ask VeriCode AI to build apps, analyze data, or brainstorm ideas..."
            style={{
              width: "100%", resize: "none", background: "none", border: "none", outline: "none",
              fontSize: "14px", lineHeight: "1.65",
              color: "rgba(255,255,255,0.92)",
              caretColor: "#60a5fa",
              minHeight: compact ? "40px" : "56px",
              maxHeight: "160px",
              fontFamily: "inherit",
            }}
          />
        </div>

        {/* Bottom toolbar */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "4px 12px 14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconBtn title="Attach file"><Paperclip size={16} /></IconBtn>

            <div style={{ position: "relative" }}>
              <button
                onClick={onToggleModeMenu}
                style={{
                  display: "flex", alignItems: "center", gap: "5px",
                  padding: "4px 10px", borderRadius: "20px",
                  fontSize: "11px", fontWeight: 600,
                  background: "rgba(99,102,241,0.16)",
                  border: "1px solid rgba(99,102,241,0.28)",
                  color: "#a5b4fc", cursor: "pointer",
                  backdropFilter: "blur(12px)",
                  transition: "all 0.18s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(99,102,241,0.26)"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(99,102,241,0.16)"; }}
              >
                <Zap size={11} />
                {AI_MODES.find(m => m.id === activeAIMode)?.label}
                <ChevronDown size={11} />
              </button>

              {showModeMenu && (
                <div
                  style={{
                    position: "absolute",
                    bottom: "calc(100% + 8px)",
                    left: 0,
                    minWidth: "175px",
                    background: "rgba(3, 8, 24, 0.94)",
                    backdropFilter: "blur(36px) saturate(200%)",
                    WebkitBackdropFilter: "blur(36px) saturate(200%)",
                    border: "1px solid rgba(255,255,255,0.13)",
                    borderTop: "1px solid rgba(255,255,255,0.22)",
                    borderRadius: "14px",
                    padding: "6px",
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(56,140,255,0.08) inset",
                    zIndex: 60,
                  }}
                >
                  {AI_MODES.map((m) => {
                    const Icon = m.icon;
                    const active = activeAIMode === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => onAIModeChange(m.id)}
                        style={{
                          width: "100%", display: "flex", alignItems: "center", gap: "8px",
                          padding: "8px 10px", borderRadius: "8px", fontSize: "13px",
                          background: active ? "rgba(96,165,250,0.14)" : "none",
                          border: "none",
                          color: active ? "#60a5fa" : "rgba(255,255,255,0.58)",
                          cursor: "pointer", textAlign: "left",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "none"; }}
                      >
                        <Icon size={14} />
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <IconBtn title="Voice input"><Mic size={16} /></IconBtn>
            <button
              onClick={onSend}
              disabled={!sendActive}
              title="Send"
              style={{
                width: "36px", height: "36px",
                borderRadius: "50%",
                display: "flex", alignItems: "center", justifyContent: "center",
                border: "none",
                cursor: sendActive ? "pointer" : "default",
                opacity: sendActive ? 1 : 0.28,
                background: sendActive
                  ? "linear-gradient(135deg, #2563eb, #7c3aed)"
                  : "rgba(255,255,255,0.10)",
                boxShadow: sendActive
                  ? "0 0 20px rgba(96,165,250,0.55), 0 0 40px rgba(96,165,250,0.20), 0 2px 8px rgba(0,0,0,0.4)"
                  : "none",
                transition: "all 0.25s",
                animation: sendActive ? "send-pulse 2.2s ease-in-out infinite" : "none",
              }}
            >
              <Send size={15} style={{ color: "#fff", marginLeft: "1px" }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <button
      title={title}
      style={{
        width: "32px", height: "32px", borderRadius: "8px",
        display: "flex", alignItems: "center", justifyContent: "center",
        border: "none", background: "none",
        color: "rgba(255,255,255,0.30)", cursor: "pointer",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { e.currentTarget.style.color = "rgba(255,255,255,0.72)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
      onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.30)"; e.currentTarget.style.background = "none"; }}
    >
      {children}
    </button>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function AIAssistancePage() {
  const [activeMode,   setActiveMode]   = useState("general");
  const [activeAIMode, setActiveAIMode] = useState("explain");
  const [input,        setInput]        = useState("");
  const [messages,     setMessages]     = useState<Msg[]>([]);
  const [streaming,    setStreaming]     = useState(false);
  const [showModeMenu, setShowModeMenu] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const textRef   = useRef<HTMLTextAreaElement>(null);
  const idRef     = useRef(0);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = useCallback(async (text: string) => {
    const prompt = text.trim();
    if (!prompt || streaming) return;
    setInput("");
    if (textRef.current) textRef.current.style.height = "auto";

    setMessages(m => [...m, { role: "user", content: prompt, id: `u-${++idRef.current}` }]);
    setStreaming(true);

    const full = demoReply(activeAIMode, prompt);
    const aId  = `a-${++idRef.current}`;
    setMessages(m => [...m, { role: "assistant", content: "", id: aId }]);

    for (const tok of full.split(/(\s+)/)) {
      await new Promise(r => setTimeout(r, 16));
      setMessages(m => {
        const c = [...m];
        const l = c[c.length - 1];
        c[c.length - 1] = { ...l, content: l.content + tok };
        return c;
      });
    }
    setStreaming(false);
  }, [streaming, activeAIMode]);

  function handleInput(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px";
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  const hasChat = messages.length > 0;

  const inputProps = {
    input, streaming, activeMode, activeAIMode, showModeMenu, textRef,
    onInput:          handleInput,
    onKeyDown:        handleKeyDown,
    onSend:           () => send(input),
    onModeChange:     setActiveMode,
    onAIModeChange:   (id: string) => { setActiveAIMode(id); setShowModeMenu(false); },
    onToggleModeMenu: () => setShowModeMenu(v => !v),
    focused:  inputFocused,
    onFocus:  () => setInputFocused(true),
    onBlur:   () => setInputFocused(false),
  };

  return (
    <>
      {/* ── Keyframes ── */}
      <style>{`
        @keyframes vc-blink   { 0%,49%{opacity:1} 50%,100%{opacity:0} }
        @keyframes vc-fadein  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:none} }

        /* Animated gradient border ring */
        @keyframes ring-spin {
          0%   { background-position: 0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes ring-idle {
          0%,100% { opacity: 0.55; }
          50%     { opacity: 0.85; }
        }

        /* Glass top shimmer */
        @keyframes shimmer-top {
          0%   { opacity: 0; transform: translateX(-120%); }
          15%  { opacity: 1; }
          85%  { opacity: 1; }
          100% { opacity: 0; transform: translateX(220%); }
        }

        /* Send button pulse */
        @keyframes send-pulse {
          0%,100% { box-shadow: 0 0 20px rgba(96,165,250,.55), 0 0 40px rgba(96,165,250,.20), 0 2px 8px rgba(0,0,0,.4); }
          50%     { box-shadow: 0 0 28px rgba(96,165,250,.80), 0 0 56px rgba(96,165,250,.35), 0 2px 8px rgba(0,0,0,.4); }
        }

        /* Water droplet fall */
        @keyframes wdrop {
          0%   { transform: translateY(-12px); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 0.7; }
          100% { transform: translateY(100vh); opacity: 0; }
        }

        /* Bokeh per-orb floats */
        @keyframes bk0 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 33%{transform:translate(-44%,-62%) scale(1.14)} 66%{transform:translate(-57%,-44%) scale(0.91)} }
        @keyframes bk1 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 40%{transform:translate(-62%,-56%) scale(1.20)} 70%{transform:translate(-44%,-61%) scale(0.86)} }
        @keyframes bk2 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 50%{transform:translate(-56%,-41%) scale(1.10)} }
        @keyframes bk3 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 35%{transform:translate(-42%,-60%) scale(1.17)} 75%{transform:translate(-59%,-46%) scale(0.88)} }
        @keyframes bk4 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 45%{transform:translate(-56%,-59%) scale(1.12)} 80%{transform:translate(-48%,-43%) scale(0.93)} }
        @keyframes bk5 { 0%,100%{transform:translate(-50%,-50%) scale(1)} 30%{transform:translate(-60%,-52%) scale(1.08)} 70%{transform:translate(-45%,-58%) scale(0.95)} }

        /* Hero ambient glow behind input */
        @keyframes hero-glow {
          0%,100% { opacity:.28; transform:translateY(0) scale(1); }
          50%     { opacity:.46; transform:translateY(-18px) scale(1.12); }
        }

        /* Chip entrance */
        @keyframes chip-in {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── Fixed video + effect layers ── */}
      <div
        style={{
          position: "fixed", inset: 0,
          left: "256px", top: "64px",
          zIndex: 0, pointerEvents: "none",
        }}
      >
        <VideoBackground src="/videos/bg1.mp4" playbackRate={0.33} />

        {/* Depth overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,5,20,0.28) 0%, rgba(0,5,20,0.08) 40%, rgba(0,5,20,0.48) 100%)" }} />
        {/* Edge vignette */}
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,0,0.65) 100%)" }} />

        <BokehOrbs />
        <WaterParticles />
      </div>

      {/* ── Layout ── */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", height: "calc(100vh - 4rem)" }}>

        {/* ── Conversation sidebar ── */}
        <aside
          className="hidden lg:flex"
          style={{
            width: "220px", flexShrink: 0, flexDirection: "column",
            background: "rgba(2, 6, 20, 0.78)",
            backdropFilter: "blur(36px) saturate(170%)",
            WebkitBackdropFilter: "blur(36px) saturate(170%)",
            borderRight: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ padding: "12px", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <button
              onClick={() => { setMessages([]); setStreaming(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                padding: "10px", borderRadius: "12px", fontSize: "13px", fontWeight: 600,
                background: "linear-gradient(135deg, rgba(99,102,241,0.26), rgba(139,92,246,0.18))",
                border: "1px solid rgba(99,102,241,0.34)", color: "#c4b5fd", cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.40), rgba(139,92,246,0.30))")}
              onMouseLeave={e => (e.currentTarget.style.background = "linear-gradient(135deg, rgba(99,102,241,0.26), rgba(139,92,246,0.18))")}
            >
              <Plus size={14} /> New chat
            </button>
          </div>

          <div style={{ padding: "8px 12px" }}>
            <div style={{ position: "relative" }}>
              <Search size={14} style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: "rgba(255,255,255,0.28)" }} />
              <input
                placeholder="Search chats..."
                style={{
                  width: "100%", paddingLeft: "30px", paddingRight: "8px",
                  paddingTop: "6px", paddingBottom: "6px",
                  borderRadius: "10px", fontSize: "12px",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  color: "rgba(255,255,255,0.7)", outline: "none", boxSizing: "border-box",
                }}
                onFocus={e => (e.currentTarget.style.borderColor = "rgba(99,102,241,0.5)")}
                onBlur={e  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)")}
              />
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "4px 8px 8px" }}>
            {hasChat ? (
              <div>
                <p style={{ padding: "6px 8px", fontSize: "10px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(255,255,255,0.28)" }}>Today</p>
                <button
                  style={{
                    width: "100%", textAlign: "left", padding: "8px", borderRadius: "10px", fontSize: "12px",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    background: "rgba(99,102,241,0.14)", border: "1px solid rgba(99,102,241,0.22)",
                    color: "#c4b5fd", cursor: "pointer",
                  }}
                >
                  {messages[0]?.content.slice(0, 35)}…
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", padding: "0 12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px", background: "rgba(255,255,255,0.03)", border: "1px dashed rgba(255,255,255,0.10)" }}>
                  <MessageSquare size={18} style={{ color: "rgba(255,255,255,0.18)" }} />
                </div>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.22)" }}>No conversations yet.</p>
              </div>
            )}
          </div>
        </aside>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* HERO — when no chat */}
          {!hasChat && (
            <div
              style={{
                flex: 1,
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                padding: "24px 24px 32px",
                animation: "vc-fadein 0.65s cubic-bezier(0.21,0.5,0.3,1)",
              }}
            >
              {/* Ambient glow orb behind input */}
              <div
                style={{
                  position: "absolute",
                  width: "560px", height: "280px",
                  background: "radial-gradient(ellipse, rgba(56,140,255,0.07) 0%, rgba(99,102,241,0.04) 40%, transparent 70%)",
                  filter: "blur(48px)",
                  animation: "hero-glow 7s ease-in-out infinite",
                  pointerEvents: "none",
                }}
              />

              {/* Typing headline */}
              <div
                style={{
                  marginBottom: "30px", maxWidth: "700px", width: "100%",
                  animation: "vc-fadein 0.55s cubic-bezier(0.21,0.5,0.3,1)",
                }}
              >
                <TypingHeadline />
              </div>

              {/* Glass input */}
              <div
                style={{
                  width: "100%", maxWidth: "700px",
                  animation: "vc-fadein 0.65s cubic-bezier(0.21,0.5,0.3,1) 0.08s both",
                }}
              >
                <GlassInputPanel {...inputProps} />
              </div>

              {/* Starter prompts */}
              <div style={{ marginTop: "22px", width: "100%", maxWidth: "700px" }}>
                <p
                  style={{
                    textAlign: "center", fontSize: "12px", marginBottom: "13px",
                    color: "rgba(255,255,255,0.30)",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                    animation: "vc-fadein 0.7s ease-out 0.18s both",
                    letterSpacing: "0.02em",
                  }}
                >
                  Not sure where to start? Try these
                  <span style={{ fontSize: "13px", opacity: 0.65 }}>✦</span>
                </p>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "9px" }}>
                  {STARTER_PROMPTS.map((s, i) => {
                    const Icon = s.icon;
                    return (
                      <button
                        key={s.label}
                        onClick={() => send(s.label)}
                        style={{
                          display: "flex", alignItems: "center", gap: "10px",
                          padding: "12px 14px", borderRadius: "14px",
                          fontSize: "12px", textAlign: "left",
                          background: "rgba(255,255,255,0.04)",
                          backdropFilter: "blur(28px) saturate(170%)",
                          WebkitBackdropFilter: "blur(28px) saturate(170%)",
                          border: "1px solid rgba(255,255,255,0.09)",
                          borderLeft: `3px solid ${s.color}50`,
                          color: "rgba(255,255,255,0.58)",
                          cursor: "pointer",
                          transition: "all 0.22s cubic-bezier(0.21,0.5,0.3,1)",
                          animation: `chip-in 0.5s ease-out ${0.22 + i * 0.07}s both`,
                        }}
                        onMouseEnter={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
                          e.currentTarget.style.borderColor = `${s.color}55`;
                          e.currentTarget.style.borderLeftColor = `${s.color}cc`;
                          e.currentTarget.style.color = "rgba(255,255,255,0.88)";
                          e.currentTarget.style.transform = "translateY(-2px)";
                          e.currentTarget.style.boxShadow = `0 8px 28px ${s.color}18`;
                        }}
                        onMouseLeave={e => {
                          e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                          e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)";
                          e.currentTarget.style.borderLeftColor = `${s.color}50`;
                          e.currentTarget.style.color = "rgba(255,255,255,0.58)";
                          e.currentTarget.style.transform = "translateY(0)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        <div
                          style={{
                            width: "28px", height: "28px", borderRadius: "8px", flexShrink: 0,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            background: `${s.color}15`,
                            border: `1px solid ${s.color}28`,
                          }}
                        >
                          <Icon size={14} style={{ color: s.color }} />
                        </div>
                        {s.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* CHAT — messages */}
          {hasChat && (
            <div
              ref={scrollRef}
              style={{
                flex: 1, overflowY: "auto", padding: "24px",
                display: "flex", flexDirection: "column", gap: "20px",
                scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.10) transparent",
              }}
            >
              {messages.map((m, i) => (
                <MessageBubble key={m.id} msg={m} isLast={i === messages.length - 1} streaming={streaming} />
              ))}
            </div>
          )}

          {/* Sticky bottom input (chat mode) */}
          {hasChat && (
            <div
              style={{
                padding: "8px 24px 16px",
                background: "linear-gradient(to top, rgba(0,5,22,0.88) 0%, transparent 100%)",
              }}
            >
              <div style={{ display: "flex", gap: "6px", marginBottom: "8px" }}>
                {MAIN_MODES.map(m => {
                  const Icon = m.icon;
                  const active = activeMode === m.id;
                  return (
                    <button
                      key={m.id}
                      onClick={() => setActiveMode(m.id)}
                      style={{
                        display: "flex", alignItems: "center", gap: "5px",
                        padding: "5px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: 500,
                        cursor: "pointer", transition: "all 0.15s",
                        background: active ? "rgba(96,165,250,0.16)" : "rgba(255,255,255,0.05)",
                        border: active ? "1px solid rgba(96,165,250,0.38)" : "1px solid rgba(255,255,255,0.08)",
                        color: active ? "#60a5fa" : "rgba(255,255,255,0.38)",
                        backdropFilter: "blur(14px)",
                      }}
                    >
                      <Icon size={12} />
                      {m.label}
                    </button>
                  );
                })}
              </div>

              <GlassInputPanel {...inputProps} compact />
              <p style={{ textAlign: "center", fontSize: "10px", marginTop: "6px", color: "rgba(255,255,255,0.17)" }}>
                VeriCode AI can make mistakes. Verify important information.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
