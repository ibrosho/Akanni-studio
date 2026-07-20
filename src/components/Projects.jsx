import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Compass, ShieldAlert, Cpu, Search, Maximize2, Layers, Download, Play, Pause, FileText } from 'lucide-react';
import TiltCard from './TiltCard';
import PageTransition from './PageTransition';
import { getMediaUrl } from '../config/media';

// Editorial Case Study Database — 8 Projects with 18 Unique Photo & Video Assets
const RAW_PROJECT_DATABASE = [
  {
    id: "canopy",
    title: "The Canopy Pavilion",
    category: "Biophilic Urbanism",
    client: "Lagos Environmental Trust",
    year: "2026",
    role: "Lead Computational Architect",
    summary: "An open-air civic pavilion utilizing self-shading parametric timber arches and integrated water filtration micro-climates to revive urban public space.",
    heroImage: "/canopy.avif",
    heroVideo: "/pavilion_loop.mp4",
    gallery: ["/canopy.avif", "/courtyard.jpg", "/timber_roo.avif", "/water_reflect.avif"],
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
    heroImage: "/monolith.avif",
    heroVideo: "/aka.mp4",
    gallery: ["/monolith.avif", "/interior_lounge.jpg", "/light_shadow.jpg", "/cliffside.avif"],
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
    heroImage: "/skyscraper.avif",
    heroVideo: "/skyline_loop.mp4",
    gallery: ["/skyscraper.avif", "/facade_detail.avif", "/urban_masterplan.jpg", "/photovoltaic.avif"],
    challenge: "Traditional glass skyscrapers suffer from immense heat gain, resulting in massive HVAC electricity costs. The brief called for a sustainable high-rise that visually reacts to environmental shifts.",
    process: "We developed a parametric, kinetic facade system. Hundreds of automated, lightweight solar fins open and close dynamically based on real-time solar tracking, deflecting direct heat while maintaining ambient daylight.",
    outcome: "An architectural marvel that slashed high-rise cooling costs by 40% while establishing a fluid, shimmering identity along the skyline of Eko Atlantic City.",
    metrics: [
      { label: "Energy Reduction", value: "40%" },
      { label: "Kinetic Shards", value: "1,200+" },
      { label: "Building Height", value: "185 Meters" }
    ]
  },
  {
    id: "nexus",
    title: "Nexus Structural Atelier",
    category: "Computational Design",
    client: "Lagos Spatial Initiative",
    year: "2026",
    role: "Principal Computational Architect",
    summary: "A next-generation research hub exploring parametric timber shell structures and multi-agent spatial generation algorithms.",
    heroImage: "/atelier.avif",
    heroVideo: "/studio_loop.mp4",
    gallery: ["/atelier.avif", "/staircase.avif", "/glass_pavilion.avif", "/courtyard.jpg"],
    challenge: "Developing a fluid spatial layout capable of housing heavy digital fabrication robotics alongside quiet collaborative design suites.",
    process: "Using generative spatial packing algorithms, we sculpted acoustic zoning buffers natively into the concrete structure without solid partition walls.",
    outcome: "A dynamic, high-tech atelier fostering cross-disciplinary computational research in a sunlit biophilic sanctuary.",
    metrics: [
      { label: "Acoustic Damping", value: "-24 dB" },
      { label: "Robotic Bays", value: "8 Active" },
      { label: "Daylight Lux", value: "1,400 lx" }
    ]
  },
  {
    id: "kora",
    title: "Kora Monolithic Villa",
    category: "Residential Architecture",
    client: "Private Client",
    year: "2025",
    role: "Lead Design Strategist",
    summary: "A secluded oceanfront residence integrated directly into volcanic cliff rock formations.",
    heroImage: "/cliffside.avif",
    heroVideo: "/drv.mp4",
    gallery: ["/cliffside.avif", "/water_reflect.avif", "/interior_lounge.jpg", "/monolith.avif"],
    challenge: "Protecting living areas from extreme coastal winds while preserving uninhibited 270-degree ocean views.",
    process: "We carved structural subterranean courtyards that act as wind shields while using triple-laminated acoustic glass panels.",
    outcome: "A serene coastal sanctuary blending brutalist concrete forms with lush native greenery.",
    metrics: [
      { label: "Wind Deflection", value: "85%" },
      { label: "Cliff Anchor Depth", value: "15 Meters" },
      { label: "Glazing Height", value: "4.2 Meters" }
    ]
  },
  {
    id: "eko-kinetic",
    title: "Eko Tech Headquarters",
    category: "Commercial High-Rise",
    client: "Eko Tech District",
    year: "2026",
    role: "Parametric Facade Engineer",
    summary: "A dynamic 30-story commercial tower wrapped in photovoltaic kinetic glass panels.",
    heroImage: "/photovoltaic.avif",
    heroVideo: "/yug.mp4",
    gallery: ["/photovoltaic.avif", "/facade_detail.avif", "/urban_masterplan.jpg", "/skyscraper.avif"],
    challenge: "Generating clean solar energy on-site while avoiding internal glare for office workers.",
    process: "Engineered semi-transparent solar glass panels that tilt dynamically with sun position.",
    outcome: "Generates 25% of its own annual electrical demand natively from solar facade harvesting.",
    metrics: [
      { label: "Solar Generation", value: "250 kW/h" },
      { label: "Glare Reduction", value: "70%" },
      { label: "Building Height", value: "135 Meters" }
    ]
  },
  {
    id: "horizon",
    title: "Atelier Horizon Cultural Center",
    category: "Cultural & Civic",
    client: "Federal Ministry of Spatial Development",
    year: "2026",
    role: "Masterplan Consultant",
    summary: "A sweeping civic museum celebrating West African architectural heritage and computational art.",
    heroImage: "/museum.avif",
    heroVideo: "/yum.mp4",
    gallery: ["/museum.avif", "/bridge.jpg", "/staircase.avif", "/sunshaft.avif"],
    challenge: "Creating a massive column-free exhibition hall spanning over 60 meters.",
    process: "Utilized post-tensioned hyperbolic paraboloid concrete roof shells.",
    outcome: "An iconic cultural landmark receiving international acclaim for structural elegance.",
    metrics: [
      { label: "Column-Free Span", value: "62 Meters" },
      { label: "Visitor Capacity", value: "3,500/day" },
      { label: "Roof Thickness", value: "180 mm" }
    ]
  },
  {
    id: "solaria",
    title: "Solaria Clean Energy Pavilion",
    category: "Biophilic Urbanism",
    client: "West Africa Solar Trust",
    year: "2025",
    role: "Environmental Systems Lead",
    summary: "A self-sustaining public educational center powered completely by solar timber pergolas.",
    heroImage: "/sunshaft.avif",
    heroVideo: "/aka2.mp4",
    gallery: ["/sunshaft.avif", "/glass_pavilion.avif", "/timber_roo.avif", "/courtyard.jpg"],
    challenge: "Designing a public pavilion that operates off-grid in extreme tropical humidity.",
    process: "Integrated desiccant dehumidification systems driven by solar thermal heat pipes.",
    outcome: "An educational beacon teaching sustainable urbanism to thousands of visitors monthly.",
    metrics: [
      { label: "Off-Grid Power", value: "100%" },
      { label: "Water Harvested", value: "5,000 L/mo" },
      { label: "Shade Area", value: "1,200 m²" }
    ]
  }
];

