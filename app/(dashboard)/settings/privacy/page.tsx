"use client";
// API_KEY: PATCH /api/user/password — body: { currentPassword, newPassword }
// API_KEY: GET /api/user/sessions — returns: Session[]
// API_KEY: DELETE /api/user/sessions/{id}
import { useState } from "react";
import { Eye, EyeOff, Shield, Check } from "lucide-react";

const inputCls =
  "w-full px-3 py-2 pr-10 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all";

export default function PrivacyPage() {
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (passwords.new !== passwords.confirm) { setError("New passwords do not match."); return; }
    if (passwords.new.length < 8) { setError("Password must be at least 8 characters."); return; }
    setSaving(true);
    // TODO (backend): PATCH /api/user/password
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    setPasswords({ current: "", new: "", confirm: "" });
  }

  const sessions = [
    { id: 1, device: "Chrome on Windows", location: "Jakarta, ID", current: true, lastSeen: "Now" },
    { id: 2, device: "Safari on iPhone", location: "Jakarta, ID", current: false, lastSeen: "2 hours ago" },
  ];

  return (
    <div className="space-y-5">
      {/* Change password */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Shield size={16} className="text-muted-foreground" />
          <h2 className="text-base font-semibold text-foreground">Change password</h2>
        </div>
        {error && (
          <div className="mb-4 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">{error}</div>
        )}
        <form onSubmit={handlePasswordChange} className="space-y-4">
          {(["current", "new", "confirm"] as const).map((k) => (
            <div key={k}>
              <label className="block text-sm font-medium text-foreground mb-1.5 capitalize">
                {k === "current" ? "Current password" : k === "new" ? "New password" : "Confirm new password"}
              </label>
              <div className="relative">
                <input
                  type={show[k] ? "text" : "password"}
                  value={passwords[k]}
                  onChange={(e) => setPasswords((p) => ({ ...p, [k]: e.target.value }))}
                  className={inputCls}
                  autoComplete={k === "current" ? "current-password" : "new-password"}
                />
                <button type="button" onClick={() => setShow((p) => ({ ...p, [k]: !p[k] }))} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {show[k] ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          ))}
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-brand text-brand-foreground text-sm font-semibold px-5 py-2 rounded-lg hover:bg-brand-text transition-colors disabled:opacity-50"
          >
            {saved && <Check size={14} />}
            {saving ? "Updating..." : saved ? "Updated!" : "Update password"}
          </button>
        </form>
      </div>

      {/* Active sessions */}
      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="text-base font-semibold text-foreground mb-4">Active sessions</h2>
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between py-2.5 px-3 rounded-lg border border-border bg-muted/40">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground">{s.device}</p>
                  {s.current && <span className="text-xs bg-green-500/15 text-green-500 px-1.5 py-0.5 rounded font-medium">Current</span>}
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{s.location} · {s.lastSeen}</p>
              </div>
              {!s.current && (
                // TODO (backend): DELETE /api/user/sessions/{id}
                <button className="text-xs text-destructive hover:opacity-80 font-medium">Revoke</button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 2FA placeholder */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Two-factor authentication</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Add an extra layer of security to your account.</p>
          </div>
          {/* TODO (backend): POST /api/user/2fa/enable */}
          <button className="text-sm font-medium text-brand-text hover:opacity-80">Enable</button>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border border-destructive/30 rounded-xl p-5">
        <h2 className="text-sm font-semibold text-destructive mb-3">Danger Zone</h2>
        {/* TODO (backend): DELETE /api/user/me */}
        <button className="text-sm font-medium text-destructive border border-destructive/40 px-4 py-1.5 rounded-lg hover:bg-destructive/10 transition-colors">
          Delete account
        </button>
        <p className="text-xs text-muted-foreground mt-2">Once you delete your account, there is no going back. Please be certain.</p>
      </div>
    </div>
  );
}
