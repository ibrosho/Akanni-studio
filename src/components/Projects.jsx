import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Compass, ShieldAlert, Cpu } from 'lucide-react';
import TiltCard from './TiltCard';
import PageTransition from './PageTransition';


// Editorial Case Study Database
const PROJECT_DATABASE = [
  {
    id: "canopy",
    title: "The Canopy Pavilion",
    category: "Biophilic Urbanism",
    client: "Lagos Environmental Trust",
    year: "2026",
    role: "Lead Computational Architect",
    summary: "An open-air civic pavilion utilizing self-shading parametric timber arches and integrated water filtration micro-climates to revive urban public space.",
    heroImage: "rol.avif",
    challenge: "The urban heat island effect in dense tropical areas limits outdoor civic life. The project required a zero-carbon, self-cooling public shelter that harvested rainwater while keeping structural weight minimal.",
    process: "Using computational design and dynamic structural analysis, we engineered self-shading parametric timber arches. The curves are mathematically optimized to block midday solar radiation while funneling wind into micro-filtration misting systems fed by harvested rainwater.",
    outcome: "A stunning structural landmark that reduces ambient temperature by up to 6°C natively without mechanical air conditioning, creating a vibrant, cool community hub in the heart of Lagos.",
    metrics: [
      { label: "Cooling Effect", value: "-6°C" },
      { label: "Carbon Footprint", value: "Net Zero" },
      { label: "Timber Curves", value: "142 Unique" }
    ]
  },
  {
    id: "mizora",
    title: "Mizora Monolith",
    category: "Residential Architecture",
    client: "Private Developer",
    year: "2025",
    role: "Architectural & Interior Brand Designer",
    summary: "A minimalist coastal residence carved from low-carbon volcanic concrete, featuring massive structural cantilevered spans framing the Atlantic skyline.",
    heroImage: "pal.avif",
    challenge: "To design a home that feels structurally impossible yet completely grounded in its coastal environment, resisting heavy Atlantic salt air erosion while maintaining a pure, brutalist minimalist aesthetic.",
    process: "We utilized custom-mixed volcanic concrete with high-durability, low-carbon additives. The structural core relies on a deep-set subterranean counterweight, allowing for a massive, gravity-defying cantilevered upper story with zero visible vertical pillars.",
    outcome: "An award-winning residential landmark featuring raw, poetic geometry. Seamless floor-to-ceiling glass transitions frame the ocean view, embodying absolute luxury and architectural restraint.",
    metrics: [
      { label: "Cantilever Span", value: "12 Meters" },
      { label: "Concrete Mix", value: "Volcanic Ash" },
      { label: "Ocean Frontage", value: "45 Meters" }
    ]
  },
  {
    id: "zenith",
    title: "The Zenith Tower",
    category: "Commercial High-Rise",
    client: "Zenith Holdings",
    year: "2026",
    role: "Facade Systems Specialist",
    summary: "A 45-story commercial skyscraper wrapped in a dynamic, kinetic solar-tracking envelope engineered to optimize internal thermal dynamics.",
    heroImage: "sky.avif",
    challenge: "Traditional glass skyscrapers suffer from immense heat gain, resulting in massive HVAC electricity costs. The brief called for a sustainable high-rise that visually reacts to environmental shifts.",
    process: "We developed a parametric, kinetic facade system. Hundreds of automated, lightweight solar fins open and close dynamically based on real-time solar tracking, deflecting direct heat while maintaining ambient daylight.",
    outcome: "An architectural marvel that slashed high-rise cooling costs by 40% while establishing a fluid, shimmering identity along the skyline of Eko Atlantic City.",
    metrics: [
      { label: "Energy Reduction", value: "40%" },
      { label: "Kinetic Shards", value: "1,200+" },
      { label: "Building Height", value: "185 Meters" }
    ]
  }
];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [blueprintMode, setBlueprintMode] = useState(false);

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <div className="w-full min-h-screen pb-32 text-left">
        
        {/* Page Title Header */}
        <div className="mb-16">
          <p className="text-[10px] font-mono tracking-[0.35em] text-accent uppercase mb-3">Selected Portfolios</p>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            ARCHIVE <span className="font-light italic text-zinc-500 lowercase">&</span> STORIES
          </h2>
          <div className="h-[1px] bg-white/10 mt-8 w-full" />
        </div>

        {/* Grid Layout (Parametric/Masonry Staggered Aesthetic) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          {PROJECT_DATABASE.map((project, idx) => {
            // High-End Architectural layout rules:
            // 1st project spans 7 cols, 2nd project spans 5 cols (tall aspect), 3rd spans 12 cols (wide panoramic).
            const colSpan = idx === 0 ? "md:col-span-7" : idx === 1 ? "md:col-span-5" : "md:col-span-12";
            const aspectClass = idx === 0 ? "aspect-[4/3]" : idx === 1 ? "aspect-[4/5] h-full" : "aspect-[16/7] md:aspect-[21/9]";
            
            return (
              <div key={project.id} onClick={() => setActiveProject(project)} className={`group cursor-pointer ${colSpan}`}>
                <TiltCard className={`w-full ${aspectClass} rounded-[2rem] overflow-hidden border border-white/[0.06] bg-zinc-950 relative`}>
                  
                  {/* Zooming background image on hover */}
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    <img 
                      src={project.heroImage} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-80" 
                    />
                  </div>

                  {/* Ambient overlay vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 z-10" />

                  {/* Card Meta Content */}
                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 z-20 flex flex-col justify-end">
                    <span className="text-[9px] font-mono text-accent uppercase tracking-widest mb-1.5">{project.category}</span>
                    <h3 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-white leading-none">{project.title}</h3>
                    
                    <div className="flex items-center gap-2 mt-4 text-[9px] font-mono text-zinc-400 group-hover:text-white transition-colors">
                      <span>Explore Case Study</span>
                      <ArrowRight size={10} className="transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>

                  {/* Floating index tag top-right */}
                  <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 text-[10px] font-mono text-white/30">
                    0{idx + 1}
                  </div>
                </TiltCard>
              </div>
            );
          })}
        </div>

        {/* FULL SCREEN MAGAZINE DETAILED VIEW MODAL */}
        <AnimatePresence>
          {activeProject && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-luxury-black overflow-y-auto px-4 py-8 md:p-12 lg:p-20 scrollbar-none"
            >
              {/* Modal Exit Control */}
              <div className="fixed top-8 right-8 z-50">
                <button 
                  onClick={() => setActiveProject(null)}
                  className="w-12 h-12 rounded-full border border-luxury-border bg-luxury-black/80 backdrop-blur-md flex items-center justify-center text-neutral-muted hover:text-neutral-warm hover:border-accent transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-w-5xl mx-auto space-y-16">
                
                {/* 1. HERO HERO SECTION */}
                <div className="space-y-6 text-left">
                  <span className="inline-block text-[10px] font-mono uppercase tracking-[0.35em] text-accent bg-accent/5 px-4 py-1.5 rounded-full border border-accent/20">{activeProject.category}</span>
                  <h1 className="text-4xl sm:text-7xl font-black uppercase tracking-tight leading-none text-white">{activeProject.title}</h1>
                  <p className="text-zinc-400 text-lg sm:text-xl font-light max-w-3xl leading-relaxed">{activeProject.summary}</p>
                </div>

                {/* 2. CASE PROJECT METADATA */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 border-y border-white/10 py-8 text-left font-mono">
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Client</p>
                    <p className="text-xs text-white font-medium">{activeProject.client}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Year</p>
                    <p className="text-xs text-white font-medium">{activeProject.year}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Role</p>
                    <p className="text-xs text-white font-medium">{activeProject.role}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-widest text-zinc-500 mb-1">Location</p>
                    <p className="text-xs text-white font-medium">Lagos, NG</p>
                  </div>
                </div>

                {/* 3. FULL-SCREEN HERO IMAGE DISPLAY */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-luxury-border">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-muted">Visualization Engine</span>
                    <button
                      onClick={() => setBlueprintMode(!blueprintMode)}
                      className={`px-4 py-1.5 rounded-full border text-[9px] font-mono uppercase tracking-widest transition-all duration-300 cursor-pointer ${
                        blueprintMode 
                          ? 'bg-accent/15 border-accent text-accent shadow-[0_0_12px_rgba(0,245,212,0.3)]' 
                          : 'bg-white/[0.02] border-luxury-border text-neutral-muted hover:text-neutral-warm hover:border-white/30'
                      }`}
                    >
                      {blueprintMode ? "Switch to Architectural Render" : "Toggle CAD Blueprint Overlay"}
                    </button>
                  </div>

                  <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-luxury-border relative bg-black">
                    <img 
                      src={activeProject.heroImage} 
                      alt="Main Showcase Render" 
                      className={`w-full h-full object-cover transition-all duration-700 ${
                        blueprintMode ? 'grayscale contrast-[1.25] invert brightness-[0.75] hue-rotate-[180deg] mix-blend-screen opacity-90' : ''
                      }`} 
                    />

                    {blueprintMode && (
                      <div className="absolute inset-0 bg-cyan-950/20 pointer-events-none mix-blend-screen overflow-hidden">
                        {/* Blueprint Grid Lines */}
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00f5d4_1px,transparent_1px),linear-gradient(to_bottom,#00f5d4_1px,transparent_1px)] bg-[size:32px_32px]" />
                        
                        {/* CAD SVG HUD Markers */}
                        <svg className="absolute inset-0 w-full h-full text-accent/40 p-4 font-mono select-none" viewBox="0 0 800 450" fill="none" stroke="currentColor" strokeWidth="0.75">
                          {/* Border corner brackets */}
                          <path d="M 20 50 L 20 20 L 50 20" />
                          <path d="M 750 20 L 780 20 L 780 50" />
                          <path d="M 20 400 L 20 430 L 50 430" />
                          <path d="M 750 430 L 780 430 L 780 400" />
                          
                          {/* Dynamic scale lines */}
                          <line x1="80" y1="380" x2="380" y2="380" strokeDasharray="4,4" />
                          <line x1="80" y1="375" x2="80" y2="385" />
                          <line x1="380" y1="375" x2="380" y2="385" />
                          <text x="230" y="372" fontSize="7" textAnchor="middle" fill="#00f5d4" className="font-semibold">DIMENSION A: 14.52m</text>

                          <line x1="480" y1="120" x2="480" y2="320" strokeDasharray="4,4" />
                          <line x1="475" y1="120" x2="485" y2="120" />
                          <line x1="475" y1="320" x2="485" y2="320" />
                          <text x="468" y="225" fontSize="7" textAnchor="middle" transform="rotate(-90 468 225)" fill="#00f5d4" className="font-semibold">ELEVATION B: 9.20m</text>
                          
                          {/* Plan annotations */}
                          <text x="35" y="40" fontSize="8" fill="#00f5d4" opacity="0.8">DWG REF: AKANNI-SYS-C102</text>
                          <text x="765" y="40" fontSize="8" fill="#00f5d4" opacity="0.8" textAnchor="end">SCALE: 1:100</text>
                          <text x="35" y="415" fontSize="8" fill="#00f5d4" opacity="0.8">TOLERANCE: +/- 0.05</text>
                          <text x="765" y="415" fontSize="8" fill="#00f5d4" opacity="0.8" textAnchor="end">GRID GRID SYSTEM: WGS84</text>
                          
                          {/* Center Target crosshairs */}
                          <circle cx="400" cy="225" r="24" strokeDasharray="2,2" opacity="0.4" />
                          <line x1="370" y1="225" x2="430" y2="225" opacity="0.4" strokeDasharray="2,2" />
                          <line x1="400" y1="195" x2="400" y2="255" opacity="0.4" strokeDasharray="2,2" />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* 4. MAGAZINE STORY: THE CHALLENGE VS PROCESS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-accent">
                      <ShieldAlert size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">The Challenge</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-white tracking-tight">Overcoming the constraints</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light">{activeProject.challenge}</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-400">
                      <Cpu size={14} />
                      <span className="text-[10px] font-mono uppercase tracking-widest font-bold">The Process</span>
                    </div>
                    <h3 className="text-2xl font-bold uppercase text-white tracking-tight">Computational & material exploration</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed font-light">{activeProject.process}</p>
                  </div>
                </div>

                {/* 5. METRIC STATS SHOWCASE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 text-center">
                  {activeProject.metrics.map((metric, i) => (
                    <div key={i} className="space-y-2">
                      <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500">{metric.label}</p>
                      <p className="text-3xl sm:text-4xl font-black text-accent">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* 6. FINAL OUTCOME STORY */}
                <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 pb-8">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <Compass size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">The Outcome</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none">Redefining Contemporary Architecture</h3>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">{activeProject.outcome}</p>
                </div>

                {/* 7. PREVIOUS / NEXT PROJECT NAVIGATION BAR */}
                <div className="border-t border-white/10 pt-12 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                  <button
                    onClick={() => {
                      const currentIdx = PROJECT_DATABASE.findIndex(p => p.id === activeProject.id);
                      const prevIdx = currentIdx === 0 ? PROJECT_DATABASE.length - 1 : currentIdx - 1;
                      setActiveProject(PROJECT_DATABASE[prevIdx]);
                    }}
                    className="px-6 py-3 rounded-full border border-white/10 hover:border-accent bg-white/[0.02] text-zinc-400 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    ← Previous Case Study
                  </button>

                  <button
                    onClick={() => {
                      const currentIdx = PROJECT_DATABASE.findIndex(p => p.id === activeProject.id);
                      const nextIdx = (currentIdx + 1) % PROJECT_DATABASE.length;
                      setActiveProject(PROJECT_DATABASE[nextIdx]);
                    }}
                    className="px-6 py-3 rounded-full border border-white/10 hover:border-accent bg-accent/10 text-accent hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                  >
                    Next Case Study →
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
