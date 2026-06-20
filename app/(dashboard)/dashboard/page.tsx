"use client";
import { Code2, Flame, Trophy, TrendingUp, CheckCircle2, Circle } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StatCardSkeleton } from "@/components/Skeleton";
import { stagger, fadeUp } from "@/components/motion/Reveal";

export default function DashboardPage() {
  const [userName, setUserName] = useState("Developer");
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState({
    solved: 0,
    projects: 0,
    streak: 0,
    badges: 0
  });

  useEffect(() => {
    // Simulate fetching the user profile/progress. Replace with GET /api/user/me.
    const data = localStorage.getItem("vericode_user");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.name) setUserName(parsed.name);
        if (parsed.progress) setProgress(parsed.progress);
      } catch (e) {}
    }
    const t = setTimeout(() => setLoading(false), 450);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { label: "Problems Solved", value: progress.solved, icon: Code2, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Current Streak", value: `${progress.streak} days`, icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
    { label: "Badges Earned", value: progress.badges, icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Global Rank", value: "Unranked", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  const languageProgress = [
    { lang: "Python", pct: 0, color: "bg-blue-500" },
    { lang: "JavaScript", pct: 0, color: "bg-yellow-500" },
    { lang: "Java", pct: 0, color: "bg-orange-500" },
    { lang: "C++", pct: 0, color: "bg-purple-500" },
  ];

  const todos = [
    { label: "Solve first practice problem", done: false },
    { label: "Setup your profile", done: false },
    { label: "Start a learning track", done: false },
    { label: "Join the community", done: false },
  ];

  const activity: any[] = [
    // Empty activity
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Welcome back, {userName}. Ready to start coding?</p>
      </div>

      {/* Stats grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-card rounded-xl border border-border p-4 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg ${s.bg} flex items-center justify-center mb-3`}>
                <s.icon size={17} className={s.color} />
              </div>
              <div className="text-2xl font-bold text-foreground">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Language progress */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Language Progress</h2>
          <div className="space-y-4">
            {languageProgress.map((l) => (
              <div key={l.lang}>
                <div className="flex items-center justify-between text-sm mb-1.5">
                  <span className="font-medium text-foreground">{l.lang}</span>
                  <span className="text-muted-foreground">{l.pct}%</span>
                </div>
                <div className="h-2 bg-input/30 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${l.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${l.pct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily todos */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Getting Started</h2>
          <div className="space-y-3">
            {todos.map((t) => (
              <div key={t.label} className="flex items-start gap-2.5">
                {t.done ? (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                ) : (
                  <Circle size={16} className="text-muted-foreground shrink-0 mt-0.5" />
                )}
                <span className={`text-sm ${t.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity + category progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Activity feed */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Recent Activity</h2>
          {activity.length === 0 ? (
            <div className="text-sm text-muted-foreground flex items-center justify-center h-24 border border-dashed border-border rounded-lg">
              No activity yet. Start solving problems!
            </div>
          ) : (
            <div className="space-y-3">
              {activity.map((a, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-brand shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground truncate">{a.text}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">{a.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Topic coverage */}
        <div className="bg-card rounded-xl border border-border p-5">
          <h2 className="text-sm font-semibold text-foreground mb-4">Topic Coverage</h2>
          <div className="grid grid-cols-3 gap-2">
            {[
              { topic: "Arrays", pct: 0 },
              { topic: "Strings", pct: 0 },
              { topic: "Trees", pct: 0 },
              { topic: "DP", pct: 0 },
              { topic: "Graphs", pct: 0 },
              { topic: "SQL", pct: 0 },
            ].map((t) => (
              <div key={t.topic} className="flex flex-col items-center p-2.5 rounded-lg border border-border bg-muted/20">
                <div className="relative w-10 h-10">
                  <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="15" fill="none" stroke="currentColor" className="text-border" strokeWidth="3" />
                    <motion.circle
                      cx="18" cy="18" r="15" fill="none"
                      stroke="currentColor" className="text-brand" strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ strokeDasharray: "0 94.2" }}
                      animate={{ strokeDasharray: `${(t.pct / 100) * 94.2} 94.2` }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.3 }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-foreground">
                    {t.pct}%
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1.5">{t.topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
