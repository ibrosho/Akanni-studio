import { useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';

// Core context provider tracking sessions
import { AuthProvider, useAuth } from './components/AuthContext';

// Core structural views directly from your folder tree
import Navbar from './components/Navbar';
import Studio from './components/Studio';
import Projects from './components/Projects';
import About from './components/About';
import Insights from './components/Insights';
import Auth from './components/Auth';
import Footer from './components/Footer';
import CustomCursor from './components/CustomCursor';
import ResetPassword from './components/ResetPassword';
import Profile from './components/Profile';

// STAGE LAYOUT MATRIX - HIGH-END ARCHITECTURAL STUDIO
const STAGE_PROJECTS = [
  {
    title: "The Canopy",
    accentTitle: "pavilion.",
    tag: "Biophilic Urbanism",
    description: "An open-air civic pavilion utilizing self-shading parametric timber arches and integrated water filtration micro-climates to revive urban public space.",
    focus: "Structural Computational Design & Timber Mechanics",
    location: "Lagos, NG"
  },
  {
    title: "Mizora",
    accentTitle: "monolith.",
    tag: "Residential Architecture",
    description: "A minimalist coastal residence carved from low-carbon volcanic concrete, featuring massive structural cantilevered spans framing the Atlantic skyline.",
    focus: "High-Fidelity Spatial Systems & Concrete Engineering",
    location: "Victoria Island, Lagos"
  },
  {
    title: "The Zenith",
    accentTitle: "tower.",
    tag: "Commercial High-Rise",
    description: "A 45-story commercial skyscraper wrapped in a dynamic, kinetic solar-tracking envelope engineered to optimize internal thermal dynamics.",
    focus: "Parametric Facades & Environmental Fluid Dynamics",
    location: "Eko Atlantic City, NG"
  }
];

// --- PREMIUM HOVER ACTION: MAGNETIC WRAPPER ---
function MagneticWrapper({ children }) {
  const x = useSpring(0, { stiffness: 150, damping: 18, mass: 0.2 });
  const y = useSpring(0, { stiffness: 150, damping: 18, mass: 0.2 });

  const handleMouseMove = (e) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div style={{ x, y }} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="inline-block">
      {children}
    </motion.div>
  );
}

