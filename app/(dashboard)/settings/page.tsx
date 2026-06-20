"use client";
// API_KEY: GET /api/user/me — returns: { firstName, lastName, username, email, phone, bio, avatar }
// API_KEY: PATCH /api/user/me — body: { firstName, lastName, username, phone, bio }
// API_KEY: POST /api/user/avatar — body: FormData(file) — returns: { avatarUrl }
import { useState } from "react";
import { Check } from "lucide-react";
import AvatarPicker from "@/components/avatar/AvatarPicker";

const inputCls =
  "w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all";

export default function ProfileSettingsPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    phone: "",
    bio: "",
  });
  const [saved, setSaved] = useState(false);

  function update(k: string, v: string) { setForm((p) => ({ ...p, [k]: v })); setSaved(false); }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // TODO (backend): PATCH /api/user/me with form data
    await new Promise((r) => setTimeout(r, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground text-sm">{form.username || "your account"}</span>
        <span className="text-muted-foreground/70">/ Your personal account</span>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-5">Public profile</h2>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Name row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">First Name</label>
              <input value={form.firstName} onChange={(e) => update("firstName", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Last Name</label>
              <input value={form.lastName} onChange={(e) => update("lastName", e.target.value)} className={inputCls} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground -mt-3">Your name may appear around VeriCode AI where you contribute or are mentioned.</p>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">@</span>
              <input value={form.username} onChange={(e) => update("username", e.target.value)} className={`${inputCls} pl-7`} />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Public email</label>
            <div className="flex items-center gap-2">
              <input
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@example.com"
                className={`${inputCls} flex-1`}
              />
              <button type="button" className="text-xs text-destructive hover:opacity-80 font-medium whitespace-nowrap">
                × Remove
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-1">You can manage verified email addresses in your <a href="#" className="text-brand-text hover:underline">email settings</a>.</p>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Phone number</label>
            <div className="flex gap-2">
              <select className={`${inputCls} w-auto`}>
                <option>+1 (US/CA)</option>
                <option>+62 (ID)</option>
                <option>+91 (IN)</option>
                <option>+44 (UK)</option>
              </select>
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="e.g. 555-0198" className={`${inputCls} flex-1`} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Your phone number is used for account recovery and important alerts. It will not be displayed publicly.</p>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Bio</label>
            <textarea value={form.bio} onChange={(e) => update("bio", e.target.value)} rows={3} placeholder="Tell others about yourself..." className={`${inputCls} resize-none`} />
            <p className="text-xs text-muted-foreground mt-1">You can @mention other users and organizations to link to them.</p>
          </div>

          <button type="submit" className="flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-text transition-colors">
            {saved && <Check size={14} />}
            {saved ? "Saved!" : "Update profile"}
          </button>
        </form>
      </div>

      {/* Avatar section: 3D Bitmoji-style builder + photo upload */}
      <AvatarPicker fallbackInitial={(form.firstName || "U").charAt(0)} />
    </div>
  );
}
