"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronDown, Download } from "lucide-react";

export function LandingNavbar() {
  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-[#0A0A0A]/70 border-b border-white/5"
    >
      <div className="flex items-center space-x-12">
        <div className="flex items-center space-x-2">
          {/* Mock Logo */}
          <div className="w-6 h-6 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400" />
          <span className="text-xl font-bold text-white">VeriCode <span className="text-indigo-400">AI</span></span>
        </div>

        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
          <button className="flex items-center hover:text-white transition-colors">
            Products <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          <button className="flex items-center hover:text-white transition-colors">
            Use Cases <ChevronDown className="ml-1 w-4 h-4" />
          </button>
          <Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <button className="flex items-center hover:text-white transition-colors">
            Resources <ChevronDown className="ml-1 w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Link href="/login" className="hidden md:block text-sm font-medium text-gray-300 hover:text-white transition-colors">
          Sign in
        </Link>
        <button className="flex items-center px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-white/20 border border-white/10 rounded-full backdrop-blur-sm transition-all duration-300">
          <span className="mr-2">Download</span>
          <Download className="w-4 h-4" />
        </button>
      </div>
    </motion.nav>
  );
}
