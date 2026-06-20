"use client";
// API_KEY: GET /api/user/badges — returns: Badge[] { id, name, description, condition, progress, unlocked, earnedAt }
import { Award, Trophy, Flame, Code2, Sparkles, Rocket, Target, Lock, Brain } from "lucide-react";

const badges = [
  { name: "First Problem Solved", desc: "Solve your first coding problem.", icon: Code2, progress: 0 },
  { name: "10 Problems Solved", desc: "Solve 10 coding problems.", icon: Target, progress: 0 },
  { name: "Java Beginner", desc: "Complete beginner Java practice.", icon: Code2, progress: 0 },
  { name: "Python Master", desc: "Complete advanced Python problems.", icon: Brain, progress: 0 },
  { name: "7-Day Streak", desc: "Practice 7 continuous days.", icon: Flame, progress: 0 },
  { name: "AI Explorer", desc: "Use AI Assistance multiple times.", icon: Sparkles, progress: 0 },
  { name: "Project Builder", desc: "Complete a project plan or docs.", icon: Rocket, progress: 0 },
  { name: "Interview Ready", desc: "Finish company-wise prep milestones.", icon: Trophy, progress: 0 },
];

export default function BadgesPage() {
  const unlocked = badges.filter((b) => b.progress >= 100).length;

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Badges</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Earn achievements as you learn, practice, and build.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Badges Earned", value: `${unlocked} / ${badges.length}`, icon: Award, cls: "text-brand bg-brand/10" },
          { label: "Current Streak", value: "0 days", icon: Flame, cls: "text-orange-500 bg-orange-500/10" },
          { label: "Total Points", value: "0", icon: Trophy, cls: "text-yellow-500 bg-yellow-500/10" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-4">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.cls}`}>
              <s.icon size={17} />
            </div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Badge grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b) => {
          const earned = b.progress >= 100;
          return (
            <div
              key={b.name}
              className={`relative bg-card border rounded-xl p-5 text-center transition-colors ${
                earned ? "border-brand/40 brand-glow" : "border-border"
              }`}
            >
              <div
                className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${
                  earned ? "bg-gradient-to-br from-brand/25 to-accent-violet/25 text-brand" : "bg-muted text-muted-foreground"
                }`}
              >
                {earned ? <b.icon size={26} /> : <Lock size={22} />}
              </div>
              <h3 className="text-sm font-semibold text-foreground">{b.name}</h3>
              <p className="text-xs text-muted-foreground mt-1 leading-snug">{b.desc}</p>
              <div className="mt-3">
                <div className="h-1.5 bg-input/40 rounded-full overflow-hidden">
                  <div className="h-full bg-brand rounded-full transition-all" style={{ width: `${b.progress}%` }} />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1.5">{earned ? "Unlocked" : `${b.progress}% complete`}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
