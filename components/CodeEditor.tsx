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

export function CodeEditor({
  value,
  onChange,
  language,
  height = "100%",
}: {
  value: string;
  onChange: (v: string) => void;
  language: string;
  height?: string;
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const update = () => setIsDark(document.documentElement.classList.contains("dark"));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  // Map our language keys to Monaco language ids.
  const monacoLang = language === "cpp" ? "cpp" : language;

  return (
    <MonacoEditor
      height={height}
      language={monacoLang}
      value={value}
      onChange={(v: string | undefined) => onChange(v ?? "")}
      theme={isDark ? "vs-dark" : "light"}
      options={{
        fontSize: 13,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        padding: { top: 12 },
        fontFamily: "var(--font-mono)",
        smoothScrolling: true,
        automaticLayout: true,
        tabSize: 4,
        lineNumbersMinChars: 3,
      }}
    />
  );
}
