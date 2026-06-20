"use client";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/** Subtle, cheap route-entrance (opacity + small rise). Keyed by path so it
 *  re-runs on navigation. Transform/opacity only — smooth on low-end devices. */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.21, 0.5, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
