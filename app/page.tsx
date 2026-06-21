"use client";

import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroParticles } from "@/components/landing/HeroParticles";
import { LandingHero } from "@/components/landing/LandingHero";
import { FeatureScrollGrid } from "@/components/landing/FeatureScrollGrid";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#050505] selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <LandingNavbar />

      <main className="relative">
        {/* The background particle canvas layer */}
        <HeroParticles />
        
        {/* The top hero text layer */}
        <LandingHero />

        {/* The scroll-triggered feature comparison section */}
        <FeatureScrollGrid />
      </main>

      {/* Clean, minimalist footer similar to Antigravity */}
      <footer className="bg-[#0A0A0A] border-t border-white/5 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400" />
            <span className="text-lg font-bold text-white">VeriCode <span className="text-indigo-400">AI</span></span>
          </div>
          <div className="flex items-center space-x-8 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-gray-300 transition-colors">Twitter</a>
            <a href="#" className="hover:text-gray-300 transition-colors">GitHub</a>
          </div>
          <p className="text-sm text-gray-600">© {new Date().getFullYear()} VeriCode AI.</p>
        </div>
      </footer>
    </div>
  );
}
