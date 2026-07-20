import { motion, useReducedMotion } from 'framer-motion';

// --- SECTION REVEAL ---
export function SectionReveal({ children, className = "", delay = 0 }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// --- IMAGE REVEAL ---
export function ImageReveal({ src, alt, className = "", imgClassName = "", delay = 0, onClick }) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div className={`overflow-hidden ${className}`} onClick={onClick}>
        <img src={src} alt={alt} className={`w-full h-full object-cover ${imgClassName}`} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`overflow-hidden ${className}`}
      onClick={onClick}
    >
      <motion.img
        initial={{ scale: 1.08 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-transform duration-700 hover:scale-105 ${imgClassName}`}
      />
    </motion.div>
  );
}

// --- TEXT REVEAL (Line-by-Line) ---
export function TextReveal({ text, className = "", delay = 0, as: Component = "h2" }) {
  const shouldReduceMotion = useReducedMotion();
  const lines = typeof text === 'string' ? text.split('\n') : [text];

  if (shouldReduceMotion) {
    return <Component className={className}>{text}</Component>;
  }

  return (
    <Component className={className}>
      {lines.map((line, idx) => (
        <span key={idx} className="block overflow-hidden pb-1">
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.8,
              delay: delay + idx * 0.12,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="block"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}
