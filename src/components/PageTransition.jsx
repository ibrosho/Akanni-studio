import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -15,
  }
};

const pageTransition = {
  type: "spring",
  stiffness: 260,
  damping: 30,
  mass: 0.5
};

export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={pageTransition}
      className={`w-full ${className}`}
    >
      {children}
    </motion.div>
  );
}