import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ChevronUp } from 'lucide-react';
import MagneticButton from './MagneticButton';
import SoundscapeToggle from './SoundscapeToggle';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: "Tiktok", href: "https://www.tiktok.com/@akannibtc0?_r=1&_t=ZN-97p3zQLdzEc" },
    { name: "Snapchat", href: "https://snapchat.com/t/JhRNPKdQ" },
    { name: "Twitter", href: "https://x.com/akanni_btc?s=11" },
    { name: "Instagram", href: "https://www.instagram.com/akanni__printing?igsh=M3NjNmlyamJ5em56" }
  ];

  const navigationMatrix = [
    { name: "Selected Works", path: "/projects" },
    { name: "Studio Core", path: "/studio" },
    { name: "Insights Ledger", path: "/insights" }
  ];

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.footer 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="mt-32 border-t border-luxury-border bg-luxury-black pt-16 pb-12 relative z-20 text-left"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 mb-16">
        
        {/* COLUMN 1: BRAND IDENTITY & VISION */}
        <div className="md:col-span-4 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white/[0.02] border border-luxury-border rounded flex items-center justify-center">
              <span className="text-neutral-warm font-black text-[10px] tracking-tighter">A</span>
            </div>
            <span className="text-[10px] font-mono tracking-widest uppercase text-neutral-warm font-bold">
              Akanni Studios
            </span>
          </div>
          <p className="text-neutral-muted text-[11px] font-light leading-relaxed max-w-xs">
            Architecting pristine spaces and high-fidelity digital blueprints. We sculpt physical environments and digital frameworks where computational accuracy meets structural form.
          </p>
        </div>

        {/* COLUMN 2: INTERNAL NAVIGATION */}
        <div className="md:col-span-2 space-y-3 font-mono">
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-neutral-muted font-bold">// NAVIGATION</h4>
          <ul className="space-y-2 text-[11px]">
            {navigationMatrix.map((link, idx) => (
              <li key={idx}>
                <Link 
                  to={link.path}
                  className="text-neutral-muted hover:text-accent transition-colors duration-300 font-light flex items-center gap-2 group text-left cursor-pointer focus:outline-none"
                >
                  <span className="w-1 h-1 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-50 group-hover:scale-100 shadow-[0_0_6px_#00f5d4]" />
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* COLUMN 3: ATELIER LOCATIONS */}
        <div className="md:col-span-3 space-y-3 font-mono">
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-neutral-muted font-bold">// ATELIER LOCATIONS</h4>
          <div className="space-y-3 text-[11px] text-neutral-muted font-light">
            <div>
              <p className="text-neutral-warm font-medium uppercase text-[9px] tracking-wider">Lagos (HQ)</p>
              <p className="text-[10px] font-sans mt-0.5">12 Glover Road, Ikoyi</p>
            </div>
            <div>
              <p className="text-neutral-warm font-medium uppercase text-[9px] tracking-wider">Fitzrovia, London</p>
              <p className="text-[10px] font-sans mt-0.5">45 Charlotte Street</p>
            </div>
          </div>
        </div>

        {/* COLUMN 4: CONNECT GATEWAYS */}
        <div className="md:col-span-3 space-y-3 font-mono">
          <h4 className="text-[9px] uppercase tracking-[0.2em] text-neutral-muted font-bold">// CONNECT</h4>
          <div className="flex flex-col gap-1.5 text-[11px]">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-neutral-muted hover:text-accent hover:underline decoration-accent/20 transition-all duration-300 flex items-center gap-1.5 py-0.5 group"
              >
                <span>{social.name}</span>
                <ArrowUpRight size={10} className="text-zinc-600 group-hover:text-accent transition-colors" />
              </a>
            ))}
          </div>
        </div>

      </div>

      {/* BOTTOM LEAF: MINIMALIST GRID LINE AND COPYRIGHT */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-8 border-t border-luxury-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 font-mono text-[9px] text-neutral-muted uppercase tracking-widest">
        <div>
          <span>© {currentYear} Akanni Studios. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-6">
          <SoundscapeToggle />
          <span className="text-[8px] opacity-60 hidden sm:inline">
            Scale: Zero Carbon System Framework
          </span>
          <MagneticButton onClick={handleBackToTop}>
            <button className="flex items-center gap-1.5 text-neutral-muted hover:text-accent transition-colors duration-300 bg-transparent border-none p-0 cursor-pointer uppercase text-[9px] tracking-widest font-mono font-bold">
              Back to Top <ChevronUp size={10} />
            </button>
          </MagneticButton>
        </div>
      </div>
    </motion.footer>
  );
}