"use client";
import { useState, useEffect } from "react";
import { Search, Filter, ChevronRight, Play, CheckCircle2, Lock } from "lucide-react";

const problems = [
  { id: 1, title: "Two Sum", difficulty: "Easy", category: "Arrays", status: "unsolved", acceptance: "49.2%" },
  { id: 2, title: "Add Two Numbers", difficulty: "Medium", category: "Linked List", status: "unsolved", acceptance: "40.1%" },
  { id: 3, title: "Longest Substring Without Repeating Characters", difficulty: "Medium", category: "Strings", status: "unsolved", acceptance: "33.8%" },
  { id: 4, title: "Median of Two Sorted Arrays", difficulty: "Hard", category: "Arrays", status: "unsolved", acceptance: "36.6%" },
  { id: 5, title: "Longest Palindromic Substring", difficulty: "Medium", category: "Strings", status: "unsolved", acceptance: "32.4%" },
  { id: 6, title: "Zigzag Conversion", difficulty: "Medium", category: "Strings", status: "unsolved", acceptance: "44.9%" },
  { id: 7, title: "Reverse Integer", difficulty: "Medium", category: "Math", status: "unsolved", acceptance: "27.4%" },
  { id: 8, title: "String to Integer (atoi)", difficulty: "Medium", category: "Strings", status: "unsolved", acceptance: "16.7%" },
  { id: 9, title: "Palindrome Number", difficulty: "Easy", category: "Math", status: "unsolved", acceptance: "53.5%" },
  { id: 10, title: "Regular Expression Matching", difficulty: "Hard", category: "Strings", status: "unsolved", acceptance: "28.0%" },
];

const categories = ["All", "Arrays", "Strings", "Linked List", "Math", "DP", "Trees"];

export default function PracticePage() {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Practice Problems</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Solve coding challenges to improve your skills.</p>
        </div>
      </div>

      <div className="flex gap-4">
        {/* Main problem list */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search problems..."
                className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-card text-foreground focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === c
                    ? "bg-foreground text-background"
                    : "bg-card border border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/30">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acceptance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Difficulty</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {problems.map((p) => (
                  <tr key={p.id} className="hover:bg-muted/50 cursor-pointer transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {p.status === "solved" ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      ) : p.status === "attempted" ? (
                        <Play className="w-5 h-5 text-brand" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-border group-hover:border-brand/50 transition-colors" />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-foreground group-hover:text-brand transition-colors">
                          {p.id}. {p.title}
                        </span>
                        <span className="text-xs text-muted-foreground">{p.category}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {p.acceptance}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        p.difficulty === "Easy" ? "bg-green-100 text-green-800 dark:bg-green-500/10 dark:text-green-500" :
                        p.difficulty === "Medium" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-500/10 dark:text-yellow-500" :
                        "bg-red-100 text-red-800 dark:bg-red-500/10 dark:text-red-500"
                      }`}>
                        {p.difficulty}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 shrink-0 space-y-4">
          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-4">Study Plan</h3>
            <div className="space-y-4">
              <div className="relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-r from-brand to-purple-600 rounded-lg blur opacity-25 group-hover:opacity-40 transition-opacity" />
                <div className="relative bg-card border border-border p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-foreground">Top Interview 150</h4>
                    <p className="text-xs text-muted-foreground mt-1">0/150 Solved</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
              </div>

              <div className="relative group cursor-not-allowed opacity-75">
                <div className="relative bg-muted border border-border p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                      <h4 className="font-bold text-foreground">System Design</h4>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Premium Plan Only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h3 className="font-semibold text-foreground mb-3">Session Progress</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Easy</span>
              <span className="text-sm font-medium text-foreground">0/42</span>
            </div>
            <div className="h-2 bg-input/30 rounded-full mb-4">
              <div className="h-full bg-green-500 rounded-full" style={{ width: "0%" }} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Medium</span>
              <span className="text-sm font-medium text-foreground">0/104</span>
            </div>
            <div className="h-2 bg-input/30 rounded-full mb-4">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: "0%" }} />
            </div>

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Hard</span>
              <span className="text-sm font-medium text-foreground">0/34</span>
            </div>
            <div className="h-2 bg-input/30 rounded-full">
              <div className="h-full bg-red-500 rounded-full" style={{ width: "0%" }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