// --- SECURE ROUTE CAPSULE ENFORCEMENT ---
function ProtectedRoute({ children }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// --- CINEMATIC HERO BACKGROUND + TEXT SLIDER ---
function HeroHome({ currentIndex, setCurrentIndex, handlePrev, handleNext, backgroundVideos }) {
  const activeProject = STAGE_PROJECTS[currentIndex] || STAGE_PROJECTS[0];
  const { user } = useAuth();
  const welcomeLetter = user?.email ? user.email.charAt(0).toUpperCase() : (user?.name ? user.name.charAt(0).toUpperCase() : '');

  // Subtle Parallax effect using motion values to bypass React state re-rendering
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Springs for smooth movement
  const springX = useSpring(mouseX, { stiffness: 80, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 80, damping: 20 });

  // Transforms for different layers/speeds
  const videoX = useTransform(springX, (x) => x * 0.3);
  const videoY = useTransform(springY, (y) => y * 0.3);

  const leftX = useTransform(springX, (x) => x * -0.15);
  const leftY = useTransform(springY, (y) => y * -0.15);

  const rightX = useTransform(springX, (x) => x * 0.1);
  const rightY = useTransform(springY, (y) => y * 0.1);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    mouseX.set((clientX - window.innerWidth / 2) / 30);
    mouseY.set((clientY - window.innerHeight / 2) / 30);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen lg:h-screen flex items-center overflow-y-auto lg:overflow-hidden bg-luxury-black py-32 lg:py-0"
    >
      {/* Background Video Layer */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.video
            key={currentIndex}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ 
              opacity: 0.22, 
              scale: 1
            }}
            style={{
              x: videoX,
              y: videoY
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
          >
            <source src={backgroundVideos[currentIndex]} type="video/mp4" />
          </motion.video>
        </AnimatePresence>
      </div>

      {/* Ambient Vignette Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-[50vh] bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/40 to-transparent z-10 pointer-events-none" />
      
      {/* Dynamic Progress Indicator Dots */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3">
        {backgroundVideos.map((_, index) => (
          <div key={index} className="py-2 cursor-pointer" onClick={() => setCurrentIndex(index)}>
            <div className={`h-[3px] rounded-full transition-all duration-700 ${
                index === currentIndex ? 'w-12 bg-accent' : 'w-3 bg-white/10'
              }`}
            />
          </div>
        ))}
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-20 pt-24">
        {/* Left Interactive Narrative Block */}
        <motion.div 
          style={{ x: leftX, y: leftY }}
          className="lg:col-span-8 flex flex-col justify-center space-y-6 sm:space-y-8 text-left"
        >
          {welcomeLetter && (
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 0.5, x: 0 }}
              className="text-[10px] font-mono tracking-[0.35em] text-zinc-400 uppercase font-light"
            >
              Welcome back, <span className="text-accent font-bold drop-shadow-[0_0_8px_rgba(0,245,212,0.4)]">{welcomeLetter}</span>
            </motion.p>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/[0.02] border border-white/10 w-fit backdrop-blur-md"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_#00f5d4] animate-pulse" />
            <span className="text-[10px] uppercase tracking-[0.35em] text-cyan-200/70 font-mono font-semibold">
              {activeProject.tag}
            </span>
          </motion.div>

          {/* Core Architectural Headings Header */}
          <div className="overflow-hidden py-2">
            <AnimatePresence mode="wait">
              <motion.h1 
                key={currentIndex}
                initial={{ opacity: 0, y: 60, rotateX: 10 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                exit={{ opacity: 0, y: -40, rotateX: -10 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-7xl md:text-8xl font-black tracking-tight leading-[0.95] uppercase origin-left text-white"
              >
                {activeProject.title} <br />
                <span className="bg-gradient-to-r from-accent via-zinc-200 to-indigo-400 bg-clip-text text-transparent italic font-light tracking-wide lowercase pr-4">
                  {activeProject.accentTitle}
                </span>
              </motion.h1>
            </AnimatePresence>
          </div>

          <div className="min-h-[60px]">
            <AnimatePresence mode="wait">
              <motion.p 
                key={currentIndex}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-zinc-400 text-sm sm:text-base md:text-lg max-w-xl font-light leading-relaxed antialiased"
              >
                {activeProject.description}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Right Architectural Metadata Panel */}
        <motion.div 
          style={{ x: rightX, y: rightY }}
          className="lg:col-span-4 flex flex-col justify-center lg:items-end space-y-8 lg:space-y-12 text-left lg:text-right border-l lg:border-l-0 lg:border-r border-white/[0.04] pl-6 lg:pl-0 lg:pr-8"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentIndex}
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.5 }}
              className="space-y-6 font-mono"
            >
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-500 font-bold mb-1.5">Current Focus</p>
                <p className="text-xs tracking-wide text-accent font-semibold">{activeProject.focus}</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-zinc-500 font-bold mb-1.5">Location</p>
                <p className="text-xs tracking-wide text-zinc-400 font-light">{activeProject.location}</p>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Slider Trigger Actions */}
          <div className="flex flex-col lg:items-end w-full pt-2">
            <div className="flex items-center gap-4">
              <MagneticWrapper>
                <button 
                  onClick={handlePrev} 
                  className="w-12 h-12 rounded-full border border-white/10 hover:border-accent bg-white/[0.02] flex items-center justify-center text-zinc-400 hover:text-white hover:shadow-[0_0_15px_rgba(0,245,212,0.15)] transition-all cursor-pointer"
                >
                  <ArrowLeft size={16} />
                </button>
              </MagneticWrapper>
              
              <MagneticWrapper>
                <button 
                  onClick={handleNext} 
                  className="px-6 sm:px-8 h-12 rounded-full border border-white/10 hover:border-accent bg-white/[0.02] flex items-center gap-3 text-[10px] uppercase tracking-[0.25em] font-mono font-bold text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  Next Project <ArrowRight size={12} className="text-accent" />
                </button>
              </MagneticWrapper>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

// --- MAIN ROUTER LAYER ---
function AppContent() {
  const backgroundVideos = [
    "https://res.cloudinary.com/nassz3ed/video/upload/v1784081786/drv_xs5lo2.mp4",
    "https://res.cloudinary.com/nassz3ed/video/upload/v1784081748/yug_hepusb.mp4",
    "https://res.cloudinary.com/nassz3ed/video/upload/v1784081700/yum_ttyge6.mp4",
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const location = useLocation();
  const { user, loading, setIsAuthenticated, toast, closeToast } = useAuth();

  const handleNext = () => setCurrentIndex((prev) => (prev === backgroundVideos.length - 1 ? 0 : prev + 1));
  const handlePrev = () => setCurrentIndex((prev) => (prev === 0 ? backgroundVideos.length - 1 : prev - 1));

  if (loading) {
    return (
      <div className="fixed inset-0 bg-luxury-black flex items-center justify-center z-50">
        <div className="w-12 h-12 rounded-full border-t-2 border-accent animate-spin" />
      </div>
    );
  }

  // Ensure layouts don't render on login or reset password pages
  const showStructuralLayout = user && location.pathname !== "/login" && !location.pathname.startsWith("/reset-password");

  return (
    <div className="min-h-screen bg-luxury-black text-neutral-warm relative font-sans antialiased flex flex-col justify-between overflow-x-hidden">
      
      {/* Global Interactive Custom Cursor */}
      {showStructuralLayout && <CustomCursor />}

      {/* Ambient Noise Overlay Layer */}
      <svg className="fixed pointer-events-none z-40 opacity-[0.02] inset-0 w-full h-full" style={{ fill: 'none' }}>
        <filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" /></filter>
        <rect width="100%" height="100%" filter="url(#noiseFilter)" />
      </svg>

      {/* Floating Curved Navbar Integration Layer */}
      {showStructuralLayout && (
        <Navbar isAuthenticated={!!user} setIsAuthenticated={setIsAuthenticated} />
      )}

      {/* CORE PORTFOLIO STREAMS */}
      <div className="flex-grow w-full h-full">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            
            {/* PUBLIC DEPLOYMENT PORTAL INTERFACE */}
            <Route 
              path="/login" 
              element={user ? <Navigate to="/" replace /> : <div className="pt-32 px-8"><Auth /></div>} 
            />

            {/* UNPROTECTED PASSWORD RESET CONTAINER */}
            <Route path="/reset-password/:token" element={<ResetPassword />} />

            {/* ENFORCED PROTECTION NODE ROUTE PIPELINE */}
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <HeroHome 
                    currentIndex={currentIndex} 
                    setCurrentIndex={setCurrentIndex} 
                    handlePrev={handlePrev} 
                    handleNext={handleNext} 
                    backgroundVideos={backgroundVideos} 
                  />
                </ProtectedRoute>
              } 
            />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/studio" element={<ProtectedRoute><Studio /></ProtectedRoute>} />
            <Route path="/about" element={<ProtectedRoute><About /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Fallback Catch-All */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>

      {/* Footer rendering control */}
      {showStructuralLayout && <Footer />}

      {/* Luxury Glassmorphic Toast Notification Overlay */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="fixed bottom-8 right-8 z-[99999] flex items-center gap-3 px-5 py-4 bg-luxury-charcoal/90 backdrop-blur-xl border border-luxury-border rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.4)] max-w-sm"
          >
            <span className={`w-2 h-2 rounded-full shadow-lg flex-shrink-0 ${
              toast.type === 'error' 
                ? 'bg-red-500 shadow-red-500/50 animate-pulse' 
                : toast.type === 'info' 
                ? 'bg-blue-400 shadow-blue-400/50' 
                : 'bg-accent shadow-[0_0_8px_#00f5d4]'
            }`} />
            <p className="text-[10px] uppercase tracking-widest font-mono text-neutral-warm select-none">
              {toast.message}
            </p>
            <button 
              onClick={closeToast}
              className="ml-4 text-zinc-500 hover:text-white text-[9px] font-mono transition-colors cursor-pointer"
            >
              ✖
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
