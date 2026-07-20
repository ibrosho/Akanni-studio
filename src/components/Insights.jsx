import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Bookmark, Share2, ArrowUpRight, Clock, X, Check } from 'lucide-react';
import { useAuth } from './AuthContext';
import PageTransition from './PageTransition';
import { SectionReveal } from './Reveal';

const INSIGHTS_ARTICLES = [
  {
    id: 1,
    title: "The Poetry of Raw Concrete: Brutalism in Modern Coastal Architecture",
    category: "Spatial Design",
    date: "JULY 2026",
    readTime: 5,
    summary: "An exploration into how low-carbon volcanic concrete mixes stand up against coastal salt erosion while maintaining a pure, uncompromising geometric form language.",
    body: "Brutalism in contemporary architecture is experiencing a monumental renaissance. Far from the oppressive grey monolithic structures of the mid-20th century, contemporary brutalist design embraces material authenticity, micro-textured aggregate mixes, and biophilic light integration...\n\nBy leveraging volcanic ash, low-carbon additives, and subterranean counterweight anchors, architects can now span immense structural cantilevers over Atlantic coastlines without succumbing to saline corrosion or structural fatigue.",
    featured: true,
    image: "/in1.avif"
  },
  {
    id: 2,
    title: "Monogram Mechanics: Crafting Minimalist Visual Identities That Last",
    category: "Branding",
    date: "JUNE 2026",
    readTime: 4,
    summary: "Breaking down the mathematical balance behind designing vector monograms that scale flawlessly from digital viewports down to custom laser-cut textures.",
    body: "A logo for an architectural firm must communicate spatial integrity in two dimensions. Monograms built on strict grid ratios—such as the golden ratio or isometric 30-degree angles—retain geometric legibility whether displayed on a 4K viewport or engraved into raw brass door hardware.",
    featured: false,
    image: "/in2.avif"
  },
  {
    id: 3,
    title: "Biophilic Frameworks: Engineering Self-Cooling Public Pavilions",
    category: "Architecture",
    date: "MAY 2026",
    readTime: 7,
    summary: "How parametric timber curves and passive architectural air-funnels can lower localized micro-climate temperatures dynamically without relying on electrical grids.",
    body: "Urban heat islands represent one of the greatest challenges in tropical metropolitan centers like Lagos. By combining computational fluid dynamics (CFD) with parametric timber louver arrays, passive structural cooling can achieve up to a 6°C reduction in ambient temperature natively.",
    featured: false,
    image: "pal.avif"
  },
  {
    id: 4,
    title: "Tactile Luxury: The Return of Heavy-Weight Premium Print Formats",
    category: "Production",
    date: "APRIL 2026",
    readTime: 3,
    summary: "Why digital-first brands are investing heavily in physical touchpoints, debossed premium paper stocks, and high-contrast branding layouts.",
    body: "In an era dominated by ephemeral digital interactions, physical print artifacts carry elevated prestige. A debossed 600gsm cotton card with foil-stamped architectural monograms creates an unmistakable haptic impression that digital screens cannot replicate.",
    featured: false,
    image: "in3.avif"
  }
];

const CATEGORIES = ["ALL", "Spatial Design", "Branding", "Architecture", "Production"];

export default function Insights() {
  const { showToast } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [sortBy, setSortBy] = useState("latest"); // latest | shortest | longest
  const [readingArticle, setReadingArticle] = useState(null);
  const [scrollProgress, setScrollProgress] = useState(0);

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
      showToast("Article removed from saved bookmarks.", "info");
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
          art.category.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === "shortest") return a.readTime - b.readTime;
        if (sortBy === "longest") return b.readTime - a.readTime;
        return b.id - a.id; // latest default
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
              placeholder="Search essays, design systems..."
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
            No architectural essays matched your query.
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

        {/* READ ARTICLE FULL-SCREEN MODAL WITH READING PROGRESS BAR */}
        <AnimatePresence>
          {readingArticle && (
            <motion.div
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
              <div className="max-w-3xl mx-auto px-6 py-32 space-y-8 text-left">
                <div className="space-y-4">
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

                <div className="w-full aspect-[16/9] rounded-3xl overflow-hidden border border-white/10 my-8">
                  <img src={readingArticle.image} alt={readingArticle.title} className="w-full h-full object-cover" />
                </div>

                <div className="space-y-6 text-zinc-300 font-light text-base sm:text-lg leading-relaxed whitespace-pre-line antialiased">
                  {readingArticle.body || readingArticle.summary}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageTransition>
  );
}
