"use client";
// API_KEY: PATCH /api/user/preferences — body: { theme, fontSize, language }
import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const themes = [
  { id: "light", label: "Light", preview: "bg-white border-zinc-200" },
  { id: "dark", label: "Dark", preview: "bg-zinc-900 border-zinc-700" },
  { id: "system", label: "System", preview: "bg-gradient-to-r from-white to-zinc-900 border-zinc-400" },
];

const fontSizes = ["12px", "13px", "14px", "15px", "16px"];
const editorThemes = ["VS Dark", "GitHub Light", "Monokai", "Dracula", "Solarized"];

function applyTheme(id: string) {
  const root = document.documentElement;
  const dark = id === "dark" || (id === "system" && window.matchMedia("(prefers-color-scheme:dark)").matches);
  root.classList.toggle("dark", dark);
  localStorage.setItem("vericode-theme", id === "system" ? "system" : dark ? "dark" : "light");
}

function applyEditorFontSize(size: string) {
  // Exposed as a CSS variable so any code editor / preview can pick it up.
  document.documentElement.style.setProperty("--editor-font-size", size);
}

export default function AppearancePage() {
  const [theme, setTheme] = useState("dark");
  const [fontSize, setFontSize] = useState("14px");
  const [editorTheme, setEditorTheme] = useState("VS Dark");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("vericode-theme");
    setTheme(stored || "dark");

    const storedFont = localStorage.getItem("vericode-editor-font");
    if (storedFont) {
      setFontSize(storedFont);
      applyEditorFontSize(storedFont);
    }
    const storedEditorTheme = localStorage.getItem("vericode-editor-theme");
    if (storedEditorTheme) setEditorTheme(storedEditorTheme);
  }, []);

  function choose(id: string) {
    setTheme(id);
    applyTheme(id);
    setSaved(false);
  }

  function chooseFontSize(size: string) {
    setFontSize(size);
    applyEditorFontSize(size);
    localStorage.setItem("vericode-editor-font", size);
    setSaved(false);
  }

  function chooseEditorTheme(t: string) {
    setEditorTheme(t);
    localStorage.setItem("vericode-editor-theme", t);
    setSaved(false);
  }

  async function handleSave() {
    // Persisted locally so preferences survive reloads.
    localStorage.setItem("vericode-editor-font", fontSize);
    localStorage.setItem("vericode-editor-theme", editorTheme);
    // TODO (backend): PATCH /api/user/preferences with { theme, fontSize, editorTheme }
    await new Promise((r) => setTimeout(r, 400));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Theme */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-1">Theme</h2>
        <p className="text-xs text-muted-foreground mb-4">VeriCode AI is dark by default for a focused, developer-first feel.</p>
        <div className="grid grid-cols-3 gap-3">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => choose(t.id)}
              className={cn(
                "relative flex flex-col gap-2 p-3 rounded-xl border-2 transition-all",
                theme === t.id ? "border-brand" : "border-border hover:border-muted-foreground/40"
              )}
            >
              <div className={cn("h-12 rounded-lg border", t.preview)} />
              <span className="text-xs font-medium text-foreground">{t.label}</span>
              {theme === t.id && (
                <div className="absolute top-2 right-2 w-4 h-4 bg-brand rounded-full flex items-center justify-center">
                  <Check size={10} className="text-brand-foreground" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Code editor */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Code Editor</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Editor theme</label>
            <div className="flex flex-wrap gap-2">
              {editorThemes.map((t) => (
                <button
                  key={t}
                  onClick={() => chooseEditorTheme(t)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                    editorTheme === t ? "border-brand bg-brand-light text-brand-text" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Font size</label>
            <div className="flex flex-wrap gap-2">
              {fontSizes.map((f) => (
                <button
                  key={f}
                  onClick={() => chooseFontSize(f)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
                    fontSize === f ? "border-brand bg-brand-light text-brand-text" : "border-border text-muted-foreground hover:text-foreground hover:border-muted-foreground/40"
                  )}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-text transition-colors"
      >
        {saved && <Check size={14} />}
        {saved ? "Saved!" : "Save preferences"}
      </button>
    </div>
  );
}
