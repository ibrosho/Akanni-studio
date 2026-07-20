import { motion, useSpring } from 'framer-motion';

export default function MagneticButton({ children, className = "", onClick, maxDistance = 10, ...props }) {
  const x = useSpring(0, { stiffness: 180, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 180, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;

    const deltaX = (clientX - centerX) * 0.25;
    const deltaY = (clientY - centerY) * 0.25;

    // Clamp within maxDistance (10px)
    const clampedX = Math.max(-maxDistance, Math.min(maxDistance, deltaX));
    const clampedY = Math.max(-maxDistance, Math.min(maxDistance, deltaY));

    x.set(clampedX);
    y.set(clampedY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className={`inline-block cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}
