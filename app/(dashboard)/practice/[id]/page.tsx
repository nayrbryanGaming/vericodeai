"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowLeft, Play, Check, Lightbulb, Loader2, Terminal, RotateCcw } from "lucide-react";
import { CodeEditor } from "@/components/CodeEditor";
import { getProblem, LANGUAGES, LANGUAGE_LABELS, type Language, type Difficulty } from "@/lib/problems";

const diffStyle: Record<Difficulty, string> = {
  Easy: "bg-green-500/10 text-green-500",
  Medium: "bg-yellow-500/10 text-yellow-500",
  Hard: "bg-red-500/10 text-red-500",
};

type RunResult = { ok: boolean; lines: string[] } | null;

export default function ProblemDetailPage() {
  const params = useParams();
  const id = Number(params.id);
  const problem = useMemo(() => getProblem(id), [id]);

  const [language, setLanguage] = useState<Language>("python");
  const [code, setCode] = useState(problem?.starter.python ?? "");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<RunResult>(null);
  const [showHint, setShowHint] = useState(false);

  if (!problem) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h1 className="text-xl font-bold text-foreground">Problem not found</h1>
        <Link href="/practice" className="text-brand-text hover:underline text-sm mt-2 inline-block">← Back to Practice</Link>
      </div>
    );
  }

  function changeLanguage(lang: Language) {
    setLanguage(lang);
    setCode(problem!.starter[lang] ?? "");
    setResult(null);
  }

  function resetCode() {
    setCode(problem!.starter[language] ?? "");
    setResult(null);
  }

  async function run() {
    // TODO (backend): POST /api/problems/{id}/run — body: { language, code } — returns test output
    setRunning(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 900));
    setRunning(false);
    setResult({
      ok: true,
      lines: [
        `Running ${problem!.examples.length} sample test case(s)...`,
        ...problem!.examples.map((ex, i) => `Case ${i + 1}: input ${ex.input}  →  expected ${ex.output}`),
        "",
        "⚠ Connect the execution backend (/api/problems/{id}/run) to evaluate your code.",
      ],
    });
  }

  async function submit() {
    // TODO (backend): POST /api/problems/{id}/submit — body: { language, code }
    setSubmitting(true);
    setResult(null);
    await new Promise((r) => setTimeout(r, 1100));
    setSubmitting(false);
    setResult({
      ok: false,
      lines: ["Submission received.", "⚠ Wire up /api/problems/{id}/submit to grade against the full test suite."],
    });
  }

  return (
    <div className="h-[calc(100vh-7rem)] flex flex-col gap-3">
      <Link href="/practice" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground w-fit">
        <ArrowLeft size={15} /> Back to Practice
      </Link>

      <div className="flex-1 flex flex-col lg:flex-row gap-3 min-h-0">
        {/* Left: problem statement */}
        <div className="lg:w-2/5 bg-card border border-border rounded-xl overflow-y-auto scrollbar-thin p-5 space-y-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-lg font-bold text-foreground">{problem.id}. {problem.title}</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${diffStyle[problem.difficulty]}`}>
                {problem.difficulty}
              </span>
              <span className="text-xs text-muted-foreground">Acceptance {problem.acceptance}</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{problem.category}</span>
            </div>
          </div>

          <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-line">{problem.statement}</p>

          <div className="space-y-3">
            {problem.examples.map((ex, i) => (
              <div key={i} className="bg-muted/40 border border-border rounded-lg p-3">
                <p className="text-xs font-semibold text-foreground mb-1.5">Example {i + 1}</p>
                <p className="text-xs font-mono text-muted-foreground"><span className="text-foreground">Input:</span> {ex.input}</p>
                <p className="text-xs font-mono text-muted-foreground"><span className="text-foreground">Output:</span> {ex.output}</p>
                {ex.explanation && <p className="text-xs text-muted-foreground mt-1"><span className="text-foreground">Explanation:</span> {ex.explanation}</p>}
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Constraints</p>
            <ul className="space-y-1">
              {problem.constraints.map((c) => (
                <li key={c} className="text-xs text-muted-foreground font-mono">• {c}</li>
              ))}
            </ul>
          </div>

          {/* Companies */}
          <div>
            <p className="text-xs font-semibold text-foreground mb-2">Asked at</p>
            <div className="flex flex-wrap gap-1.5">
              {problem.companies.map((c) => (
                <span key={c} className="text-[11px] px-2 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
              ))}
            </div>
          </div>

          {/* AI Hint */}
          <div className="border border-brand/20 bg-brand/5 rounded-lg p-3">
            <button onClick={() => setShowHint((s) => !s)} className="flex items-center gap-2 text-sm font-medium text-brand-text">
              <Lightbulb size={15} /> {showHint ? "Hide hint" : "Get an AI hint"}
            </button>
            {showHint && <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{problem.hint}</p>}
          </div>
        </div>

        {/* Right: editor + console */}
        <div className="flex-1 flex flex-col gap-3 min-h-0">
          <div className="flex-1 bg-card border border-border rounded-xl flex flex-col overflow-hidden min-h-[260px]">
            <div className="h-11 border-b border-border flex items-center justify-between px-3 shrink-0">
              <div className="flex items-center gap-1">
                {LANGUAGES.map((l) => (
                  <button
                    key={l}
                    onClick={() => changeLanguage(l)}
                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                      language === l ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {LANGUAGE_LABELS[l]}
                  </button>
                ))}
              </div>
              <button onClick={resetCode} title="Reset code" className="p-1.5 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors">
                <RotateCcw size={14} />
              </button>
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor value={code} onChange={setCode} language={language} />
            </div>
          </div>

          {/* Console output */}
          <div className="bg-card border border-border rounded-xl shrink-0">
            <div className="h-10 border-b border-border flex items-center justify-between px-3">
              <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Terminal size={13} /> Console
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={run}
                  disabled={running || submitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-muted text-foreground rounded-lg hover:bg-secondary transition-colors disabled:opacity-50"
                >
                  {running ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />} Run
                </button>
                <button
                  onClick={submit}
                  disabled={running || submitting}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-brand text-brand-foreground rounded-lg hover:bg-brand-text transition-colors disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />} Submit
                </button>
              </div>
            </div>
            <div className="p-3 max-h-40 overflow-y-auto scrollbar-thin">
              {result ? (
                <pre className="text-xs font-mono whitespace-pre-wrap text-muted-foreground leading-relaxed">{result.lines.join("\n")}</pre>
              ) : (
                <p className="text-xs text-muted-foreground/70">Run your code to see sample test output here.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
