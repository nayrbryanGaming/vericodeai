"use client";
import { Search, Bell, Settings, LogOut, Menu, Moon, Sun, CheckCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Notification = { id: number; title: string; time: string; read: boolean };

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "Your solution to \"Two Sum\" passed all tests.", time: "2m ago", read: false },
  { id: 2, title: "New badge unlocked: 7-day streak 🔥", time: "1h ago", read: false },
  { id: 3, title: "Weekly leaderboard updated — you moved up 4 spots.", time: "Yesterday", read: true },
];

export function Topbar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState("Developer");
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(SAMPLE_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // Check initial dark mode state
    setIsDark(document.documentElement.classList.contains("dark"));

    // Check user data
    const data = localStorage.getItem("vericode_user");
    if (data) {
      try {
        const parsed = JSON.parse(data);
        if (parsed.name) setUserName(parsed.name);
      } catch (e) {}
    }
  }, []);

  const toggleDarkMode = () => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.remove("dark");
      localStorage.setItem("vericode-theme", "light");
      setIsDark(false);
    } else {
      root.classList.add("dark");
      localStorage.setItem("vericode-theme", "dark");
      setIsDark(true);
    }
  };

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const handleLogout = () => {
    localStorage.removeItem("vericode_user");
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button className="md:hidden p-2 text-muted-foreground hover:bg-muted rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative max-w-md w-full hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search problems, projects, resources..."
            className="block w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-muted/50 text-foreground focus:ring-2 focus:ring-brand focus:border-brand sm:text-sm transition-colors"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="p-2 text-muted-foreground hover:bg-muted rounded-lg transition-colors"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((o) => !o)}
            className="p-2 text-muted-foreground hover:bg-muted rounded-lg relative transition-colors"
            title="Notifications"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-4 h-4 px-1 flex items-center justify-center text-[10px] font-bold leading-none text-brand-foreground bg-brand rounded-full border-2 border-background">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <>
              {/* click-away backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-80 max-w-[90vw] bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">Notifications</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs font-medium text-brand-text hover:opacity-80 transition-opacity"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="px-4 py-8 text-center text-sm text-muted-foreground">You&apos;re all caught up.</p>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`flex gap-3 px-4 py-3 border-b border-border last:border-0 ${n.read ? "" : "bg-brand-light/40"}`}
                      >
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${n.read ? "bg-transparent" : "bg-brand"}`} />
                        <div className="min-w-0">
                          <p className="text-sm text-foreground leading-snug">{n.title}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="h-8 w-px bg-border mx-1" />

        {/* User Dropdown Profile (Simple) */}
        <div className="group relative">
          <button className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-brand text-brand-foreground flex items-center justify-center font-bold text-sm">
              {userName.substring(0, 2).toUpperCase()}
            </div>
          </button>

          <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 origin-top-right">
            <div className="px-4 py-2 border-b border-border">
              <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            </div>
            <div className="py-1">
              <button onClick={toggleDarkMode} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                {isDark ? "Light theme" : "Dark theme"}
              </button>
              <button onClick={() => router.push("/settings")} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
                <Settings className="w-4 h-4" />
                Settings
              </button>
            </div>
            <div className="py-1 border-t border-border">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
