"use client";
// API_KEY: POST /api/ai/chat — body: { message, mode, history } — returns: streamed { token }
// API_KEY: GET /api/ai/conversations — returns: Conversation[]
// API_KEY: DELETE /api/ai/conversations/{id}
import { useEffect, useRef, useState } from "react";
import { Sparkles, Send, Plus, Bug, Code2, FileText, Wand2, Lightbulb, MessageSquare, Search, User } from "lucide-react";

const modes = [
  { id: "explain", label: "Explain Code", icon: Lightbulb },
  { id: "debug", label: "Debug Error", icon: Bug },
  { id: "generate", label: "Generate Code", icon: Code2 },
  { id: "improve", label: "Improve Code", icon: Wand2 },
  { id: "project", label: "Project Guidance", icon: FileText },
  { id: "interview", label: "Interview Prep", icon: MessageSquare },
];

const starters = [
  "Explain how a hash map works under the hood",
  "Debug my recursive fibonacci function",
  "Generate a REST API in Express with auth",
  "Review this code for time complexity",
];

interface Msg { role: "user" | "assistant"; content: string }

// Front-end demo response. Replace with a streamed fetch to /api/ai/chat.
function demoReply(mode: string, prompt: string): string {
  const intro: Record<string, string> = {
    explain: "Here's a clear breakdown:",
    debug: "Let's trace the bug step by step:",
    generate: "Here's an implementation you can build on:",
    improve: "A few refactors will tighten this up:",
    project: "Here's a suggested architecture:",
    interview: "Here's how I'd approach this in an interview:",
  };
  return `${intro[mode] ?? "Here's my take:"} you asked about "${prompt.slice(0, 80)}". \n\nThis is a demo response streamed on the client. Connect the VeriCode AI backend at /api/ai/chat to get real, context-aware answers with syntax-highlighted code, follow-ups, and saved history.`;
}

export default function AIAssistancePage() {
  const [activeMode, setActiveMode] = useState("explain");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, streaming]);

  async function send(text: string) {
    const prompt = text.trim();
    if (!prompt || streaming) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", content: prompt }]);
    setStreaming(true);

    // Simulate token-by-token streaming. Swap for a ReadableStream from /api/ai/chat.
    const full = demoReply(activeMode, prompt);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);
    const tokens = full.split(/(\s+)/);
    for (const tok of tokens) {
      await new Promise((r) => setTimeout(r, 18));
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = { role: "assistant", content: copy[copy.length - 1].content + tok };
        return copy;
      });
    }
    setStreaming(false);
  }

  const hasChat = messages.length > 0;

  return (
    <div className="flex gap-4 h-[calc(100vh-7rem)] max-w-7xl">
      {/* Left: conversation history */}
      <aside className="w-64 shrink-0 bg-card border border-border rounded-xl flex-col hidden lg:flex">
        <div className="p-3 border-b border-border">
          <button
            onClick={() => setMessages([])}
            className="w-full flex items-center justify-center gap-2 bg-brand text-brand-foreground text-sm font-medium py-2 rounded-lg hover:bg-brand-text transition-colors"
          >
            <Plus size={15} /> New chat
          </button>
        </div>
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input placeholder="Search chats..." className="w-full pl-8 pr-2 py-1.5 text-xs bg-background border border-border rounded-lg text-foreground outline-none focus:border-brand transition-colors" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin px-2">
          {hasChat ? (
            <div className="px-2 py-2 rounded-lg bg-muted/50 text-xs text-foreground truncate">
              {messages[0].content}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 text-muted-foreground">
              <MessageSquare className="w-8 h-8 mb-2 opacity-40" />
              <p className="text-xs">No conversations yet.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Center: chat area */}
      <div className="flex-1 bg-card border border-border rounded-xl flex flex-col min-w-0">
        <div className="px-5 h-14 border-b border-border flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-brand/15 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-brand" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground leading-tight">AI Assistance</h1>
            <p className="text-[11px] text-muted-foreground leading-tight">Powered by VeriCode AI</p>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
          {!hasChat ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand/20 to-accent-violet/20 flex items-center justify-center mb-4">
                <Sparkles className="w-7 h-7 text-brand" />
              </div>
              <h2 className="text-lg font-bold text-foreground">How can I help you code today?</h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-md">Ask me to explain concepts, debug errors, generate code, or prep for interviews.</p>
              <div className="grid sm:grid-cols-2 gap-2 mt-6 w-full max-w-lg">
                {starters.map((s) => (
                  <button key={s} onClick={() => send(s)} className="text-left text-xs text-foreground bg-background border border-border rounded-lg p-3 hover:border-brand/50 hover:bg-muted/50 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-5 space-y-5">
              {messages.map((m, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${m.role === "user" ? "bg-muted text-foreground" : "bg-brand/15 text-brand"}`}>
                    {m.role === "user" ? <User size={14} /> : <Sparkles size={14} />}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-xs font-medium text-muted-foreground mb-1">{m.role === "user" ? "You" : "VeriCode AI"}</p>
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                      {m.content}
                      {streaming && i === messages.length - 1 && <span className="inline-block w-1.5 h-4 bg-brand ml-0.5 animate-pulse align-middle" />}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Mode selector + input */}
        <div className="border-t border-border p-3 space-y-2.5 shrink-0">
          <div className="flex gap-1.5 overflow-x-auto scrollbar-thin pb-1">
            {modes.map((m) => (
              <button
                key={m.id}
                onClick={() => setActiveMode(m.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-medium border transition-colors ${
                  activeMode === m.id ? "bg-brand/10 border-brand/40 text-brand-text" : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                <m.icon size={12} /> {m.label}
              </button>
            ))}
          </div>
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send(input);
                }
              }}
              rows={1}
              placeholder="Ask anything, or paste code / an error log..."
              className="flex-1 resize-none px-3 py-2.5 text-sm bg-background border border-border rounded-lg text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all max-h-32"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || streaming}
              className="shrink-0 w-10 h-10 flex items-center justify-center bg-brand text-brand-foreground rounded-lg hover:bg-brand-text transition-colors disabled:opacity-40"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
