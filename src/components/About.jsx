
import { motion } from 'framer-motion';
import { Shield, Layers } from 'lucide-react';
import PageTransition from './PageTransition';

export default function About() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  const metrics = [
    { value: "05+", label: "Years Practice", sub: "Graphic & Interaction Strategy" },
    { value: "40+", label: "Brands Sculpted", sub: "Immersive Identities Built" },
    { value: "100%", label: "Execution Precision", sub: "Pixel-Perfect Form & Code" },
    { value: "MERN", label: "Core Stack Matrix", sub: "High-Performance Layers" }
  ];

  const valuePillars = [
    {
      icon: <Layers size={16} className="text-cyan-400" />,
      title: "Interdisciplinary Execution",
      desc: "Architecting seamless transitions between sophisticated graphic assets in CorelDRAW and clean, structured logic layers inside the MERN stack."
    },
    {
      icon: <Shield size={16} className="text-indigo-400" />,
      title: "Structural Authenticity",
      desc: "Rejecting cookie-cutter layout templates to engineer tailor-made design parameters optimized exclusively for your digital workspace."
    }
  ];

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-24 pb-24 text-left w-full min-h-screen"
      >
        {/* SECTION 01: SPLIT HERO BIOGRAPHY */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <motion.div variants={itemVariants} className="lg:col-span-7 space-y-6">
            <div className="mb-8">
              <p className="text-[10px] font-mono tracking-[0.35em] text-cyan-400 uppercase mb-3">Studio Journals</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
                THE VISION <span className="font-light italic text-zinc-500 lowercase">&</span> ESSENCE
              </h2>
              <div className="h-[1px] bg-white/10 mt-8 w-full" />
            </div>
            
            <p className="text-gray-400 text-sm md:text-base font-light leading-relaxed max-w-xl antialiased">
              Creativity by Akanni functions as a high-fidelity design studio where pristine layout aesthetics intersect with rigorous full-stack development patterns. 
              We build modular web environments and elite brand collateral tailored for an ecosystem demanding absolute precision.
            </p>
          </motion.div>

          {/* Meaningful Studio Blueprint Specification Ledger Card */}
          <motion.div 
            variants={itemVariants}
            className="lg:col-span-5 w-full rounded-2xl bg-zinc-950/80 border border-white/[0.06] backdrop-blur-xl p-8 relative overflow-hidden group text-left"
          >
            {/* Blueprint Technical Grid Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#00f5d410_1px,transparent_1px),linear-gradient(to_bottom,#00f5d410_1px,transparent_1px)] bg-[size:16px_16px]" />
            <div className="absolute top-0 left-0 w-full h-full bg-radial-gradient from-transparent via-[#0a0a0a]/80 to-[#0a0a0a] pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-[10px] font-mono tracking-[0.25em] text-accent uppercase font-bold">Studio Blueprint</span>
                <span className="text-[8px] font-mono text-zinc-600">v2.0.0</span>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    01. Computational Design
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                    verifying design aesthetics by translating CorelDRAW vector schematics into clean, hardware-accelerated React interface matrices with mathematical coordinates.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    02. Material Integrity
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                    architecting physical forms utilizing self-shading timber arches, carbon-neutral volcanic concrete mix frameworks, and structural cantilevers.
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-mono uppercase text-white tracking-widest mb-1 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    03. Infrastructure Security
                  </h4>
                  <p className="text-[11px] text-zinc-400 font-light leading-relaxed">
                    authenticating user credentials via secure HttpOnly session tokens, automated email verification dispatches, and strict Zod data sanitization.
                  </p>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 flex justify-between items-center text-[8px] font-mono text-zinc-500 uppercase tracking-widest">
                <span>Scale: 1:1 Precision</span>
                <span>Akanni Studios Core</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* SECTION 02: METRIC ARCHITECTURE */}
        <motion.div 
          variants={itemVariants} 
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 py-12 border-y border-white/[0.04] font-mono"
        >
          {metrics.map((metric, i) => (
            <div key={i} className="space-y-1.5 p-4 rounded-xl bg-white/[0.01] border border-white/[0.02]">
              <div className="text-3xl md:text-4xl font-light text-white tracking-tight">{metric.value}</div>
              <div className="text-[10px] uppercase text-cyan-400/80 tracking-widest font-semibold">{metric.label}</div>
              <div className="text-[10px] text-gray-500 font-light leading-snug">{metric.sub}</div>
            </div>
          ))}
        </motion.div>

        {/* SECTION 03: STUDIO CORE VALUATION PILLARS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {valuePillars.map((pillar, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="p-8 rounded-2xl bg-[#06060b]/30 border border-white/[0.05] hover:border-cyan-500/20 shadow-2xl backdrop-blur-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/10 flex items-center justify-center">
                  {pillar.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-200 group-hover:text-white transition-colors duration-300">{pillar.title}</h3>
                <p className="text-xs text-gray-400 font-light leading-relaxed antialiased">{pillar.desc}</p>
              </div>
              
              <div className="flex items-center gap-1 text-[9px] font-mono tracking-widest uppercase text-gray-500 mt-8 pt-4 border-t border-white/[0.03]">
                Systems Verification Pillar 0{idx + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageTransition>
  );
}