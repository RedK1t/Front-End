import { AnimatePresence, motion } from "motion/react";
import { useOutlet } from "react-router-dom";

type AnimatedOutletProps = {
  /** Identifies the current "page"; a transition runs whenever it changes. */
  transitionKey: string;
};

// Drop-in replacement for react-router's <Outlet /> that fades/slides the page
// in and out on navigation. `h-full` keeps the existing height chain intact so
// full-height pages (h-dvh / h-full) render unchanged.
export default function AnimatedOutlet({ transitionKey }: AnimatedOutletProps) {
  const outlet = useOutlet();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={transitionKey}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="h-full"
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
}
