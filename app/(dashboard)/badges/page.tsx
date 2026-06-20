"use client";
// API_KEY: GET /api/user/badges — returns: Badge[] { id, name, description, condition, progress, unlocked, earnedAt }
import { motion } from "framer-motion";
import { Award, Trophy, Flame, Code2, Sparkles, Rocket, Target, Lock, Brain } from "lucide-react";
import { Counter } from "@/components/motion/Counter";
import { TiltCard } from "@/components/TiltCard";
import { stagger, fadeUp } from "@/components/motion/Reveal";

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

  const summary = [
    { label: "Badges Earned", value: unlocked, suffix: ` / ${badges.length}`, icon: Award, cls: "text-brand bg-brand/10" },
    { label: "Current Streak", value: 0, suffix: " days", icon: Flame, cls: "text-orange-500 bg-orange-500/10" },
    { label: "Total Points", value: 0, suffix: "", icon: Trophy, cls: "text-yellow-500 bg-yellow-500/10" },
  ];

  return (
    <div className="max-w-6xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Badges</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Earn achievements as you learn, practice, and build.</p>
      </div>

      {/* Summary */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {summary.map((s) => (
          <motion.div key={s.label} variants={fadeUp} whileHover={{ y: -4 }} className="bg-card border border-border rounded-xl p-4 hover:border-brand/30 transition-colors">
            <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${s.cls}`}>
              <s.icon size={17} />
            </div>
            <div className="text-2xl font-bold text-foreground">
              <Counter value={s.value} suffix={s.suffix} />
            </div>
            <div className="text-xs text-muted-foreground mt-0.5">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Badge grid */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {badges.map((b) => {
          const earned = b.progress >= 100;
          return (
            <motion.div key={b.name} variants={fadeUp}>
              <TiltCard className="h-full rounded-xl">
                <div className={`group relative h-full overflow-hidden bg-card border rounded-xl p-5 text-center transition-colors ${earned ? "border-brand/40 brand-glow" : "border-border hover:border-brand/20"}`}>
                  {/* sheen sweep on hover */}
                  <div className="pointer-events-none absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
                  <div className={`mx-auto w-14 h-14 rounded-2xl flex items-center justify-center mb-3 ${earned ? "bg-gradient-to-br from-brand/25 to-accent-violet/25 text-brand" : "bg-muted text-muted-foreground"}`}>
                    {earned ? <b.icon size={26} /> : <Lock size={22} />}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">{b.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1 leading-snug">{b.desc}</p>
                  <div className="mt-3">
                    <div className="h-1.5 bg-input/40 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-brand rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${b.progress}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">{earned ? "Unlocked" : `${b.progress}% complete`}</p>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
