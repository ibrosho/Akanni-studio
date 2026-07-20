import { useState, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Trash2, Save, Lock, User, Upload, Sparkles } from 'lucide-react';
import { useAuth } from './AuthContext';
import PageTransition from './PageTransition';

export default function Profile() {
  const { user, updateProfile, changePassword, showToast } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Derive active tab directly from URL — no setState needed, avoids cascading renders
  const activeTab = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tab') === 'security' ? 'security' : 'profile';
  }, [location.search]);


  // Initialize profile field state lazily from user context — no setState in effect needed
  const [name, setName] = useState(() => user?.name || "");
  const [bio, setBio] = useState(() => user?.bio || "");
  const [profilePhoto, setProfilePhoto] = useState(() => user?.profilePhoto || "");
  const [selectedFile, setSelectedFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [cursorEnabled, setCursorEnabled] = useState(() => {
    const saved = localStorage.getItem('arc_cursor_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Password Security State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Helper to construct profile photo URL relative to backend
  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return "";
    if (photoPath.startsWith("data:") || photoPath.startsWith("blob:") || photoPath.startsWith("http:") || photoPath.startsWith("https:")) {
      return photoPath;
    }
    const path = photoPath.startsWith('/') ? photoPath : `/${photoPath}`;
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return `${baseUrl}${path}`;
  };

  // Real-time password strength check
  const getPasswordStrength = () => {
    if (!newPassword) return { label: '', color: 'bg-zinc-800', width: 'w-0', message: '' };
    if (newPassword.length < 6) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/3', message: 'Needs at least 6 characters.' };
    if (newPassword.length < 10) return { label: 'Moderate', color: 'bg-yellow-500', width: 'w-2/3', message: 'Add special characters/numbers.' };
    
    // Check for mix of chars
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);
    if (hasNumbers && hasSpecial) {
      return { label: 'Imperial (Strong)', color: 'bg-accent', width: 'w-full', message: 'Secure cryptographic profile.' };
    }
    return { label: 'Strong', color: 'bg-emerald-500', width: 'w-5/6', message: 'Password is secure.' };
  };

  const strength = getPasswordStrength();

  // Profile image processing
  const processImageFile = (file) => {
    if (!file) return;

    // Validate size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      showToast("Selected image exceeds 2MB limit.", "error");
      return;
    }

    if (!file.type.startsWith('image/')) {
      showToast("Only standard image assets are allowed.", "error");
      return;
    }

    setSelectedFile(file);
    // Clean up old local blob URL preview to avoid memory leaks
    if (profilePhoto && profilePhoto.startsWith('blob:')) {
      URL.revokeObjectURL(profilePhoto);
    }
    const previewUrl = URL.createObjectURL(file);
    setProfilePhoto(previewUrl);
    showToast("Photo selected. Click 'Save Changes' to synchronize.", "info");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    processImageFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    processImageFile(file);
  };

  const handleDeletePhoto = () => {
    if (profilePhoto && profilePhoto.startsWith('blob:')) {
      URL.revokeObjectURL(profilePhoto);
    }
    setProfilePhoto("");
    setSelectedFile(null);
    showToast("Profile photo removed. Save changes to finalize.", "info");
  };

  // Toggle Custom Cursor Overlay setting dynamically
  const handleCursorToggle = () => {
    const nextVal = !cursorEnabled;
    setCursorEnabled(nextVal);
    localStorage.setItem('arc_cursor_enabled', JSON.stringify(nextVal));
    window.dispatchEvent(new Event('cursor-toggle'));
    showToast(`Cinematic custom cursor ${nextVal ? 'activated' : 'deactivated'}.`, "info");
  };

  // Profile Completion Percentage Calculation
  const completionPercentage = useMemo(() => {
    let score = 0;
    if (name?.trim()) score += 25;
    if (user?.email) score += 25;
    if (bio?.trim()?.length > 10) score += 25;
    if (profilePhoto) score += 25;
    return score;
  }, [name, user?.email, bio, profilePhoto]);

  // Social Links & Location State
  const [locationName, setLocationName] = useState(() => localStorage.getItem('arc_location') || "Lagos, Nigeria");
  const [websiteUrl, setWebsiteUrl] = useState(() => localStorage.getItem('arc_website') || "https://akanni-studio.vercel.app");
  const [instagramUrl, setInstagramUrl] = useState(() => localStorage.getItem('arc_instagram') || "https://instagram.com/akanni_printing");

  const saveSocials = () => {
    localStorage.setItem('arc_location', locationName);
    localStorage.setItem('arc_website', websiteUrl);
    localStorage.setItem('arc_instagram', instagramUrl);
  };

  // Submit Profile Form via Multipart FormData
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast("Name credentials cannot be left empty.", "error");
      return;
    }
    setIsUpdatingProfile(true);
    saveSocials();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    
    if (selectedFile) {
      formData.append('profilePhoto', selectedFile);
    } else if (profilePhoto === "") {
      formData.append('deletePhoto', 'true');
    }

    const result = await updateProfile(formData);
    setIsUpdatingProfile(false);
    if (result?.success) {
      setSelectedFile(null);
    }
  };

  // Submit Password Form
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (!currentPassword) {
      showToast("Current password is required to authorize changes.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Confirm password mismatch.", "error");
      return;
    }
    setIsChangingPassword(true);
    const result = await changePassword(currentPassword, newPassword);
    setIsChangingPassword(false);
    if (result?.success) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <PageTransition className="pt-32 px-6 max-w-5xl mx-auto">
      <div className="w-full min-h-screen pb-32 text-left">
        
        {/* Header Section */}
        <div className="mb-12">
          <p className="text-[10px] font-mono tracking-[0.35em] text-accent uppercase mb-3">Management Center</p>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight text-white leading-none">
            STUDIO <span className="font-light italic text-zinc-500 lowercase">dashboard</span>
          </h2>
          <div className="h-[1px] bg-white/10 mt-8 w-full" />
        </div>

        {/* --- DASHBOARD OVERVIEW ANALYTICS --- */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Profile Completion Ring Card */}
          <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex items-center gap-5">
            <div className="relative w-16 h-16 flex items-center justify-center flex-shrink-0">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="4" className="text-white/10" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeDasharray={163}
                  strokeDashoffset={163 - (163 * completionPercentage) / 100}
                  className="text-accent transition-all duration-1000 ease-out"
                  fill="transparent"
                />
              </svg>
              <span className="absolute font-mono text-xs font-bold text-white tabular-nums">{completionPercentage}%</span>
            </div>
            <div>
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold mb-1">Profile Matrix</p>
              <p className="text-xs font-semibold text-white">
                {completionPercentage === 100 ? "Complete" : "Action Needed"}
              </p>
              <p className="text-[9px] font-mono text-accent mt-0.5">
                {completionPercentage === 100 ? "100% Calibrated" : "Fill bio & photo"}
              </p>
            </div>
          </div>

          {/* Stat 2: Projects Viewed */}
          <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
            <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Spatial Models Viewed</p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-2xl font-black font-mono text-white tracking-tight">14</span>
              <span className="text-[9px] font-mono text-accent">Active Session</span>
            </div>
          </div>

          {/* Stat 3: Storage Usage */}
          <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Storage Allocation</p>
              <span className="text-[9px] font-mono text-zinc-400">1.2 / 2.0 MB</span>
            </div>
            <div className="mt-3">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent w-[60%] shadow-[0_0_8px_#00f5d4]" />
              </div>
              <p className="text-[8px] font-mono text-zinc-500 mt-1 uppercase tracking-wider">Asset Quota: 60% Used</p>
            </div>
          </div>

          {/* Stat 4: Security Status */}
          <div className="p-6 rounded-2xl bg-white/[0.015] border border-white/5 flex flex-col justify-between">
            <p className="text-[9px] font-mono uppercase tracking-widest text-zinc-500 font-bold">Security Pipeline</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse shadow-[0_0_8px_#00f5d4]" />
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">JWT Session Active</span>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Panel Tabs */}
          <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 font-mono text-[9px] uppercase tracking-widest">
            <button
              onClick={() => {
                navigate('/profile?tab=profile');
              }}
              className={`flex-1 lg:flex-initial text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                activeTab === 'profile'
                  ? "bg-accent/5 border-accent text-accent shadow-[0_0_15px_rgba(0,245,212,0.1)]"
                  : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/15"
              }`}
            >
              <User size={12} />
              <span>Studio Profile</span>
            </button>

            <button
              onClick={() => {
                const isFormDirty = name !== (user?.name || '') || bio !== (user?.bio || '') || selectedFile !== null;
                if (isFormDirty && activeTab === 'profile') {
                  showToast("Note: Unsaved profile changes will be preserved until saved.", "info");
                }
                navigate('/profile?tab=security');
              }}
              className={`flex-1 lg:flex-initial text-left px-5 py-4 rounded-2xl border transition-all duration-300 flex items-center gap-3 cursor-pointer ${
                activeTab === 'security'
                  ? "bg-accent/5 border-accent text-accent shadow-[0_0_15px_rgba(0,245,212,0.1)]"
                  : "bg-white/[0.01] border-white/5 text-zinc-400 hover:text-white hover:border-white/15"
              }`}
            >
              <Lock size={12} />
              <span>Security Vault</span>
            </button>
          </div>

          {/* Right Panel Content */}
          <div className="lg:col-span-8 bg-luxury-charcoal/45 backdrop-blur-xl border border-luxury-border rounded-[2rem] p-8 md:p-10 shadow-2xl relative">
            <div className="absolute top-[1px] left-16 right-16 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent blur-[0.5px]" />
            
            <AnimatePresence mode="wait">
              {activeTab === 'profile' ? (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-8 flex items-center gap-2">
                    <User size={16} className="text-accent" />
                    Profile Details
                  </h3>

                  <form onSubmit={handleProfileSubmit} className="space-y-8">
                    {/* Avatar Upload Grid */}
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                      <div className="relative group w-28 h-28 rounded-full border border-accent/20 bg-black/40 overflow-hidden flex items-center justify-center flex-shrink-0">
                        {profilePhoto ? (
                          <>
                            <img src={getPhotoUrl(profilePhoto)} className="w-full h-full object-cover" alt="Avatar Preview" />
                            <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <Camera size={20} className="text-accent animate-pulse" />
                            </div>
                          </>
                        ) : (
                          <div className="text-center p-2">
                            <Camera size={22} className="text-zinc-600 mx-auto mb-1" />
                            <span className="text-[8px] font-mono text-zinc-500 uppercase tracking-wider block">No Photo</span>
                          </div>
                        )}
                      </div>

                      {/* Drag & Drop Zone */}
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`flex-1 w-full border border-dashed rounded-2xl p-6 text-center transition-all duration-300 font-mono ${
                          dragOver 
                            ? 'border-accent bg-accent/5 text-white' 
                            : 'border-white/10 bg-white/[0.01] hover:border-white/20 text-zinc-400'
                        }`}
                      >
                        <Upload size={18} className="mx-auto mb-2 text-accent" />
                        <p className="text-[10px] uppercase tracking-wider mb-1 font-bold">Drag & Drop profile image</p>
                        <p className="text-[9px] text-zinc-500 mb-3 lowercase">or click browser explorer window (Max 2MB)</p>
                        
                        <div className="flex items-center justify-center gap-4">
                          <label className="px-4 py-1.5 rounded-full border border-white/15 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/30 text-[9px] uppercase tracking-wider font-bold text-white cursor-pointer transition-all">
                            Browse
                            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                          </label>
                          
                          {profilePhoto && (
                            <button
                              type="button"
                              onClick={handleDeletePhoto}
                              className="px-4 py-1.5 rounded-full border border-red-500/20 bg-red-500/5 hover:bg-red-500/15 hover:border-red-500 text-[9px] uppercase tracking-wider font-bold text-red-400 cursor-pointer transition-all flex items-center gap-1.5"
                            >
                              <Trash2 size={10} /> Delete Photo
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="h-[1px] bg-white/5 w-full my-4" />

                    {/* Inputs */}
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Full Studio Name</label>
                          <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" 
                            required 
                          />
                        </div>

                        <div className="space-y-1.5 opacity-55">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-zinc-500 font-semibold">Registered Email</label>
                          <input 
                            type="email" 
                            value={user?.email || ""} 
                            disabled
                            className="w-full p-4 rounded-xl bg-black/20 border border-white/5 text-zinc-400 text-sm cursor-not-allowed font-mono" 
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Architectural Biography / Bio</label>
                          <span className="text-[8px] font-mono text-zinc-500">{bio.length} characters</span>
                        </div>
                        <textarea 
                          value={bio} 
                          onChange={(e) => setBio(e.target.value)}
                          placeholder="Craft your spatial narrative or architectural credentials..."
                          rows="3"
                          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm resize-none"
                        />
                      </div>

                      {/* Location & Portfolio Links Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Studio Location</label>
                          <input 
                            type="text" 
                            value={locationName} 
                            onChange={(e) => setLocationName(e.target.value)}
                            placeholder="e.g. Lagos, Nigeria"
                            className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-xs font-mono" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Portfolio / Website</label>
                          <input 
                            type="text" 
                            value={websiteUrl} 
                            onChange={(e) => setWebsiteUrl(e.target.value)}
                            placeholder="https://..."
                            className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-xs font-mono" 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Instagram Handle</label>
                          <input 
                            type="text" 
                            value={instagramUrl} 
                            onChange={(e) => setInstagramUrl(e.target.value)}
                            placeholder="https://instagram.com/..."
                            className="w-full p-3.5 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-xs font-mono" 
                          />
                        </div>
                      </div>

                      {/* Optional Interactive Custom Cursor Workspace Setting Switch */}
                      <div className="space-y-1.5 pt-4">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold mb-2">Workspace Personalization Settings</label>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/20 border border-white/5">
                          <div className="pr-4">
                            <p className="text-xs text-white font-medium">Enable Cinematic Custom Cursor</p>
                            <p className="text-[10px] text-zinc-500 font-light font-sans mt-0.5">Toggle morphing pointer feedback overlay matrix.</p>
                          </div>
                          <button
                            type="button"
                            onClick={handleCursorToggle}
                            className={`w-10 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 cursor-pointer ${
                              cursorEnabled ? 'bg-accent' : 'bg-zinc-800'
                            }`}
                            aria-label="Toggle Custom Cursor"
                          >
                            <span
                              className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-black transition-all duration-300 ${
                                cursorEnabled ? 'translate-x-4' : 'translate-x-0'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isUpdatingProfile}
                        className="inline-flex items-center gap-2.5 px-6 h-12 bg-accent hover:bg-accent-hover text-black font-bold text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(0,245,212,0.15)] hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      >
                        <Save size={12} />
                        {isUpdatingProfile ? "Syncing..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="security-tab"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="text-xl font-bold uppercase tracking-tight text-white mb-8 flex items-center gap-2">
                    <Lock size={16} className="text-accent" />
                    Security Vault
                  </h3>

                  <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-4">
                      {/* Current Password */}
                      <div className="space-y-1.5">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Current Password</label>
                        <input 
                          type="password" 
                          placeholder="••••••••"
                          value={currentPassword} 
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" 
                          required 
                        />
                      </div>

                      <div className="h-[1px] bg-white/5 w-full my-4" />

                      {/* New Password */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            value={newPassword} 
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" 
                            required 
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[9px] uppercase tracking-[0.2em] text-accent font-semibold">Confirm New Password</label>
                          <input 
                            type="password" 
                            placeholder="••••••••"
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" 
                            required 
                          />
                        </div>
                      </div>

                      {/* Password Strength Gauge */}
                      {newPassword && (
                        <div className="p-4 rounded-2xl bg-white/[0.01] border border-white/5 space-y-2 mt-2">
                          <div className="flex justify-between items-center font-mono text-[9px] uppercase tracking-wider">
                            <span className="text-zinc-500">Security Index:</span>
                            <span className={`font-bold ${newPassword.length < 6 ? 'text-red-400' : newPassword.length < 10 ? 'text-yellow-400' : 'text-accent'}`}>
                              {strength.label}
                            </span>
                          </div>
                          
                          <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div className={`h-full ${strength.color} ${strength.width} transition-all duration-500`} />
                          </div>

                          <p className="text-[9px] text-zinc-500 font-mono leading-none flex items-center gap-1">
                            <Sparkles size={8} className="text-accent animate-pulse" />
                            {strength.message}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end pt-4">
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2.5 px-6 h-12 bg-accent hover:bg-accent-hover text-black font-bold text-[10px] font-mono uppercase tracking-[0.2em] rounded-full transition-all duration-300 shadow-[0_4px_15px_rgba(0,245,212,0.15)] hover:shadow-[0_0_20px_rgba(0,245,212,0.3)] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
                      >
                        <Lock size={12} />
                        {isChangingPassword ? "Securing..." : "Update Password"}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </PageTransition>
  );
}
