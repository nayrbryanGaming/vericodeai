"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Skeleton } from "./Skeleton";

// Monaco loads its core from a CDN at runtime — keeps the bundle small and avoids
// native build dependencies. ssr:false because Monaco needs the DOM/web workers.
const MonacoEditor = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full rounded-none" />,
});

// Map the human-readable labels used in Settings → Monaco theme ids.
const THEME_ID: Record<string, string> = {
  "VS Dark": "vs-dark",
  "GitHub Light": "github-light",
  Monokai: "monokai",
  Dracula: "dracula",
  Solarized: "solarized-dark",
};

// Register the non-built-in themes once Monaco is available.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function defineThemes(monaco: any) {
  monaco.editor.defineTheme("github-light", {
    base: "vs", inherit: true,
    rules: [
      { token: "comment", foreground: "6a737d" },
      { token: "keyword", foreground: "d73a49" },
      { token: "string", foreground: "032f62" },
      { token: "number", foreground: "005cc5" },
    ],
    colors: { "editor.background": "#ffffff" },
  });
  monaco.editor.defineTheme("monokai", {
    base: "vs-dark", inherit: true,
    rules: [
      { token: "comment", foreground: "75715e" },
      { token: "keyword", foreground: "f92672" },
      { token: "string", foreground: "e6db74" },
      { token: "number", foreground: "ae81ff" },
    ],
    colors: { "editor.background": "#272822" },
  });
  monaco.editor.defineTheme("dracula", {
    base: "vs-dark", inherit: true,
    rules: [
      { token: "comment", foreground: "6272a4" },
      { token: "keyword", foreground: "ff79c6" },
      { token: "string", foreground: "f1fa8c" },
      { token: "number", foreground: "bd93f9" },
    ],
    colors: { "editor.background": "#282a36" },
  });
  monaco.editor.defineTheme("solarized-dark", {
    base: "vs-dark", inherit: true,
    rules: [
      { token: "comment", foreground: "586e75" },
      { token: "keyword", foreground: "859900" },
      { token: "string", foreground: "2aa198" },
      { token: "number", foreground: "d33682" },
    ],
    colors: { "editor.background": "#002b36" },
  });
}

export function CodeEditor({
  value,
  onChange,
  language,
  height = "100%",
  editorTheme,
  fontSize,
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  height?: string;
  /** Theme label (e.g. "Monokai"). Falls back to the saved preference, then app theme. */
  editorTheme?: string;
  /** Font size in px. Falls back to the saved preference, then 13. */
  fontSize?: number;
}) {
  const [isDark, setIsDark] = useState(true);
  const [savedTheme, setSavedTheme] = useState<string | null>(null);
  const [savedFont, setSavedFont] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    // Read persisted editor preferences (set on the Settings → Appearance page).
    setSavedTheme(localStorage.getItem("vericode-editor-theme"));
    const f = localStorage.getItem("vericode-editor-font");
    if (f) setSavedFont(parseInt(f, 10));

    return () => observer.disconnect();
  }, []);

  const monacoLang = language === "cpp" ? "cpp" : language;
  const label = editorTheme ?? savedTheme ?? (isDark ? "VS Dark" : "GitHub Light");
  const theme = THEME_ID[label] ?? (isDark ? "vs-dark" : "vs");
  const size = fontSize ?? savedFont ?? 13;

  return (
    <MonacoEditor
      height={height}
      language={monacoLang}
      value={value}
      onChange={(v: string | undefined) => onChange(v ?? "")}
      theme={theme}
      beforeMount={defineThemes}
      options={{
        fontSize: size,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        fontFamily: "var(--font-mono)",
        smoothScrolling: true,
        automaticLayout: true,
        tabSize: 4,
        lineNumbersMinChars: 3,
        readOnly: onChange === noop,
      }}
    />
  );
}

// Sentinel so a read-only preview can pass an inert onChange.
export const noop = () => {};
