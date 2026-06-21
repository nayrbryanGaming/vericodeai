"use client";

import { motion } from "framer-motion";
import { Download } from "lucide-react";

export function LandingHero() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-20 text-center">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="mb-6 flex items-center space-x-2 text-gray-400">
          <div className="w-5 h-5 rounded bg-gradient-to-tr from-indigo-500 to-cyan-400" />
          <span className="font-semibold tracking-wide uppercase text-sm">VeriCode AI</span>
        </motion.div>

        <motion.h1 
          variants={itemVariants} 
          className="text-5xl md:text-7xl lg:text-[84px] font-medium leading-[1.05] tracking-tight text-white mb-10"
        >
          Experience liftoff with the <br className="hidden md:block" />
          next-gen agent platform
        </motion.h1>

        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center gap-4">
          <button className="flex items-center px-8 py-4 text-base font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-colors shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <Download className="w-5 h-5 mr-2" />
            Download for Windows
          </button>
          <button className="px-8 py-4 text-base font-medium text-white border border-white/20 rounded-full hover:bg-white/5 transition-colors">
            Explore use cases
          </button>
        </motion.div>
      </motion.div>
    </section>
  );
}
