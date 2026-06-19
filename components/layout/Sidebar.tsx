"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Code2, LineChart, Trophy, Users, FolderKanban } from "lucide-react";
import { Logo } from "../Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: FolderKanban, label: "Projects", href: "/projects" },
  { icon: Code2, label: "Practice", href: "/practice" },
  { icon: LineChart, label: "Analytics", href: "/analytics" },
  { icon: Trophy, label: "Leaderboard", href: "/leaderboard" },
  { icon: Users, label: "Community", href: "/community" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-border bg-sidebar-bg flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-border bg-background">
        <Logo size="sm" />
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-brand/10 text-brand-text font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-brand" : "text-muted-foreground"}`} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-border mt-auto">
        <div className="bg-gradient-to-br from-brand/10 to-purple-500/10 rounded-xl p-4 border border-brand/20">
          <h4 className="font-semibold text-foreground text-sm">VeriCode Pro</h4>
          <p className="text-xs text-muted-foreground mt-1 mb-3">Unlock premium mock interviews and system design courses.</p>
          <button className="w-full bg-brand text-brand-foreground text-xs font-bold py-2 rounded-lg hover:bg-brand-text transition-colors">
            Upgrade Now
          </button>
        </div>
      </div>
    </aside>
  );
}
