"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Code2, BrainCircuit, Target } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NetworkCanvas } from "@/components/three/NetworkCanvas";
import { TiltCard } from "@/components/TiltCard";
import { Reveal, stagger, fadeUp } from "@/components/motion/Reveal";
import { Link000, Link001 } from "@/components/ui/skiper-ui/skiper40";

const features = [
  { icon: Code2, title: "150+ Curated Problems", desc: "Hand-picked DSA questions commonly asked at FAANG and top tech companies.", color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: BrainCircuit, title: "AI Code Reviewer", desc: "Instant, detailed feedback on time/space complexity, bugs, and best practices.", color: "text-accent-violet", bg: "bg-accent-violet/10" },
  { icon: Target, title: "Guided Learning Paths", desc: "Structured curriculum from beginner to advanced. Master one pattern at a time.", color: "text-brand", bg: "bg-brand/10" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background selection:bg-brand/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed w-full top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Logo />
            <div className="hidden md:flex items-center gap-8">
              <Link000 href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link000>
              <Link000 href="#curriculum" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Curriculum</Link000>
              <Link000 href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Success Stories</Link000>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-sm font-medium text-foreground hover:text-brand transition-colors">Sign in</Link>
              <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-brand px-4 py-2 text-sm font-medium text-brand-foreground hover:bg-brand-text transition-colors shadow-sm">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero with 3D network */}
        <div className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-brand-light/40 via-background to-background" />
          {/* Interactive 3D node network */}
          <NetworkCanvas className="absolute inset-0 w-full h-full opacity-70 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <motion.div variants={stagger} initial="hidden" animate="show" className="text-center max-w-4xl mx-auto">
              <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-light text-brand-text text-sm font-medium mb-8 border border-brand/20">
                <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse" />
                Now with AI-powered mock interviews
              </motion.div>
              <motion.h1 variants={fadeUp} className="text-5xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
                Master Coding Interviews with{" "}
                <span className="bg-gradient-to-r from-brand to-accent-violet bg-clip-text text-transparent">AI</span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                Your personal AI mentor for data structures, algorithms, and system design. Practice, get instant feedback, and land your dream role at top tech companies.
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/signup" className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-bold text-brand-foreground hover:bg-brand-text transition-all shadow-lg shadow-brand/25 hover:shadow-brand/40 hover:-translate-y-0.5">
                  Start Practicing for Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link href="#features" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-card border border-border px-8 py-4 text-base font-medium text-foreground hover:bg-muted transition-all">
                  View Features
                </Link>
              </motion.div>
            </motion.div>

            {/* Floating dashboard preview (tilts in 3D on hover) */}
            <Reveal delay={0.3} className="mt-20 relative mx-auto max-w-5xl group" y={40}>
              <TiltCard max={6} className="rounded-2xl">
                <div className="rounded-2xl border border-border/50 bg-card/60 p-2 backdrop-blur-sm shadow-2xl">
                  <div className="rounded-xl overflow-hidden border border-border bg-background shadow-sm aspect-[16/9] flex flex-col">
                    <div className="h-12 border-b border-border bg-muted/50 flex items-center px-4 gap-2">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-400" />
                        <div className="w-3 h-3 rounded-full bg-yellow-400" />
                        <div className="w-3 h-3 rounded-full bg-green-400" />
                      </div>
                      <div className="ml-4 flex-1 max-w-xl mx-auto bg-card rounded-md border border-border h-7 flex items-center px-3 text-xs text-muted-foreground">
                        vericode-ai.vercel.app/dashboard
                      </div>
                    </div>
                    <div className="flex-1 p-6 grid grid-cols-4 gap-6 bg-background">
                      <div className="col-span-1 space-y-4">
                        <div className="h-8 w-32 bg-muted rounded-md" />
                        <div className="space-y-2 pt-4">
                          {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-muted/50 rounded-lg w-full" />)}
                        </div>
                      </div>
                      <div className="col-span-3 space-y-6">
                        <div className="flex gap-4">
                          {[...Array(3)].map((_, i) => (
                            <div key={i} className="h-24 bg-card border border-border rounded-xl flex-1 p-4 flex flex-col justify-between">
                              <div className="w-8 h-8 rounded-full bg-brand-light" />
                              <div className="h-4 w-16 bg-muted rounded" />
                            </div>
                          ))}
                        </div>
                        <div className="h-64 bg-card border border-border rounded-xl p-6">
                          <div className="h-6 w-48 bg-muted rounded mb-6" />
                          <div className="space-y-3">
                            {[...Array(4)].map((_, i) => <div key={i} className="h-12 bg-muted/30 rounded-lg w-full" />)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
              <motion.div animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -left-10 top-1/4 w-24 h-24 bg-brand/20 rounded-full blur-2xl" />
              <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute -right-10 bottom-1/4 w-32 h-32 bg-accent-violet/20 rounded-full blur-2xl" />
            </Reveal>
          </div>
        </div>

        {/* Features */}
        <div id="features" className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Reveal className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-brand font-semibold tracking-wide uppercase text-sm mb-3">Why VeriCode AI?</h2>
              <p className="text-3xl font-bold text-foreground sm:text-4xl">Everything you need to ace your next technical interview</p>
            </Reveal>

            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((f) => (
                <motion.div key={f.title} variants={fadeUp} className="group">
                  <TiltCard className="h-full rounded-2xl">
                    <div className="h-full bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-lg hover:border-brand/30 transition-all">
                      <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}>
                        <f.icon className={`w-6 h-6 ${f.color}`} />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-3">{f.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
                    </div>
                  </TiltCard>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-24 bg-background">
          <Reveal className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">Ready to start your journey?</h2>
            <p className="text-lg text-muted-foreground mb-10">Join thousands of developers who have leveled up their coding skills and landed their dream jobs.</p>
            <Link href="/signup" className="group inline-flex items-center justify-center gap-2 rounded-xl bg-foreground px-8 py-4 text-base font-bold text-background hover:bg-foreground/90 transition-all shadow-lg">
              Create Free Account
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <Logo size="sm" />
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} VeriCode AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link001 href="mailto:hello@vericode.ai" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              hello@vericode.ai
            </Link001>
            <Link href="#" className="text-muted-foreground hover:text-foreground">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
