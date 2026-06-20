"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Sparkles,
  Code2,
  GraduationCap,
  FolderKanban,
  LineChart,
  Award,
  Trophy,
  Users,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { Logo } from "../Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Sparkles, label: "AI Assistance", href: "/ai" },
  { icon: Code2, label: "Practice", href: "/practice" },
  { icon: GraduationCap, label: "Learning", href: "/learning" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
  { icon: Award, label: "Badges", href: "/badges" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Users, label: "Community", href: "/community" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    localStorage.setItem("vericode-theme", next ? "dark" : "light");
    setIsDark(next);
  }

  function handleLogout() {
    localStorage.removeItem("vericode_user");
    router.push("/login");
  }

  return (
    <aside className="w-64 border-r border-border bg-sidebar-bg flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Logo size="sm" />
      </div>

      <nav className="flex-1 py-5 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand-text font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-[18px] h-[18px] ${isActive ? "text-brand" : ""}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Upgrade card */}
      <div className="px-3 pb-2">
        <div className="bg-gradient-to-br from-brand/10 to-accent-violet/10 rounded-xl p-4 border border-brand/20">
          <h4 className="font-semibold text-foreground text-sm">VeriCode Pro</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Unlock AI mock interviews and system design tracks.</p>
          <button className="w-full bg-brand text-brand-foreground text-xs font-bold py-2 rounded-lg hover:bg-brand-text transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>

      {/* Bottom controls — matches reference design */}
      <div className="p-3 border-t border-border space-y-0.5">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
        >
          {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
          {isDark ? "Light theme" : "Dark theme"}
        </button>
        <Link
          href="/settings"
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
            pathname.startsWith("/settings")
              ? "bg-brand/10 text-brand-text font-medium"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Settings className="w-[18px] h-[18px]" />
          Settings
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
        >
          <LogOut className="w-[18px] h-[18px]" />
          Log out
        </button>
      </div>
    </aside>
  );
}
