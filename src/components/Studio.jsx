
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, Compass, Cpu, Terminal } from 'lucide-react';
import PageTransition from './PageTransition';

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
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
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
              <a 
                href="https://wa.me/2348104271840"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 h-11 border border-white/10 hover:border-cyan-400/30 bg-white/[0.02] text-gray-300 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] group"
              >
                Contact Studio <ArrowUpRight size={12} className="text-gray-500 group-hover:text-cyan-400 transition-colors" />
              </a>

              <button 
                onClick={() => navigate('/login')}
                className="inline-flex items-center gap-3 px-6 h-11 border border-cyan-500/20 hover:border-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 text-cyan-400 hover:text-white text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(6,182,212,0.15)]"
              >
                Client Access
              </button>
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
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="flex flex-col md:flex-row md:items-start gap-6 relative z-10">
                  
                  {/* Structural Identifier Matrix */}
                  <div className="flex items-center md:flex-col gap-4 md:gap-3">
                    <span className="text-xs font-mono font-bold text-gray-600 bg-white/[0.02] border border-white/5 w-8 h-8 rounded-lg flex items-center justify-center">
                      {step.num}
                    </span>
                    <div className="w-[1px] h-4 md:h-8 bg-gradient-to-b from-white/10 to-transparent hidden md:block" />
                  </div>

                  {/* Core Narrative Information Layout */}
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      {step.icon}
                      <span className="text-[9px] font-mono uppercase tracking-[0.25em] text-gray-500 font-bold">
                        {step.tag}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-200 group-hover:text-white transition-colors duration-300">
                      {step.title}
                    </h3>
                    
                    <p className="text-xs md:text-sm font-light text-gray-400 leading-relaxed max-w-xl antialiased">
                      {step.desc}
                    </p>
                  </div>

                </div>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </section>
    </PageTransition>
  );
}