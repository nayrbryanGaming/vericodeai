"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
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
  ChevronRight,
  X,
  Check,
} from "lucide-react";
import { Logo } from "../Logo";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard",   href: "/dashboard"   },
  { icon: Sparkles,        label: "AI Assistance",href: "/ai"          },
  { icon: Code2,           label: "Practice",     href: "/practice"    },
  { icon: GraduationCap,   label: "Learning",     href: "/learning"    },
  { icon: FolderKanban,    label: "Projects",     href: "/projects"    },
  { icon: LineChart,       label: "Analytics",    href: "/analytics"   },
  { icon: Award,           label: "Badges",       href: "/badges"      },
  { icon: Trophy,          label: "Leaderboard",  href: "/leaderboard" },
  { icon: Users,           label: "Community",    href: "/community"   },
];

// 29 3D cartoon avatars — all stored in /public/avatars/
const AVATARS = Array.from({ length: 29 }, (_, i) => `/avatars/av${i + 1}.jpg`);

// ── Avatar Picker Modal ───────────────────────────────────────────────────────
function AvatarPicker({
  current,
  onSelect,
  onClose,
}: {
  current: string;
  onSelect: (src: string) => void;
  onClose: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "ap-fadein 0.2s ease-out",
      }}
    >
      <style>{`
        @keyframes ap-fadein  { from{opacity:0;transform:scale(0.96)} to{opacity:1;transform:scale(1)} }
        @keyframes ap-shimmer { 0%,100%{box-shadow:0 0 0 2px rgba(96,165,250,0.5),0 0 20px rgba(96,165,250,0.25)} 50%{box-shadow:0 0 0 2px rgba(167,139,250,0.7),0 0 28px rgba(167,139,250,0.35)} }
      `}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "560px",
          maxHeight: "80vh",
          overflowY: "auto",
          background: "rgba(6, 10, 28, 0.96)",
          backdropFilter: "blur(40px) saturate(180%)",
          WebkitBackdropFilter: "blur(40px) saturate(180%)",
          border: "1px solid rgba(255,255,255,0.14)",
          borderTop: "1px solid rgba(255,255,255,0.24)",
          borderRadius: "24px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.04) inset",
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(255,255,255,0.1) transparent",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "20px 20px 0",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            paddingBottom: "16px",
          }}
        >
          <div>
            <h3 style={{ fontSize: "16px", fontWeight: 700, color: "#fff", marginBottom: "2px" }}>
              Choose your avatar
            </h3>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.38)" }}>
              {AVATARS.length} 3D characters available
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              width: "32px", height: "32px", borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "rgba(255,255,255,0.06)",
              color: "rgba(255,255,255,0.6)",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.12)"; e.currentTarget.style.color = "#fff"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "10px",
            padding: "16px 20px 20px",
          }}
        >
          {AVATARS.map((src) => {
            const isSelected = current === src;
            return (
              <button
                key={src}
                onClick={() => { onSelect(src); onClose(); }}
                style={{
                  position: "relative",
                  borderRadius: "50%",
                  overflow: "hidden",
                  aspectRatio: "1",
                  border: isSelected
                    ? "2.5px solid #60a5fa"
                    : "2.5px solid rgba(255,255,255,0.10)",
                  cursor: "pointer",
                  background: "none",
                  padding: 0,
                  boxShadow: isSelected
                    ? "0 0 0 4px rgba(96,165,250,0.25), 0 0 24px rgba(96,165,250,0.3)"
                    : "none",
                  transition: "all 0.18s",
                  animation: isSelected ? "ap-shimmer 2.5s ease-in-out infinite" : "none",
                }}
                onMouseEnter={e => {
                  if (!isSelected) {
                    e.currentTarget.style.border = "2.5px solid rgba(255,255,255,0.40)";
                    e.currentTarget.style.transform = "scale(1.06)";
                    e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.5)";
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.border = "2.5px solid rgba(255,255,255,0.10)";
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }
                }}
              >
                <Image
                  src={src}
                  alt="avatar"
                  fill
                  sizes="96px"
                  style={{ objectFit: "cover", objectPosition: "50% 18%" }}
                />
                {isSelected && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(96,165,250,0.20)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{
                      width: "22px", height: "22px", borderRadius: "50%",
                      background: "#3b82f6",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(59,130,246,0.6)",
                    }}>
                      <Check size={12} color="#fff" strokeWidth={3} />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
export function Sidebar() {
  const pathname  = usePathname();
  const router    = useRouter();
  const [isDark,       setIsDark]       = useState(true);
  const [avatar,       setAvatar]       = useState(AVATARS[0]);
  const [pickerOpen,   setPickerOpen]   = useState(false);

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"));
    const saved = localStorage.getItem("vericode-avatar");
    if (saved && AVATARS.includes(saved)) setAvatar(saved);
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

  function handleAvatarSelect(src: string) {
    setAvatar(src);
    localStorage.setItem("vericode-avatar", src);
  }

  return (
    <>
      {pickerOpen && (
        <AvatarPicker
          current={avatar}
          onSelect={handleAvatarSelect}
          onClose={() => setPickerOpen(false)}
        />
      )}

      <aside className="w-64 border-r border-border bg-sidebar-bg flex flex-col hidden md:flex shrink-0">
        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Logo size="sm" />
        </div>

        {/* ── User profile block (like reference design) ── */}
        <div
          style={{
            padding: "16px 16px 14px",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Avatar — click to open picker */}
          <button
            onClick={() => setPickerOpen(true)}
            title="Change avatar"
            style={{
              position: "relative",
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              overflow: "hidden",
              border: "2.5px solid rgba(99,102,241,0.55)",
              boxShadow: "0 0 0 4px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.4)",
              cursor: "pointer",
              background: "none",
              padding: 0,
              flexShrink: 0,
              transition: "all 0.22s",
            }}
            onMouseEnter={e => {
              e.currentTarget.style.border = "2.5px solid rgba(96,165,250,0.8)";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(96,165,250,0.2), 0 0 20px rgba(96,165,250,0.3)";
              e.currentTarget.style.transform = "scale(1.04)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.border = "2.5px solid rgba(99,102,241,0.55)";
              e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.12), 0 4px 20px rgba(0,0,0,0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Image
              src={avatar}
              alt="User avatar"
              fill
              sizes="64px"
              style={{ objectFit: "cover", objectPosition: "50% 18%" }}
            />
            {/* Edit hint overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                paddingBottom: "4px",
                transition: "background 0.2s",
              }}
              className="avatar-edit-overlay"
            />
          </button>

          {/* Name + status */}
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "rgba(255,255,255,0.88)", lineHeight: 1.3 }}>
              VeriCode User
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginTop: "3px" }}>
              <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e", flexShrink: 0 }} />
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)" }}>Online</span>
            </div>
          </div>

          {/* Level progress */}
          <div style={{ width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "rgba(255,255,255,0.45)", letterSpacing: "0.05em" }}>
                LEVEL 1 CODER
              </span>
              <span style={{ fontSize: "10px", fontWeight: 600, color: "#818cf8" }}>25%</span>
            </div>
            <div
              style={{
                height: "3px",
                borderRadius: "99px",
                background: "rgba(255,255,255,0.08)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: "25%",
                  borderRadius: "99px",
                  background: "linear-gradient(90deg, #6366f1, #a78bfa)",
                  boxShadow: "0 0 8px rgba(99,102,241,0.6)",
                }}
              />
            </div>
          </div>

          {/* Change avatar hint */}
          <button
            onClick={() => setPickerOpen(true)}
            style={{
              display: "flex", alignItems: "center", gap: "4px",
              fontSize: "10px", color: "rgba(255,255,255,0.28)",
              background: "none", border: "none", cursor: "pointer",
              padding: "2px 6px", borderRadius: "6px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.color = "#818cf8"; e.currentTarget.style.background = "rgba(99,102,241,0.10)"; }}
            onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "none"; }}
          >
            <ChevronRight size={10} />
            Change avatar
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5 overflow-y-auto scrollbar-thin">
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

        {/* Bottom controls */}
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
    </>
  );
}