const PROJECT_DATABASE = RAW_PROJECT_DATABASE.map((proj) => ({
  ...proj,
  heroVideo: getMediaUrl(proj.heroVideo)
}));

const CATEGORIES = ["ALL", "Biophilic Urbanism", "Residential Architecture", "Commercial High-Rise", "Computational Design", "Cultural & Civic"];

export default function Projects() {
  const [activeProject, setActiveProject] = useState(null);
  const [blueprintMode, setBlueprintMode] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const modalRef = useRef(null);

  // Lock background Lenis smooth scroll & auto scroll modal to top
  useEffect(() => {
    if (activeProject || lightboxImage) {
      window.__lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (activeProject && modalRef.current) {
        modalRef.current.scrollTop = 0;
      }
    } else {
      window.__lenis?.start();
      document.body.style.overflow = '';
    }
    return () => {
      window.__lenis?.start();
      document.body.style.overflow = '';
    };
  }, [activeProject, lightboxImage]);

  // Escape key listener to close active modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else if (activeProject) setActiveProject(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, activeProject]);

  // Filter Logic
  const filteredProjects = useMemo(() => {
    return PROJECT_DATABASE.filter((proj) => {
      const matchesCategory = activeCategory === "ALL" || proj.category === activeCategory;
      const matchesSearch = 
        proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proj.role.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Architectural Spec Sheet PDF Downloader
  const handleDownloadSpec = (project) => {
    const specContent = `
AKANNI STUDIOS — ARCHITECTURAL SPECIFICATION SHEET
==================================================
Project Name: ${project.title}
Category: ${project.category}
Client: ${project.client}
Year: ${project.year}
Role: ${project.role}
Location: Lagos, Nigeria

EXECUTIVE SUMMARY:
${project.summary}

THE CHALLENGE:
${project.challenge}

COMPUTATIONAL & MATERIAL PROCESS:
${project.process}

STRUCTURAL METRICS:
${project.metrics.map(m => `- ${m.label}: ${m.value}`).join('\n')}

OUTCOME:
${project.outcome}

(c) 2026 Akanni Studios. All Rights Reserved.
    `;
    const blob = new Blob([specContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.id}_architectural_spec_sheet.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <div className="w-full min-h-screen pb-32 text-left">
        
        {/* Page Title Header */}
        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-[0.35em] text-accent uppercase mb-3">Selected Portfolios</p>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            ARCHIVE <span className="font-light italic text-zinc-500 lowercase">&</span> STORIES
          </h2>
          <div className="h-[1px] bg-white/10 mt-8 w-full" />
        </div>

        {/* Search & Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects, clients, roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/[0.02] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[9px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                  activeCategory === cat
                    ? "bg-accent text-black border-accent font-bold shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                    : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white hover:border-white/30"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout (Parametric Masonry Staggered Aesthetic) */}
        {filteredProjects.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-3xl">
            No architectural projects matched your query.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-10">
            {filteredProjects.map((project, idx) => {
              const pattern = idx % 5;
              const colSpan = pattern === 0 ? "md:col-span-7" : pattern === 1 ? "md:col-span-5" : pattern === 2 ? "md:col-span-12" : pattern === 3 ? "md:col-span-6" : "md:col-span-6";
              const aspectClass = pattern === 0 ? "aspect-[4/3]" : pattern === 1 ? "aspect-[4/5] h-full" : pattern === 2 ? "aspect-[16/7] md:aspect-[21/9]" : "aspect-[16/10]";
              
              return (
                <SectionReveal key={project.id} className={colSpan}>
                  <div onClick={() => setActiveProject(project)} className="group cursor-pointer">
                    <TiltCard className={`w-full ${aspectClass} rounded-[2rem] overflow-hidden border border-white/[0.06] bg-zinc-950 relative`}>
                      
                      {/* Video or Image Background Loop */}
                      <div className="absolute inset-0 w-full h-full overflow-hidden">
                        {project.heroVideo ? (
                          <video 
                            autoPlay 
                            loop 
                            muted 
                            playsInline 
                            poster={project.heroImage}
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-85"
                          >
                            <source src={project.heroVideo} type="video/mp4" />
                          </video>
                        ) : (
                          <img 
                            src={project.heroImage} 
                            alt={project.title} 
                            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 opacity-60 group-hover:opacity-85" 
                          />
                        )}
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
                      <div className="absolute top-4 right-4 sm:top-8 sm:right-8 z-20 text-[10px] font-mono text-white/40 font-bold">
                        0{idx + 1}
                      </div>
                    </TiltCard>
                  </div>
                </SectionReveal>
              );
            })}
          </div>
        )}

        {/* FULL SCREEN MAGAZINE DETAILED VIEW MODAL */}
        <AnimatePresence>
          {activeProject && (
            <motion.div 
              ref={modalRef}
              data-lenis-prevent="true"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] bg-luxury-black overflow-y-auto px-4 pt-16 pb-20 sm:p-12 lg:p-20 scrollbar-none"
            >
              {/* Modal Exit & Spec Download Controls */}
              <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
                <button
                  onClick={() => handleDownloadSpec(activeProject)}
                  className="px-4 py-2.5 rounded-full border border-accent/30 bg-black/80 backdrop-blur-md text-accent hover:bg-accent hover:text-black font-mono text-[9px] uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                >
                  <Download size={12} /> Spec Sheet PDF
                </button>
                <button 
                  onClick={() => setActiveProject(null)}
                  className="w-12 h-12 rounded-full border border-luxury-border bg-luxury-black/80 backdrop-blur-md flex items-center justify-center text-neutral-muted hover:text-neutral-warm hover:border-accent transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="max-w-5xl mx-auto space-y-16">
                
                {/* 1. HERO SECTION */}
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

                {/* 3. HERO SHOWCASE VIDEO LOOP / RENDER DISPLAY */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-luxury-border">
                    <span className="text-[9px] font-mono uppercase tracking-widest text-neutral-muted">Visualization & Cinematic Engine</span>
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

                  <div className="relative group w-full aspect-[16/9] sm:aspect-[21/9] rounded-3xl overflow-hidden border border-luxury-border bg-black/90 flex items-center justify-center shadow-2xl">
                    {activeProject.heroVideo ? (
                      <video 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        poster={activeProject.heroImage}
                        className={`w-full h-full object-cover cursor-pointer transition-all duration-500 ${
                          blueprintMode ? 'grayscale contrast-[1.25] invert brightness-[0.75] hue-rotate-[180deg] mix-blend-screen opacity-90' : ''
                        }`} 
                        onClick={() => setLightboxImage(activeProject.heroImage)}
                      >
                        <source src={activeProject.heroVideo} type="video/mp4" />
                      </video>
                    ) : (
                      <img 
                        src={activeProject.heroImage} 
                        alt="Main Showcase Render" 
                        onClick={() => setLightboxImage(activeProject.heroImage)}
                        className={`w-full h-full object-cover cursor-pointer transition-all duration-500 ${
                          blueprintMode ? 'grayscale contrast-[1.25] invert brightness-[0.75] hue-rotate-[180deg] mix-blend-screen opacity-90' : ''
                        }`} 
                      />
                    )}

                    <button
                      onClick={() => setLightboxImage(activeProject.heroImage)}
                      className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white font-mono text-[9px] uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-md"
                    >
                      <Maximize2 size={12} className="text-accent" /> Full Screen Preview
                    </button>

                    {blueprintMode && (
                      <div className="absolute inset-0 bg-cyan-950/20 pointer-events-none mix-blend-screen overflow-hidden">
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#00f5d4_1px,transparent_1px),linear-gradient(to_bottom,#00f5d4_1px,transparent_1px)] bg-[size:32px_32px]" />
                        <svg className="absolute inset-0 w-full h-full text-accent/40 p-4 font-mono select-none" viewBox="0 0 800 450" fill="none" stroke="currentColor" strokeWidth="0.75">
                          <path d="M 20 50 L 20 20 L 50 20" />
                          <path d="M 750 20 L 780 20 L 780 50" />
                          <path d="M 20 400 L 20 430 L 50 430" />
                          <path d="M 750 430 L 780 430 L 780 400" />
                          <line x1="80" y1="380" x2="380" y2="380" strokeDasharray="4,4" />
                          <text x="230" y="372" fontSize="7" textAnchor="middle" fill="#00f5d4" className="font-semibold">DIMENSION A: 14.52m</text>
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

                {/* 6. PROJECT GALLERY STRIP */}
                {activeProject.gallery && activeProject.gallery.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-white/10">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-widest font-bold">
                      <Layers size={12} /> Case Study Visual Assets (Tap to Expand)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {activeProject.gallery.map((imgSrc, idx) => (
                        <div 
                          key={idx} 
                          onClick={() => setLightboxImage(imgSrc)}
                          className="group aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer relative"
                        >
                          <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 size={16} className="text-accent" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 7. FINAL OUTCOME STORY */}
                <div className="text-center max-w-3xl mx-auto space-y-6 pt-4 pb-8">
                  <div className="flex items-center justify-center gap-2 text-accent">
                    <Compass size={14} />
                    <span className="text-[10px] font-mono uppercase tracking-widest font-bold">The Outcome</span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight leading-none">Redefining Contemporary Architecture</h3>
                  <p className="text-zinc-400 text-base font-light leading-relaxed">{activeProject.outcome}</p>
                </div>

                {/* 8. PREVIOUS / NEXT PROJECT NAVIGATION BAR */}
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

        {/* LIGHTBOX MODAL FOR FULL SCREEN UNCROPPED IMAGE PREVIEW */}
        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100000] bg-black/95 flex items-center justify-center p-4 backdrop-blur-2xl"
              onClick={() => setLightboxImage(null)}
            >
              <button
                onClick={() => setLightboxImage(null)}
                className="fixed top-8 right-8 w-12 h-12 rounded-full border border-white/20 bg-black/80 flex items-center justify-center text-white hover:text-accent hover:border-accent transition-all cursor-pointer z-50"
              >
                <X size={20} />
              </button>

              <div className="relative max-w-7xl max-h-[90vh] flex items-center justify-center overflow-hidden" onClick={(e) => e.stopPropagation()}>
                <img
                  src={lightboxImage}
                  alt="Full Picture View"
                  className="max-w-full max-h-[85vh] w-auto h-auto object-contain rounded-2xl border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
