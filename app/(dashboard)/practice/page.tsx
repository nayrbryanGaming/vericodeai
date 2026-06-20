"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Search, CheckCircle2, Play, ChevronDown } from "lucide-react";
import { problems, COMPANIES, TOPICS, type Difficulty } from "@/lib/problems";

const difficulties: (Difficulty | "All")[] = ["All", "Easy", "Medium", "Hard"];
const statuses = ["All", "Solved", "Attempted", "Unsolved"];

const diffStyle: Record<Difficulty, string> = {
  Easy: "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500",
  Medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500",
  Hard: "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500",
};

export default function PracticePage() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("All");
  const [company, setCompany] = useState("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      if (topic !== "All" && p.category !== topic) return false;
      if (company !== "All" && !p.companies.includes(company)) return false;
      if (difficulty !== "All" && p.difficulty !== difficulty) return false;
      if (status !== "All" && p.status !== status.toLowerCase()) return false;
      return true;
    });
  }, [query, topic, company, difficulty, status]);

  const selectCls =
    "appearance-none cursor-pointer pl-3 pr-8 py-2 text-sm bg-card border border-border rounded-lg text-foreground outline-none focus:border-brand transition-colors";

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Practice</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Solve company-wise coding challenges to prep for interviews.</p>
      </div>

      {/* Search + dropdown filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-brand-light focus:border-brand text-sm transition-all"
          />
        </div>
        {[
          { val: company, set: setCompany, opts: ["All", ...COMPANIES], label: "Company" },
          { val: difficulty, set: setDifficulty as (v: string) => void, opts: difficulties, label: "Difficulty" },
          { val: status, set: setStatus, opts: statuses, label: "Status" },
        ].map((f) => (
          <div key={f.label} className="relative">
            <select value={f.val} onChange={(e) => f.set(e.target.value)} className={selectCls}>
              {f.opts.map((o) => (
                <option key={o} value={o}>{o === "All" ? `All ${f.label}` : o}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Topic pills */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              topic === t ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Problem table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">Status</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden md:table-cell">Companies</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Acceptance</th>
              <th className="px-5 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-muted/50 transition-colors group">
                <td className="px-5 py-3.5">
                  {p.status === "solved" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  ) : p.status === "attempted" ? (
                    <Play className="w-5 h-5 text-brand" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-brand/50 transition-colors" />
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <Link href={`/practice/${p.id}`} className="flex flex-col">
                    <span className="text-sm font-medium text-foreground group-hover:text-brand-text transition-colors">
                      {p.id}. {p.title}
                    </span>
                    <span className="text-xs text-muted-foreground">{p.category}</span>
                  </Link>
                </td>
                <td className="px-5 py-3.5 hidden md:table-cell">
                  <div className="flex flex-wrap gap-1">
                    {p.companies.slice(0, 3).map((c) => (
                      <span key={c} className="text-[11px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground">{c}</span>
                    ))}
                    {p.companies.length > 3 && <span className="text-[11px] text-muted-foreground">+{p.companies.length - 3}</span>}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground hidden sm:table-cell">{p.acceptance}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${diffStyle[p.difficulty]}`}>
                    {p.difficulty}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-muted-foreground">
                  No problems match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
