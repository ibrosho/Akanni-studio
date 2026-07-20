import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, Share2, ArrowUpRight, Clock, X, Maximize2, Layers } from 'lucide-react';
import { useAuth } from './AuthContext';
import PageTransition from './PageTransition';
import { SectionReveal } from './Reveal';

// Expanded Architectural Insights Database
const INSIGHTS_ARTICLES = [
  {
    id: 1,
    title: "The Poetry of Raw Concrete: Brutalism in Modern Coastal Architecture",
    category: "Spatial Design",
    date: "JULY 2026",
    readTime: 5,
    summary: "An exploration into how low-carbon volcanic concrete mixes stand up against coastal salt erosion while maintaining a pure, uncompromising geometric form language.",
    body: `Brutalism in contemporary architecture is experiencing a monumental renaissance. Far from the oppressive grey monolithic structures of the mid-20th century, contemporary brutalist design embraces material authenticity, micro-textured aggregate mixes, and biophilic light integration.

By leveraging volcanic ash, low-carbon additives, and subterranean counterweight anchors, architects can now span immense structural cantilevers over Atlantic coastlines without succumbing to saline corrosion or structural fatigue.

Key Structural Innovations:
1. Volcanic Ash PoZZolan Mixes — Reduces carbon footprint by 35% while increasing compressive density.
2. Hydrophobic Sealant Coatings — Prevents salt-air intrusion into internal steel rebar matrix.
3. Subterranean Counterweights — Enables 12-meter gravity-defying cantilever overhangs.`,
    featured: true,
    image: "/in1.avif",
    gallery: ["/in1.avif", "pal.avif", "rol.avif"]
  },
  {
    id: 2,
    title: "Monogram Mechanics: Crafting Minimalist Visual Identities That Last",
    category: "Branding",
    date: "JUNE 2026",
    readTime: 4,
    summary: "Breaking down the mathematical balance behind designing vector monograms that scale flawlessly from digital viewports down to custom laser-cut textures.",
    image: "/in2.avif",
    gallery: ["/in2.avif", "in3.avif"]
  },
  {
    id: 3,
    title: "Biophilic Frameworks: Engineering Self-Cooling Public Pavilions",
    category: "Architecture",
    date: "MAY 2026",
    readTime: 7,
    summary: "How parametric timber curves and passive architectural air-funnels can lower localized micro-climate temperatures dynamically without relying on electrical grids.",
    body: `Urban heat islands represent one of the greatest challenges in tropical metropolitan centers like Lagos. By combining computational fluid dynamics (CFD) with parametric timber louver arrays, passive structural cooling can achieve up to a 6°C reduction in ambient temperature natively.

The pavilion utilizes 142 unique CNC-milled glue-laminated timber arches. Rainwater harvested from the canopy roof feeds integrated misting nozzles that utilize Bernoullian air pressure differentials to generate micro-climates without pumps.`,
    featured: false,
    image: "pal.avif",
    gallery: ["pal.avif", "rol.avif", "sky.avif"]
  },
  {
    id: 4,
    title: "Tactile Luxury: The Return of Heavy-Weight Premium Print Formats",
    category: "Production",
    date: "APRIL 2026",
    readTime: 3,
    summary: "Why digital-first brands are investing heavily in physical touchpoints, debossed premium paper stocks, and high-contrast branding layouts.",
    body: `In an era dominated by ephemeral digital interactions, physical print artifacts carry elevated prestige. A debossed 600gsm cotton card with foil-stamped architectural monograms creates an unmistakable haptic impression that digital screens cannot replicate.

Production Standards:
- Paper Stock: 600gsm Uncoated Italian Cotton Rag.
- Finishing: Blind Deboss with Micro-Foil Accents.
- Edge Trim: Gilded Cyan Foil Edge Dyeing.`,
    featured: false,
    image: "in3.avif",
    gallery: ["in3.avif", "/in2.avif"]
  },
  {
    id: 5,
    title: "Parametric Cantilevers: Volcanic Ash & Structural Dynamics",
    category: "Spatial Design",
    date: "MARCH 2026",
    readTime: 6,
    summary: "Deep dive into structural calculations for cantilevered residential slabs over volatile coastal soil profiles.",
    body: `When designing the Mizora Monolith, soil borings revealed a high water table and sand-silt composition. Standard shallow foundations would result in differential settling under high moment loads from the cantilevered upper floor.

Our engineering team implemented 18-meter friction piers coupled with a subterranean concrete counterweight box filled with high-density iron ore slag. This anchor holds the upper 12-meter cantilever in equilibrium even under category 3 wind shear.`,
    featured: false,
    image: "rol.avif",
    gallery: ["rol.avif", "pal.avif"]
  },
  {
    id: 6,
    title: "Kinetic Solar Facades: Reducing Commercial HVAC Loads by 40%",
    category: "Architecture",
    date: "FEBRUARY 2026",
    readTime: 8,
    summary: "Engineering dynamic solar-tracking louvers that mitigate direct heat gain while preserving natural daylighting in commercial towers.",
    body: `The Zenith Tower facade incorporates 1,200 dynamic kinetic shading panels controlled by a centralized BACnet building automation system. Each panel adjusts its orientation angle every 15 minutes to track solar azimuth and elevation.

This kinetic skin reduces direct thermal solar gain by 52% during peak midday hours, translating directly into a 40% reduction in chiller tonnage requirements for HVAC operations.`,
    featured: false,
    image: "sky.avif",
    gallery: ["sky.avif", "rol.avif"]
  },
  {
    id: 7,
    title: "Computational Monoliths: Subterranean Counterweight Anchors",
    category: "Spatial Design",
    date: "JANUARY 2026",
    readTime: 5,
    summary: "Exploring how heavy mass structures achieve visual weightlessness through concealed structural engineering.",
    body: `Minimalist architecture relies on the illusion of simplicity. Behind a floating concrete beam lies complex stress tensors, post-tensioned steel cables, and load-transfer diaphragms.

This paper breaks down the finite element modeling (FEM) procedures used to simulate stress distribution across multi-axis joint connections in raw concrete monoliths.`,
    featured: false,
    image: "/in1.avif",
    gallery: ["/in1.avif", "sky.avif"]
  },
  {
    id: 8,
    title: "Vector Typographic Grids: Laser-Cut Architectural Signage",
    category: "Branding",
    date: "DECEMBER 2025",
    readTime: 4,
    summary: "Translating digital brand typography into physical spatial orientation markers and anodized aluminum wayfinding systems.",
    body: `Wayfinding in large architectural complexes requires legibility at varying viewing angles and distances. We utilize custom typographic kerning tables optimized specifically for back-lit stainless steel and matte black anodized aluminum substrates.`,
    featured: false,
    image: "/in2.avif",
    gallery: ["/in2.avif", "in3.avif"]
  }
];

