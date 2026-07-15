import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight, User, Lock, LogOut, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from './AuthContext';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);
  const lastScrollY = useRef(0);
  const dropdownRef = useRef(null);
  
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser, theme, toggleTheme } = useAuth();

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) && 
        !event.target.closest('.avatar-trigger')
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // --- Upgrade 1: Smart Scroll Behavior (Auto-Hide on Scroll Down, Reveal on Scroll Up) ---
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Ensure we don't hide it for minor bounces, and always show it at the top of the page
      if (currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        // Scrolling Down - Hide Navbar
        setIsVisible(false);
        setIsOpen(false); // Close mobile drawer if they scroll away
      } else if (currentScrollY < lastScrollY.current) {
        // Scrolling Up - Reveal Navbar
        setIsVisible(true);
      }
      
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return "";
    if (photoPath.startsWith("data:") || photoPath.startsWith("blob:") || photoPath.startsWith("http:") || photoPath.startsWith("https:")) {
      return photoPath;
    }
    const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  // 💡 GATED GUARD RULE: If they are on the login page OR not authenticated, completely hide the layout
  if (location.pathname === '/login' || !user) {
    return null;
  }

  const handleLogout = () => {
    logoutUser();
    setIsOpen(false);
    setShowDropdown(false);
    logoutUser();
    navigate('/login'); 
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { name: 'Studio', path: '/studio' },
    { name: 'Projects', path: '/projects' },
    { name: 'About', path: '/about' },
    { name: 'Insights', path: '/insights' }
  ];

  const firstLetter = user?.email ? user.email.charAt(0).toUpperCase() : '';

  return (
    <motion.div 
      initial={{ y: -100 }}
      animate={{ y: isVisible ? 0 : -100 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-6 left-4 right-4 z-40 flex justify-center"
    >
      <nav className="w-full max-w-5xl bg-luxury-charcoal/70 backdrop-blur-xl border border-luxury-border rounded-full px-6 py-3.5 flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative">
        
        {/* Brand Anchor Area */}
        <Link 
          to="/" 
          className="text-xs font-mono tracking-[0.25em] uppercase font-bold text-white relative group"
          onClick={() => {
            setIsOpen(false);
            setShowDropdown(false);
          }}
        >
          AKANNI <span className="text-accent font-normal ml-1 transition-all group-hover:text-cyan-300">STUDIOS</span>
        </Link>

        {/* Desktop Navigation Capsule Items */}
        <div className="hidden md:flex items-center gap-1 text-[10px] font-mono tracking-widest uppercase relative z-10">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`relative px-4 py-1.5 transition-colors duration-300 rounded-full flex items-center gap-1.5 ${
                  active ? 'text-white font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {active && (
                  <motion.span layoutId="activeNavHighlight"
                    className="absolute inset-0 bg-white/[0.05] border border-white/5 rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 430, damping: 28 }}
                  />
                )}
                {item.name}
                {active && <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00f5d4]" />}
              </Link>
            );
          })}
        </div>

        {/* Desktop Action Area: Profile Dropdown */}
        <div className="hidden md:flex items-center gap-4 relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="avatar-trigger w-8 h-8 rounded-full border border-accent/40 hover:border-accent hover:shadow-[0_0_12px_rgba(0,245,212,0.3)] overflow-hidden cursor-pointer transition-all duration-300 flex items-center justify-center bg-white/[0.03]"
            aria-label="Toggle Profile Dropdown"
          >
            {user?.profilePhoto ? (
              <img src={getPhotoUrl(user.profilePhoto)} className="w-full h-full object-cover" alt="User Avatar" />
            ) : (
              <span className="text-[10px] font-bold text-accent font-mono">{firstLetter}</span>
            )}
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {showDropdown && (
              <motion.div 
                ref={dropdownRef}
                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="absolute right-0 top-11 w-64 bg-luxury-charcoal/90 backdrop-blur-xl border border-luxury-border rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-50 text-left"
              >
                {/* User Card */}
                <div className="flex items-center gap-3 pb-3 border-b border-white/5 mb-3">
                  <div className="w-9 h-9 rounded-full border border-white/10 overflow-hidden flex items-center justify-center bg-white/[0.02]">
                    {user?.profilePhoto ? (
                      <img src={getPhotoUrl(user.profilePhoto)} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <span className="text-xs font-bold text-accent font-mono">{firstLetter}</span>
                    )}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[11px] font-bold text-white uppercase tracking-wider truncate leading-tight">{user.name || 'Akanni Guest'}</p>
                    <p className="text-[9px] text-zinc-500 font-mono truncate">{user.email}</p>
                  </div>
                </div>

                {/* Dropdown Items */}
                <div className="flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-widest">
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><User size={10} className="text-accent" /> Edit Profile</span>
                    <ArrowUpRight size={8} className="text-zinc-500" />
                  </button>
                  
                  <button 
                    onClick={() => {
                      setShowDropdown(false);
                      navigate('/profile?tab=security');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.03] transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><Lock size={10} className="text-accent" /> Change Password</span>
                    <ArrowUpRight size={8} className="text-zinc-500" />
                  </button>
                  
                  <div className="h-[1px] bg-white/5 my-2" />
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-xl text-red-400/80 hover:text-white hover:bg-red-500/10 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <span className="flex items-center gap-2"><LogOut size={10} className="text-red-400" /> Logout</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Menu Action Trigger */}
        <button 
          onClick={() => {
            setIsOpen(!isOpen);
            setShowDropdown(false);
          }}
          className="md:hidden p-2 rounded-full bg-white/[0.02] border border-white/5 text-zinc-400 hover:text-white transition-colors"
          aria-label="Toggle Menu"
        >
          {isOpen ? <X size={14} /> : <Menu size={14} />}
        </button>

        {/* Mobile Navigation Drawer System */}
        <AnimatePresence>
          {isOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-[120%] left-4 right-4 md:hidden bg-luxury-charcoal/95 border border-luxury-border backdrop-blur-2xl p-4 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-50 flex flex-col gap-1.5 text-[11px] font-mono tracking-widest uppercase text-left"
            >
              {menuItems.map((item) => (
                <Link 
                  key={item.path}
                  to={item.path} 
                  onClick={() => setIsOpen(false)} 
                  className={`px-4 py-2.5 rounded-xl transition-colors flex justify-between items-center ${
                    isActive(item.path) ? 'bg-white/[0.04] text-white font-medium' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {item.name}
                  {isActive(item.path) && <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_6px_#00f5d4]" />}
                </Link>
              ))}
              
              <div className="h-[1px] bg-white/5 my-2" />



              <Link 
                to="/profile" 
                onClick={() => setIsOpen(false)}
                className="px-4 py-2.5 rounded-xl text-zinc-400 hover:text-white hover:bg-white/[0.04] transition-colors flex justify-between items-center"
              >
                Profile Settings
                <User size={12} className="text-accent" />
              </Link>
              
              <button 
                onClick={handleLogout} 
                className="w-full mt-2 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 font-bold rounded-xl hover:bg-red-500/20 hover:text-white transition-colors"
              >
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
  );
}