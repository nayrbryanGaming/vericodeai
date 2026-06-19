"use client";
import { Search, Bell, Settings, LogOut, Menu, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function Topbar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);
  const [userName, setUserName] = useState("Developer");

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
        <button className="p-2 text-muted-foreground hover:bg-muted rounded-lg relative transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-brand rounded-full border-2 border-background"></span>
        </button>
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
              <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted">
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