const CATEGORIES = ["ALL", "Spatial Design", "Branding", "Architecture", "Production"];

export default function Insights() {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest"); // latest | shortest | longest
  const [readingArticle, setReadingArticle] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const modalRef = useRef(null);

  // Lock background Lenis smooth scroll & scroll modal to top when reading
  useEffect(() => {
    if (readingArticle || lightboxImage) {
      window.__lenis?.stop();
      document.body.style.overflow = 'hidden';
      if (readingArticle && modalRef.current) {
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
  }, [readingArticle, lightboxImage]);

  // Bookmarks persistence
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('arc_bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleBookmark = (id, e) => {
    if (e) e.stopPropagation();
    let next;
    if (bookmarks.includes(id)) {
      next = bookmarks.filter(b => b !== id);
      showToast("Article removed from saved library.", "info");
    } else {
      next = [...bookmarks, id];
      showToast("Article saved to your studio library.", "info");
    }
    setBookmarks(next);
    localStorage.setItem('arc_bookmarks', JSON.stringify(next));
  };

  const handleShare = (article, e) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/insights#article-${article.id}`);
    showToast("Article reference link copied to clipboard.", "info");
  };

  // Filter & Sort Logic
  const processedArticles = useMemo(() => {
    return INSIGHTS_ARTICLES
      .filter((art) => {
        const matchesCategory = activeCategory === "ALL" || art.category === activeCategory;
        const matchesSearch = 
          art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.body.toLowerCase().includes(searchQuery.toLowerCase()) ||
          art.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "shortest") return a.readTime - b.readTime;
        if (sortBy === "longest") return b.readTime - a.readTime;
        return b.id - a.id;
      });
  }, [activeCategory, searchQuery, sortBy]);

  const handleScrollModal = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = Math.min(Math.round((scrollTop / (scrollHeight - clientHeight)) * 100), 100);
    setScrollProgress(progress);
  };

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <div className="w-full min-h-screen pb-32 text-left">
        
        {/* 1. HEADER SECTION */}
        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-[0.35em] text-accent uppercase mb-3">Studio Journals</p>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            INSIGHTS <span className="font-light italic text-zinc-500 lowercase">&</span> IDEAS
          </h2>
          <div className="h-[1px] bg-white/10 mt-8 w-full" />
        </div>

        {/* 2. SEARCH & FILTER CONTROLS BAR */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center mb-10">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search essays, design systems, materials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-full bg-white/[0.02] border border-white/10 text-white placeholder-zinc-500 text-xs font-mono focus:outline-none focus:border-accent transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-3">
            <span className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 rounded-full bg-black border border-white/10 text-white font-mono text-[10px] uppercase tracking-wider focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value="latest">Latest First</option>
              <option value="shortest">Shortest Read</option>
              <option value="longest">Longest Read</option>
            </select>
          </div>
        </div>

        {/* 3. CATEGORY TABS */}
        <div className="flex flex-wrap gap-2.5 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-accent text-black border-accent font-bold shadow-[0_0_15px_rgba(0,245,212,0.2)]"
                  : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 4. ARTICLES GRID */}
        {processedArticles.length === 0 ? (
          <div className="py-20 text-center text-zinc-500 font-mono text-xs uppercase tracking-widest border border-dashed border-white/10 rounded-3xl">
            No architectural essays matched your search query.
          </div>
        ) : (
          <div className="space-y-12">
            {/* FEATURED BANNER ARTICLE */}
            {processedArticles.filter(a => a.featured && activeCategory === "ALL" && !searchQuery).map((article) => (
              <SectionReveal key={article.id}>
                <div 
                  onClick={() => { setReadingArticle(article); setScrollProgress(0); }}
                  className="group cursor-pointer block border border-white/[0.06] bg-zinc-950/40 rounded-3xl overflow-hidden hover:border-accent/40 transition-all duration-500 shadow-xl"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-zinc-900">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />
                    </div>
                    
                    <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between items-start">
                      <div className="space-y-6">
                        <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
                          <span className="text-accent font-bold uppercase tracking-widest">{article.category}</span>
                          <span>•</span>
                          <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime} MIN READ</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight group-hover:text-accent transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center justify-between w-full pt-8 mt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-400 group-hover:text-white transition-colors">
                          <span>Read Essay</span>
                          <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-accent" />
                        </div>

                        <div className="flex items-center gap-2">
                          <button 
                            onClick={(e) => toggleBookmark(article.id, e)}
                            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-accent transition-colors"
                          >
                            <Bookmark size={14} className={bookmarks.includes(article.id) ? "fill-accent text-accent" : ""} />
                          </button>
                          <button 
                            onClick={(e) => handleShare(article, e)}
                            className="p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-accent transition-colors"
                          >
                            <Share2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}

            {/* STANDARD GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {processedArticles.filter(a => !a.featured || activeCategory !== "ALL" || searchQuery).map((article) => (
                <SectionReveal key={article.id}>
                  <div 
                    onClick={() => { setReadingArticle(article); setScrollProgress(0); }}
                    className="group cursor-pointer flex flex-col justify-between border border-white/[0.06] bg-zinc-950/20 rounded-3xl p-6 hover:border-accent/30 hover:bg-zinc-950/60 transition-all duration-300 h-full"
                  >
                    <div className="space-y-4">
                      <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.04]">
                        <img 
                          src={article.image} 
                          alt={article.title} 
                          className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                        />
                      </div>

                      <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
                        <span className="text-accent uppercase font-bold tracking-wider">{article.category}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {article.readTime} MIN READ</span>
                      </div>

                      <h4 className="text-lg font-bold uppercase text-white tracking-tight leading-snug group-hover:text-accent transition-colors">
                        {article.title}
                      </h4>
                      
                      <p className="text-zinc-400 font-light text-xs line-clamp-3 leading-relaxed">
                        {article.summary}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t border-white/[0.04] mt-6 text-[9px] font-mono text-zinc-500">
                      <span>{article.date}</span>
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => toggleBookmark(article.id, e)}
                          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-accent transition-colors"
                        >
                          <Bookmark size={12} className={bookmarks.includes(article.id) ? "fill-accent text-accent" : ""} />
                        </button>
                        <button 
                          onClick={(e) => handleShare(article, e)}
                          className="p-1.5 rounded-full hover:bg-white/10 text-zinc-400 hover:text-accent transition-colors"
                        >
                          <Share2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        )}

        {/* READ ARTICLE FULL-SCREEN MODAL WITH UNCROPPED IMAGE & GALLERY */}
        <AnimatePresence>
          {readingArticle && (
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[99999] bg-luxury-black overflow-y-auto"
              onScroll={handleScrollModal}
            >
              {/* Top Sticky Reading Progress Bar */}
              <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-white/10">
                <div className="h-full bg-accent transition-all duration-150" style={{ width: `${scrollProgress}%` }} />
              </div>

              {/* Top Exit & Action Controls */}
              <div className="fixed top-8 right-8 z-50 flex items-center gap-3">
                <button
                  onClick={(e) => toggleBookmark(readingArticle.id, e)}
                  className="w-12 h-12 rounded-full border border-luxury-border bg-luxury-black/80 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-accent hover:border-accent transition-all cursor-pointer"
                >
                  <Bookmark size={16} className={bookmarks.includes(readingArticle.id) ? "fill-accent text-accent" : ""} />
                </button>
                
                <button
                  onClick={(e) => handleShare(readingArticle, e)}
                  className="w-12 h-12 rounded-full border border-luxury-border bg-luxury-black/80 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-accent hover:border-accent transition-all cursor-pointer"
                >
                  <Share2 size={16} />
                </button>

                <button
                  onClick={() => setReadingArticle(null)}
                  className="w-12 h-12 rounded-full border border-luxury-border bg-luxury-black/80 backdrop-blur-md flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Essay Content Container */}
              <div className="max-w-4xl mx-auto px-6 pt-24 pb-32 space-y-8 text-left">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 font-mono text-[10px] text-accent uppercase tracking-widest">
                    <span>{readingArticle.category}</span>
                    <span>•</span>
                    <span>{readingArticle.date}</span>
                    <span>•</span>
                    <span>{readingArticle.readTime} MIN READ</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight leading-tight">
                    {readingArticle.title}
                  </h1>
                </div>

                {/* UNCROPPED HERO IMAGE CONTAINER WITH LIGHTBOX CLICK */}
                <div className="relative group w-full max-h-[50vh] sm:max-h-[480px] rounded-2xl overflow-hidden border border-white/10 bg-black/90 flex items-center justify-center my-6 shadow-2xl">
                  <img 
                    src={readingArticle.image} 
                    alt={readingArticle.title} 
                    className="max-w-full max-h-[48vh] sm:max-h-[460px] w-auto h-auto object-contain cursor-pointer transition-transform duration-500 group-hover:scale-[1.01]" 
                    onClick={() => setLightboxImage(readingArticle.image)}
                  />
                  <button
                    onClick={() => setLightboxImage(readingArticle.image)}
                    className="absolute bottom-4 right-4 px-4 py-2 rounded-full bg-black/80 border border-white/20 text-white font-mono text-[9px] uppercase tracking-widest flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-md"
                  >
                    <Maximize2 size={12} className="text-accent" /> View Fullscreen Picture
                  </button>
                </div>

                {/* ESSAY BODY NARRATIVE */}
                <div className="space-y-6 text-zinc-300 font-light text-base sm:text-lg leading-relaxed whitespace-pre-line antialiased">
                  {readingArticle.body || readingArticle.summary}
                </div>

                {/* ARTICLE GALLERY STRIP */}
                {readingArticle.gallery && readingArticle.gallery.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-widest font-bold">
                      <Layers size={12} /> Spatial Photographic Gallery (Tap to Expand)
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {readingArticle.gallery.map((imgSrc, idx) => (
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
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* FULLSCREEN LIGHTBOX MODAL FOR UNCROPPED PICTURE INSPECTION */}
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
