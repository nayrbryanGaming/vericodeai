"use client";

import { motion } from "framer-motion";

export function FeatureScrollGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
  };

  return (
    <section className="relative z-10 w-full bg-[#0A0A0A] py-32 px-6 border-t border-white/5 mt-[20vh]">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-6xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-24">
          <h2 className="text-4xl md:text-5xl font-medium text-white mb-6 tracking-tight">
            Built for developers for the agent-first era
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            VeriCode AI is designed to integrate seamlessly into your workflow, scaling from solo hacking to enterprise deployment.
          </p>
        </motion.div>

        {/* Use Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {["Enterprise", "Frontend", "Fullstack", "Data Science", "Mobile Apps", "Security"].map((useCase, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="group p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-500/20 to-cyan-400/20 flex items-center justify-center mb-6">
                <div className="w-4 h-4 rounded-full bg-cyan-400" />
              </div>
              <h3 className="text-2xl font-medium text-white mb-3">{useCase}</h3>
              <p className="text-gray-400 mb-8 line-clamp-2">
                Accelerate your {useCase.toLowerCase()} workflows with context-aware AI generation and intelligent debugging.
              </p>
              <span className="text-indigo-400 group-hover:text-cyan-400 transition-colors font-medium">View case &rarr;</span>
            </motion.div>
          ))}
        </div>

        {/* Pricing/Target Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-32">
          <motion.div variants={itemVariants} className="p-12 rounded-3xl bg-gradient-to-b from-white/10 to-transparent border border-white/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            </div>
            <h3 className="text-3xl font-medium text-white mb-2">For developers</h3>
            <p className="text-xl text-gray-400 mb-10">Achieve new heights</p>
            <button className="px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition-colors">Start for free</button>
          </motion.div>
          
          <motion.div variants={itemVariants} className="p-12 rounded-3xl bg-gradient-to-b from-indigo-500/20 to-transparent border border-indigo-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-20 text-indigo-400">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="2" y="2" width="20" height="20" rx="2" ry="2"/></svg>
            </div>
            <h3 className="text-3xl font-medium text-white mb-2">For organizations</h3>
            <p className="text-xl text-gray-400 mb-10">Level up your entire team</p>
            <button className="px-6 py-3 bg-indigo-500 text-white font-medium rounded-full hover:bg-indigo-600 transition-colors">Contact Sales</button>
          </motion.div>
        </div>

      </motion.div>
    </section>
  );
}
