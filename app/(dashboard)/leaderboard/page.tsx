"use client";
import { useState, useEffect } from "react";
import { Medal } from "lucide-react";

const periods = ["Daily", "Weekly", "Monthly", "All Time"];
const types = ["Global", "College", "Company"];

export default function LeaderboardPage() {
  const [activePeriod, setActivePeriod] = useState("Weekly");
  const [activeType, setActiveType] = useState("Global");
  const [userName, setUserName] = useState("Developer");

  useEffect(() => {
    const data = localStorage.getItem("vericode_user");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.name) setUserName(parsed.name);
      } catch (e) {}
    }
  }, []);

  return (
    <div className="max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">See how you rank against other developers.</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setActivePeriod(p)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activePeriod === p
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        
        <div className="flex gap-1 bg-muted/50 p-1 rounded-lg w-fit">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setActiveType(t)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeType === t
                  ? "bg-foreground text-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
        <div className="order-2 md:order-1 flex flex-col items-center bg-card rounded-xl border border-border p-6 mt-8 relative">
          <div className="absolute -top-6 bg-slate-200 w-12 h-12 rounded-full flex items-center justify-center border-4 border-card text-slate-600 font-bold">2</div>
          <div className="w-16 h-16 rounded-full bg-slate-700 text-slate-100 flex items-center justify-center text-xl font-bold mb-3 mt-4">
            P
          </div>
          <h3 className="font-bold text-foreground">Priya Patel</h3>
          <p className="text-xs text-muted-foreground">@priya_p</p>
          <div className="mt-3 text-lg font-bold text-brand">9,210 <span className="text-xs font-normal text-muted-foreground">pts</span></div>
        </div>
        
        <div className="order-1 md:order-2 flex flex-col items-center bg-brand/5 rounded-xl border border-brand/20 p-6 relative">
          <div className="absolute -top-6 bg-yellow-400 w-14 h-14 rounded-full flex items-center justify-center border-4 border-card shadow-lg text-yellow-900 font-bold">1</div>
          <Medal className="absolute top-4 right-4 text-yellow-500 w-6 h-6" />
          <div className="w-20 h-20 rounded-full bg-yellow-500 text-yellow-900 flex items-center justify-center text-2xl font-bold mb-3 mt-4">
            A
          </div>
          <h3 className="font-bold text-foreground text-lg">Arjun Sharma</h3>
          <p className="text-xs text-muted-foreground">@arjun_s</p>
          <div className="mt-3 text-xl font-bold text-brand">9,820 <span className="text-xs font-normal text-muted-foreground">pts</span></div>
        </div>

        <div className="order-3 md:order-3 flex flex-col items-center bg-card rounded-xl border border-border p-6 mt-12 relative">
          <div className="absolute -top-6 bg-amber-600 w-10 h-10 rounded-full flex items-center justify-center border-4 border-card text-amber-50 font-bold">3</div>
          <div className="w-14 h-14 rounded-full bg-amber-700 text-amber-50 flex items-center justify-center text-lg font-bold mb-3 mt-2">
            R
          </div>
          <h3 className="font-bold text-foreground">Rohan Gupta</h3>
          <p className="text-xs text-muted-foreground">@rohan_g</p>
          <div className="mt-3 text-base font-bold text-brand">8,890 <span className="text-xs font-normal text-muted-foreground">pts</span></div>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted/30">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-16">#</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Developer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr className="bg-brand/5 border-l-4 border-l-brand">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-muted-foreground">-</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center text-xs font-bold">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{userName} (You)</span>
                    <span className="text-xs text-muted-foreground">Unranked</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-foreground">0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
