"use client";
// API_KEY: GET /api/user/notifications/settings — returns: NotificationSettings
// API_KEY: PATCH /api/user/notifications/settings — body: NotificationSettings
import { useState } from "react";
import { Check } from "lucide-react";

interface NotiGroup {
  title: string;
  items: { key: string; label: string }[];
}

const groups: NotiGroup[] = [
  {
    title: "Coursework & Deadlines",
    items: [
      { key: "new_assignment", label: "Email me when a new assignment is posted" },
      { key: "deadline_reminder", label: "Remind me 24 hours before assignment deadlines" },
      { key: "grades_feedback", label: "Notify me when grades or feedback are published" },
    ],
  },
  {
    title: "Community & Discussions",
    items: [
      { key: "forum_reply", label: "When a peer or instructor replies to my forum thread" },
      { key: "direct_messages", label: "Direct messages from study groups" },
    ],
  },
  {
    title: "VeriCode AI Updates",
    items: [
      { key: "platform_news", label: "Occasional platform news, feature updates, and tips" },
    ],
  },
];

export default function NotificationsPage() {
  const [masterToggle, setMasterToggle] = useState(true);
  const [settings, setSettings] = useState<Record<string, boolean>>({
    new_assignment: true,
    deadline_reminder: true,
    grades_feedback: true,
    forum_reply: true,
    direct_messages: true,
    platform_news: false,
  });
  const [saved, setSaved] = useState(false);

  function toggle(key: string) {
    setSettings((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  }

  async function handleSave() {
    // TODO (backend): PATCH /api/user/notifications/settings
    await new Promise((r) => setTimeout(r, 400));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-5">
      {/* Master toggle */}
      <div className="bg-card border border-border rounded-xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground mt-0.5">Control all notification preferences</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Master Toggle</span>
          <button
            onClick={() => setMasterToggle(!masterToggle)}
            className={`w-10 h-5 rounded-full transition-colors relative ${masterToggle ? "bg-brand" : "bg-input"}`}
          >
            <span
              className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${masterToggle ? "left-5" : "left-0.5"}`}
            />
          </button>
        </div>
      </div>

      {/* Notification groups */}
      {groups.map((g) => (
        <div key={g.title} className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-foreground mb-3">{g.title}</h2>
          <div className="space-y-3">
            {g.items.map((item) => (
              <label
                key={item.key}
                className="flex items-start gap-3 cursor-pointer group"
              >
                <div
                  onClick={() => masterToggle && toggle(item.key)}
                  className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                    settings[item.key] && masterToggle
                      ? "bg-brand border-brand"
                      : "border-border bg-background"
                  } ${!masterToggle ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  {settings[item.key] && masterToggle && <Check size={10} className="text-brand-foreground" />}
                </div>
                <span className={`text-sm text-foreground ${!masterToggle ? "opacity-50" : ""}`}>
                  {item.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleSave}
        className="flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-text transition-colors"
      >
        {saved && <Check size={14} />}
        {saved ? "Saved!" : "Save preferences"}
      </button>
    </div>
  );
}
