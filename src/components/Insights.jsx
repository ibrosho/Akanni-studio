import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import PageTransition from './PageTransition';

const INSIGHTS_ARTICLES = [
  {
    id: 1,
    title: "The Poetry of Raw Concrete: Brutalism in Modern Coastal Architecture",
    category: "Spatial Design",
    date: "JULY 2026",
    readTime: "5 MIN READ",
    summary: "An exploration into how low-carbon volcanic concrete mixes stand up against coastal salt erosion while maintaining a pure, uncompromising geometric form language.",
    featured: true,
    image: "/in1.avif"
  },
  {
    id: 2,
    title: "Monogram Mechanics: Crafting Minimalist Visual Identities That Last",
    category: "Branding",
    date: "JUNE 2026",
    readTime: "4 MIN READ",
    summary: "Breaking down the mathematical balance behind designing vector monograms that scale flawlessly from digital viewports down to custom laser-cut textures.",
    featured: false,
    image: "/in2.avif"
  },
  {
    id: 3,
    title: "Biophilic Frameworks: Engineering Self-Cooling Public Pavilions",
    category: "Architecture",
    date: "MAY 2026",
    readTime: "7 MIN READ",
    summary: "How parametric timber curves and passive architectural air-funnels can lower localized micro-climate temperatures dynamically without relying on electrical grids.",
    featured: false,
    image: "pal.avif"
  },
  {
    id: 4,
    title: "Tactile Luxury: The Return of Heavy-Weight Premium Print Formats",
    category: "Production",
    date: "APRIL 2026",
    readTime: "3 MIN READ",
    summary: "Why digital-first brands are investing heavily in physical touchpoints, debossed premium paper stocks, and high-contrast branding layouts.",
    featured: false,
    image: "in3.avif"
  }
];

const CATEGORIES = ["ALL", "Spatial Design", "Branding", "Architecture", "Production"];

export default function Insights() {
  const [activeFilter, setActiveFilter] = useState("ALL");

  const filteredArticles = activeFilter === "ALL" 
    ? INSIGHTS_ARTICLES 
    : INSIGHTS_ARTICLES.filter(art => art.category === activeFilter);

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <div className="w-full min-h-screen pb-32 text-left">
        
        {/* 1. HEADER SECTION */}
        <div className="mb-16">
          <p className="text-[10px] font-mono tracking-[0.35em] text-cyan-400 uppercase mb-3">Studio Journals</p>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            INSIGHTS <span className="font-light italic text-zinc-500 lowercase">&</span> IDEAS
          </h2>
          <div className="h-[1px] bg-white/10 mt-8 w-full" />
        </div>

        {/* 2. FILTER NAVIGATION */}
        <div className="flex flex-wrap gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[10px] font-mono tracking-wider uppercase border transition-all cursor-pointer ${
                activeFilter === cat
                  ? "bg-cyan-400 text-[#0a0a0a] border-cyan-400 font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  : "bg-white/[0.02] text-zinc-400 border-white/10 hover:text-white hover:border-white/30"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3. ARTICLES LAYOUT GRID */}
        <div className="space-y-12">
          {filteredArticles.map((article) => {
            // If it's the featured main item and we are viewing "ALL", make it full-screen editorial banner style
            if (article.featured && activeFilter === "ALL") {
              return (
                <div key={article.id} className="group cursor-pointer block border border-white/[0.06] bg-zinc-950/40 rounded-3xl overflow-hidden hover:border-white/20 transition-all duration-500">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    <div className="lg:col-span-7 aspect-[16/10] lg:aspect-auto relative overflow-hidden bg-zinc-900">
                      <img 
                        src={article.image} 
                        alt={article.title} 
                        className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-102 transition-all duration-700 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 to-transparent" />
                    </div>
                    
                    <div className="lg:col-span-5 p-8 sm:p-12 flex flex-col justify-between items-start">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 text-[9px] font-mono text-zinc-500">
                          <span className="text-cyan-400 font-bold uppercase tracking-widest">{article.category}</span>
                          <span>•</span>
                          <span>{article.readTime}</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-bold uppercase tracking-tight text-white leading-tight group-hover:text-cyan-400 transition-colors">
                          {article.title}
                        </h3>
                        <p className="text-zinc-400 font-light text-sm leading-relaxed">
                          {article.summary}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-[10px] font-mono uppercase text-zinc-500 group-hover:text-white mt-8 transition-colors">
                        <span>Read Full Essay</span>
                        <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            }

            return null;
          })}

          {/* SECONDARY STANDARD GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredArticles.filter(a => !a.featured || activeFilter !== "ALL").map((article) => (
              <div 
                key={article.id} 
                className="group cursor-pointer flex flex-col justify-between border border-white/[0.06] bg-zinc-950/20 rounded-3xl p-6 hover:border-white/20 hover:bg-zinc-950/60 transition-all duration-300"
              >
                <div className="space-y-4">
                  {/* Visual Thumbnail Frame */}
                  <div className="w-full aspect-[16/10] rounded-2xl overflow-hidden bg-zinc-900 border border-white/[0.04]">
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-75 transition-opacity duration-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 text-[9px] font-mono text-zinc-500">
                    <span className="text-cyan-400 uppercase font-bold tracking-wider">{article.category}</span>
                    <span>•</span>
                    <span>{article.readTime}</span>
                  </div>

                  <h4 className="text-lg font-bold uppercase text-white tracking-tight leading-snug group-hover:text-cyan-400 transition-colors">
                    {article.title}
                  </h4>
                  
                  <p className="text-zinc-400 font-light text-xs line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-white/[0.04] mt-6 text-[9px] font-mono text-zinc-500 group-hover:text-white transition-colors">
                  <span>{article.date}</span>
                  <ArrowUpRight size={12} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
