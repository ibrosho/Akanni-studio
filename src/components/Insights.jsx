import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, Share2, ArrowUpRight, Clock, X, Maximize2, Layers, Download } from 'lucide-react';
import { useAuth } from './AuthContext';
import PageTransition from './PageTransition';
import { SectionReveal } from './Reveal';
import { getMediaUrl } from '../config/media';
import OptimizedImage from './OptimizedImage';
import OptimizedVideo from './OptimizedVideo';
import { preloadAssetList } from '../utils/preloader';

// Expanded Architectural Insights Database — 8 Essays with 18 Unique Photo Assets
const RAW_INSIGHTS_ARTICLES = [
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
1. Volcanic Ash Pozzolan Mixes — Reduces carbon footprint by 35% while increasing compressive density.
2. Hydrophobic Sealant Coatings — Prevents salt-air intrusion into internal steel rebar matrix.
3. Subterranean Counterweights — Enables 12-meter gravity-defying cantilever overhangs.`,
    featured: true,
    image: "/monolith.avif",
    video: "/aka.mp4",
    gallery: ["/monolith.avif", "/interior_lounge.jpg", "/light_shadow.jpg", "/sunshaft.avif"]
  },
  {
    id: 2,
    title: "Monogram Mechanics: Crafting Minimalist Visual Identities That Last",
    category: "Branding",
    date: "JUNE 2026",
    readTime: 4,
    summary: "Breaking down the mathematical balance behind designing vector monograms that scale flawlessly from digital viewports down to custom laser-cut textures.",
    body: `A logo for an architectural firm must communicate spatial integrity in two dimensions. Monogram design requires an understanding of stroke weight, negative space balance, and geometric symmetry.

In this editorial piece, we examine vector control points, optical curve alignment, and how to engineer monograms that retain absolute visual clarity across digital displays and physical embossing.`,
    featured: false,
    image: "/atelier.avif",
    video: "/studio_loop.mp4",
    gallery: ["/atelier.avif", "/staircase.avif", "/facade_detail.avif"]
  },
  {
    id: 3,
    title: "Parametric Timber Pergolas: Zero-Carbon Biophilic Shading Systems",
    category: "Architecture",
    date: "MAY 2026",
    readTime: 6,
    summary: "How computational algorithms optimize timber curves to maximize passive cooling while minimizing structural weight and material waste.",
    body: `As tropical cities expand, urban heat islands threaten outdoor civic engagement. The Canopy Pavilion demonstrates how parametric timber pergolas can passively lower ambient temperatures by up to 6°C natively without mechanical HVAC systems.

Using multi-variable computational fluid dynamics, timber ribs are curved to channel prevailing sea breezes through integrated micro-misting nozzles fed by harvested rainwater.`,
    featured: false,
    image: "/canopy.avif",
    video: "/pavilion_loop.mp4",
    gallery: ["/canopy.avif", "/timber_roo.avif", "/courtyard.jpg"]
  },
  {
    id: 4,
    title: "High-Performance Facades: Kinetic Shading for High-Rise Efficiency",
    category: "Production",
    date: "APRIL 2026",
    readTime: 7,
    summary: "A deep dive into automated solar-tracking kinetic facades that slash commercial cooling demands by over 40%.",
    body: `High-rise commercial architecture faces an existential sustainability challenge: direct solar glare. Traditional reflective glass creates urban heat reflection, while static blinds obscure interior daylight.

By wrapping skyscrapers in automated photovoltaic kinetic shards, building envelopes actively track solar trajectories, deflecting peak heat radiation while generating zero-carbon electricity on-site.`,
    featured: false,
    image: "/skyscraper.avif",
    video: "/skyline_loop.mp4",
    gallery: ["/skyscraper.avif", "/photovoltaic.avif", "/urban_masterplan.jpg"]
  },
  {
    id: 5,
    title: "Volcanic Cantilevers: Engineering Gravity-Defying Minimalist Spans",
    category: "Architecture",
    date: "MARCH 2026",
    readTime: 6,
    summary: "Analyzing subterranean counterweight engineering and carbon-neutral volcanic aggregates in luxury coastal residences.",
    body: `Creating a 12-meter cantilever overhang over an ocean cliff requires re-engineering standard concrete formulas. By blending local volcanic aggregate with high-tensile steel tendons, structural engineers can balance immense rotational moments without visible vertical columns.`,
    featured: false,
    image: "/cliffside.avif",
    video: "/drv.mp4",
    gallery: ["/cliffside.avif", "/water_reflect.avif", "/light_shadow.jpg"]
  },
  {
    id: 6,
    title: "Subterranean Light Wells: Sculpting Daylight in Concrete Sanctuaries",
    category: "Spatial Design",
    date: "FEBRUARY 2026",
    readTime: 5,
    summary: "Funneling natural daylight into subterranean spaces using parabolic light tubes and polished concrete reflectors.",
    body: `Lighting below-ground spaces without artificial glare is an art form. By sculpting parabolic ceiling light shafts lined with polished concrete, ambient sunlight is diffused evenly into lower-level studio galleries.`,
    featured: false,
    image: "/sunshaft.avif",
    video: "/aka2.mp4",
    gallery: ["/sunshaft.avif", "/glass_pavilion.avif", "/interior_lounge.jpg"]
  },
  {
    id: 7,
    title: "Typographic Wayfinding in Public Infrastructure",
    category: "Branding",
    date: "JANUARY 2026",
    readTime: 4,
    summary: "Designing legibility, contrast, and spatial hierarchy for high-density transport nodes and civic plazas.",
    body: `Environmental graphic design bridging typography and civic space requires testing font weight against sunlight glare and viewing distances. We dissect directional signage design engineered for public transit hubs.`,
    featured: false,
    image: "/museum.avif",
    video: "/yum.mp4",
    gallery: ["/museum.avif", "/bridge.jpg", "/staircase.avif"]
  },
  {
    id: 8,
    title: "Computational Micro-Climates in Tropical Urbanism",
    category: "Production",
    date: "DECEMBER 2025",
    readTime: 8,
    summary: "Deploying sensor networks and generative rain harvesting to create cool public micro-climates.",
    body: `Integrating real-time environmental sensors into urban pergolas enables automated water misting cycles during peak heat hours, transforming scorching concrete plazas into cool public sanctuaries.`,
    featured: false,
    image: "/photovoltaic.avif",
    video: "/yug.mp4",
    gallery: ["/photovoltaic.avif", "/urban_masterplan.jpg", "/courtyard.jpg"]
  }
];

const CATEGORIES = ["ALL", "Spatial Design", "Branding", "Architecture", "Production"];

const INSIGHTS_ARTICLES = RAW_INSIGHTS_ARTICLES.map((article) => ({
  ...article,
  image: getMediaUrl(article.image, "image"),
  video: article.video ? getMediaUrl(article.video, "video") : null,
  gallery: (article.gallery || []).map((img) => getMediaUrl(img, "image"))
}));

export default function Insights() {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest");
  const [readingArticle, setReadingArticle] = useState(null);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Preload article cover assets on initial load
  useEffect(() => {
    const assetsToPreload = INSIGHTS_ARTICLES.flatMap(a => [a.image, a.video].filter(Boolean));
    preloadAssetList(assetsToPreload);
  }, []);
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

  // Escape key listener to close active modals
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (lightboxImage) setLightboxImage(null);
        else if (readingArticle) setReadingArticle(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxImage, readingArticle]);

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

          <div className="flex flex-wrap gap-2 items-center">
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

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1.5 rounded-full bg-black border border-white/10 text-zinc-400 text-[9px] font-mono uppercase focus:outline-none cursor-pointer"
            >
              <option value="latest">Sort: Latest</option>
              <option value="shortest">Sort: Shortest Read</option>
              <option value="longest">Sort: Longest Read</option>
            </select>
          </div>
        </div>

        {/* 3. ARTICLES GRID */}
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
                    <div className="lg:col-span-7 aspect-[16/10] sm:aspect-[16/9] min-h-[320px] max-h-[460px] relative overflow-hidden bg-zinc-900">
                      <OptimizedImage
                        src={article.image}
                        alt={article.title}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {article.video && (
                        <OptimizedVideo
                          src={article.video}
                          poster={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent pointer-events-none" />
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
                        <p className="text-zinc-400 font-light text-sm line-clamp-3 leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 mt-8 text-[10px] font-mono text-accent uppercase tracking-widest font-bold">
                        <span>Read Full Editorial</span>
                        <ArrowUpRight size={12} className="transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            ))}

            {/* REGULAR ESSAYS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {processedArticles.filter(a => !(a.featured && activeCategory === "ALL" && !searchQuery)).map((article) => (
                <SectionReveal key={article.id}>
                  <div 
                    onClick={() => { setReadingArticle(article); setScrollProgress(0); }}
                    className="group cursor-pointer border border-white/[0.06] bg-zinc-950/40 rounded-3xl p-6 flex flex-col justify-between hover:border-accent/40 transition-all duration-500 shadow-xl h-full"
                  >
                    <div className="space-y-5">
                      <div className="aspect-[16/10] rounded-2xl overflow-hidden relative bg-zinc-900">
                        <OptimizedImage
                          src={article.image}
                          alt={article.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                        />
                        {article.video && (
                          <OptimizedVideo
                            src={article.video}
                            poster={article.image}
                            alt={article.title}
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-0 group-hover:opacity-100"
                          />
                        )}
                        <div className="absolute top-3 right-3 text-[9px] font-mono bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-accent border border-white/10 uppercase z-10">
                          {article.category}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
                        <span>{article.date}</span>
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
              data-lenis-prevent="true"
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

                {/* HERO SHOWCASE VIDEO / IMAGE DISPLAY */}
                <div className="relative group w-full aspect-[16/9] sm:aspect-[21/9] rounded-2xl overflow-hidden border border-white/10 bg-black/90 flex items-center justify-center my-6 shadow-2xl">
                  {readingArticle.video ? (
                    <OptimizedVideo
                      src={readingArticle.video}
                      poster={readingArticle.image}
                      alt={readingArticle.title}
                      className="w-full h-full cursor-pointer"
                      onClick={() => setLightboxImage(readingArticle.image)}
                    />
                  ) : (
                    <OptimizedImage
                      src={readingArticle.image}
                      alt={readingArticle.title}
                      className="w-full h-full cursor-pointer"
                      onClick={() => setLightboxImage(readingArticle.image)}
                    />
                  )}
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

                {/* GALLERY STRIP INSIDE ESSAY */}
                {readingArticle.gallery && readingArticle.gallery.length > 0 && (
                  <div className="space-y-4 pt-8 border-t border-white/10">
                    <div className="flex items-center gap-2 font-mono text-[10px] text-accent uppercase tracking-widest font-bold">
                      <Layers size={12} /> Editorial Photographic Gallery
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {readingArticle.gallery.map((imgSrc, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setLightboxImage(imgSrc)}
                          className="group aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-black cursor-pointer relative"
                        >
                          <img src={imgSrc} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Maximize2 size={14} className="text-accent" />
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

        {/* LIGHTBOX MODAL FOR UNCROPPED IMAGE PREVIEW */}
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
                  alt="Full Resolution View"
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
