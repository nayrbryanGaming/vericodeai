"use client";
import { cn } from "@/lib/utils";
import { Code2 } from "lucide-react";
import { useEffect, useState } from "react";

const contributionData = (() => {
  const weeks: Array<Array<{ count: number }>> = [];
  for (let w = 0; w < 52; w++) {
    const days = [];
    for (let d = 0; d < 7; d++) {
      days.push({ count: 0 }); // Zeroed out
    }
    weeks.push(days);
  }
  return weeks;
})();

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Track your coding journey and problem-solving patterns.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Activity Heatmap</h2>
            <div className="flex justify-between items-end mb-6">
              <div>
                <div className="text-2xl font-bold text-foreground">0</div>
                <div className="text-sm text-muted-foreground">submissions in the past year</div>
              </div>
              <div className="text-sm text-muted-foreground">
                Max streak: <span className="font-semibold text-foreground">0 days</span>
              </div>
            </div>

            <div className="overflow-x-auto pb-4 scrollbar-thin">
              <div className="flex gap-1 min-w-max">
                {contributionData.map((week, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    {week.map((day, j) => (
                      <div
                        key={j}
                        className={cn(
                          "w-3 h-3 rounded-sm",
                          "bg-input/20 border border-input/30"
                        )}
                        title={`0 submissions`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground justify-end">
              <span>Less</span>
              <div className="w-3 h-3 rounded-sm bg-input/20 border border-input/30" />
              <div className="w-3 h-3 rounded-sm bg-brand-light" />
              <div className="w-3 h-3 rounded-sm bg-brand opacity-60" />
              <div className="w-3 h-3 rounded-sm bg-brand opacity-80" />
              <div className="w-3 h-3 rounded-sm bg-brand text-brand-foreground" />
              <span>More</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Difficulty Distribution</h2>
              <div className="flex gap-8 items-center">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-input/30" strokeWidth="4" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xl font-bold text-foreground">0</span>
                    <span className="text-[10px] text-muted-foreground uppercase">Solved</span>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-green-500 font-medium">Easy</span>
                      <span className="text-foreground">0 <span className="text-muted-foreground">/ 142</span></span>
                    </div>
                    <div className="h-1.5 bg-input/30 rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-yellow-500 font-medium">Medium</span>
                      <span className="text-foreground">0 <span className="text-muted-foreground">/ 250</span></span>
                    </div>
                    <div className="h-1.5 bg-input/30 rounded-full"></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-red-500 font-medium">Hard</span>
                      <span className="text-foreground">0 <span className="text-muted-foreground">/ 86</span></span>
                    </div>
                    <div className="h-1.5 bg-input/30 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-5">
              <h2 className="text-sm font-semibold text-foreground mb-4">Acceptance Rate</h2>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-foreground mb-1">0%</div>
                  <div className="text-sm text-muted-foreground">0 / 0 submissions</div>
                </div>
                <Code2 className="w-10 h-10 text-input/50" />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Recent Skills</h2>
            <div className="flex flex-wrap gap-2">
              {["Arrays", "Hash Table", "Strings"].map((skill) => (
                <span key={skill} className="px-3 py-1 bg-muted text-foreground text-xs font-medium rounded-lg border border-border">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-xl border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-4">Language Stats</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-sm text-foreground">Python</span>
                </div>
                <span className="text-sm font-medium text-foreground">0 <span className="text-muted-foreground font-normal">probs</span></span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <span className="text-sm text-foreground">JavaScript</span>
                </div>
                <span className="text-sm font-medium text-foreground">0 <span className="text-muted-foreground font-normal">probs</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
