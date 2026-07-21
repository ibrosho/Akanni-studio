import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass, Cpu, Terminal, Play } from 'lucide-react';
import PageTransition from './PageTransition';
import MagneticButton from './MagneticButton';
import { getMediaUrl } from '../config/media';

export default function Studio() {
  const navigate = useNavigate();

  const steps = [
    {
      num: "01",
      tag: "Strategy & Identity",
      icon: <Compass size={14} className="text-cyan-400" />,
      title: "Engineered Branding Matrix",
      desc: "Every path, node, and layout parameter is built with explicit mathematical intent. We build pristine design blueprints using CorelDRAW that transition smoothly into your digital workspace layout."
    },
    {
      num: "02",
      tag: "Campaign Frameworks",
      icon: <Cpu size={14} className="text-indigo-400" />,
      title: "Luxury Spatial Collateral",
      desc: "Building immersive digital ecosystems and elite promotional frameworks designed exclusively for premium jewelry, artisanal crafts, and architectural spaces."
    },
    {
      num: "03",
      tag: "Full-Stack Deployment",
      icon: <Terminal size={14} className="text-purple-400" />,
      title: "High-Fidelity MERN Architecture",
      desc: "Merging visual layouts with functional backend services. We build secure, custom logic nodes using MongoDB, Express, React, and Node.js for high-speed performance."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0, 
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
    }
  };

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto relative">
      
      {/* Background Video Loop with Ambient Overlay */}
      <div className="fixed inset-0 w-full h-full overflow-hidden pointer-events-none -z-10 opacity-20">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover scale-105"
        >
          <source src={getMediaUrl("/studio_loop.mp4")} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
      </div>

      <section id="studio" className="pb-24 relative z-20 w-full min-h-screen">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* Sticky Sidebar Profile Column */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 h-fit space-y-8 text-left">
            <div className="space-y-4">
              <p className="text-[10px] font-mono tracking-[0.35em] text-cyan-400 uppercase mb-3">Studio Workspace</p>
              <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
                PRECISION <span className="font-light italic text-zinc-500 lowercase">&</span> INTENTION
              </h2>
              <div className="h-[1px] bg-white/10 mt-8 w-full" />
            </div>

            <p className="text-gray-400 text-sm font-light leading-relaxed max-w-sm antialiased">
              Creativity by Akanni operates as an interdisciplinary production engine. We dismiss standard web templates to engineer custom-built brand systems and full-stack logic workflows.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <MagneticButton>
                <a 
                  href="https://wa.me/2348104271840"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 h-11 border border-white/10 hover:border-cyan-400/30 bg-white/[0.02] text-gray-300 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] group"
                >
                  Contact Studio <ArrowUpRight size={12} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
                </a>
              </MagneticButton>

              <MagneticButton onClick={() => navigate('/login')}>
                <button 
                  className="inline-flex items-center gap-3 px-6 h-11 border border-cyan-500/20 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(6,182,212,0.15)] cursor-pointer"
                >
                  Client Access
                </button>
              </MagneticButton>
            </div>
          </div>

          {/* Dynamic Interactive Steps Column */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 w-full text-left"
          >
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="p-8 rounded-2xl bg-[#06060b]/30 border border-white/[0.04] hover:border-white/[0.09] shadow-2xl backdrop-blur-md transition-all duration-300 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-6">
                  <span className="text-xs font-mono text-cyan-400/60 font-semibold">{step.num}</span>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.02] border border-white/5 text-[9px] font-mono text-zinc-400">
                    {step.icon}
                    <span>{step.tag}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-3 group-hover:text-cyan-400 transition-colors">
                  {step.title}
                </h3>

                <p className="text-zinc-400 text-xs font-light leading-relaxed">
                  {step.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </PageTransition>
  );
}