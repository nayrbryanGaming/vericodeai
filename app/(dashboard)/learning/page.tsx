"use client";
// API_KEY: GET /api/learning/resources?category= — returns: Resource[]
// API_KEY: POST /api/learning/bookmark — body: { resourceId }
// API_KEY: POST /api/learning/complete — body: { resourceId }
import { useState } from "react";
import { GraduationCap, Bookmark, ExternalLink, Clock, CheckCircle2, Circle } from "lucide-react";

const categories = ["All", "Programming Basics", "DSA", "Web Development", "Database", "AI/ML Basics", "Interview Prep"];

const sourceStyles: Record<string, string> = {
  GeeksforGeeks: "text-green-500 bg-green-500/10",
  W3Schools: "text-emerald-500 bg-emerald-500/10",
  YouTube: "text-red-500 bg-red-500/10",
  Docs: "text-brand-text bg-brand/10",
};

const resources = [
  { title: "Arrays & Strings Fundamentals", source: "GeeksforGeeks", level: "Beginner", time: "45 min", category: "DSA" },
  { title: "Big-O Notation Explained", source: "YouTube", level: "Beginner", time: "20 min", category: "DSA" },
  { title: "Python Crash Course", source: "W3Schools", level: "Beginner", time: "2 hrs", category: "Programming Basics" },
  { title: "SQL Joins & Indexing", source: "Docs", level: "Intermediate", time: "1 hr", category: "Database" },
  { title: "React Hooks Deep Dive", source: "YouTube", level: "Intermediate", time: "1.5 hrs", category: "Web Development" },
  { title: "Intro to Machine Learning", source: "GeeksforGeeks", level: "Beginner", time: "3 hrs", category: "AI/ML Basics" },
  { title: "System Design for Interviews", source: "Docs", level: "Advanced", time: "4 hrs", category: "Interview Prep" },
  { title: "Dynamic Programming Patterns", source: "GeeksforGeeks", level: "Advanced", time: "2.5 hrs", category: "DSA" },
];

export default function LearningPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const filtered = activeCategory === "All" ? resources : resources.filter((r) => r.category === activeCategory);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Learning</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Curated resources from trusted sources — beginner to interview-ready.</p>
        </div>
      </div>

      {/* Progress banner */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-brand/15 flex items-center justify-center shrink-0">
          <GraduationCap className="w-6 h-6 text-brand" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between text-sm mb-1.5">
            <span className="font-medium text-foreground">Your learning progress</span>
            <span className="text-muted-foreground">0 / {resources.length} completed</span>
          </div>
          <div className="h-2 bg-input/40 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full" style={{ width: "0%" }} />
          </div>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setActiveCategory(c)}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeCategory === c ? "bg-foreground text-background" : "bg-card border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Resource grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((r) => (
          <div key={r.title} className="group bg-card border border-border rounded-xl p-5 hover:border-brand/40 transition-colors flex flex-col">
            <div className="flex items-start justify-between mb-3">
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${sourceStyles[r.source]}`}>{r.source}</span>
              {/* TODO (backend): POST /api/learning/bookmark */}
              <button className="text-muted-foreground hover:text-brand transition-colors">
                <Bookmark size={15} />
              </button>
            </div>
            <h3 className="text-sm font-semibold text-foreground leading-snug">{r.title}</h3>
            <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded bg-muted">{r.level}</span>
              <span className="flex items-center gap-1"><Clock size={11} /> {r.time}</span>
            </div>
            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
              <a href="#" className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium text-brand-text hover:opacity-80 transition-opacity">
                <ExternalLink size={12} /> Open resource
              </a>
              {/* TODO (backend): POST /api/learning/complete */}
              <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-green-500 transition-colors">
                <Circle size={13} /> Mark done
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
