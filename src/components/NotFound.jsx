import { useNavigate } from 'react';
import { motion } from 'framer-motion';
import { Compass, ArrowLeft } from 'lucide-react';
import MagneticButton from './MagneticButton';
import PageTransition from './PageTransition';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto min-h-[80vh] flex flex-col items-center justify-center text-center relative">
      {/* Background Architectural Vector Compass Overlay */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04] z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
        >
          <Compass size={400} className="text-accent" />
        </motion.div>
      </div>

      <div className="relative z-10 space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 font-mono text-[9px] uppercase tracking-[0.25em] text-accent"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          Error Code: 404 // Spatial Anomaly
        </motion.div>

        <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tight text-white leading-none">
          NODE <span className="font-light italic text-zinc-500 lowercase">not found</span>
        </h1>

        <p className="max-w-md mx-auto text-sm text-zinc-400 font-sans leading-relaxed">
          The structural coordinate or spatial node you are attempting to access does not exist within the Akanni Studios blueprint registry.
        </p>

        <div className="pt-8 flex items-center justify-center gap-4">
          <MagneticButton onClick={() => navigate('/')}>
            <button className="px-8 h-12 bg-accent hover:bg-accent-hover text-black font-bold font-mono text-[10px] uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(0,245,212,0.25)] flex items-center gap-2">
              <ArrowLeft size={14} />
              Return to Studio Core
            </button>
          </MagneticButton>
        </div>
      </div>
    </PageTransition>
  );
}
