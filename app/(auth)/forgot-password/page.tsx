"use client";
import { useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

// API_KEY: POST /api/auth/forgot-password — body: { email } — returns: { message }
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) { setError("Please enter your email address."); return; }
    setLoading(true);
    try {
      // TODO (backend): POST /api/auth/forgot-password with { email }
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size="md" />
          <h1 className="mt-5 text-2xl font-bold text-foreground">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1 text-center">
            Enter your email and we will send you a reset link.
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4">
              <CheckCircle size={40} className="mx-auto text-green-500 mb-3" />
              <p className="font-medium text-foreground mb-1">Check your email</p>
              <p className="text-sm text-muted-foreground">We sent a reset link to <strong className="text-foreground">{email}</strong></p>
              <Link href="/login" className="mt-5 inline-block text-sm text-brand-text hover:opacity-80 font-medium">
                Back to sign in
              </Link>
            </div>
          ) : (
            <>
              {error && (
                <div className="mb-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg p-3">
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background text-foreground outline-none focus:border-brand focus:ring-2 focus:ring-brand-light transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand text-brand-foreground text-sm font-semibold py-2.5 rounded-lg hover:bg-brand-text transition-colors disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send reset link"}
                </button>
              </form>
            </>
          )}
        </div>

        <Link href="/login" className="mt-5 flex items-center justify-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      </div>
    </div>
  );
}
