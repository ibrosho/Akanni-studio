import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress, scrollY } = useScroll();

  // Smooth spring physics for indicator width
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 30,
    restDelta: 0.001
  });

  // Fade out when at top of page
  const opacity = useTransform(scrollY, [0, 50], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed top-0 left-0 right-0 z-[100000] pointer-events-none"
    >
      <motion.div
        className="h-[2px] bg-accent origin-left shadow-[0_0_10px_rgba(0,245,212,0.8)]"
        style={{ scaleX }}
      />
    </motion.div>
  );
}
