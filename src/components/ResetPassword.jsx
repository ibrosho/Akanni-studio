import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import bgImage from '../assets/aka7.jpg'; 
import api from '../api/axios';

export default function ResetPassword() {
  const { token } = useParams(); // Grabs the reset token directly from the URL link
  const navigate = useNavigate();

  // Form Inputs
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });

    // Validate that passwords match on the client side first
    if (password !== confirmPassword) {
      setStatusMessage({ type: 'error', text: "Passwords do not match." });
      setIsSubmitting(false);
      return;
    }

    try {
      // Send the payload to your backend route
      console.log("Token from URL params is:", token);
      const response = await api.post(`/api/auth/reset-password/${token}`, { password });

      if (response.data.success) {
        setStatusMessage({ type: 'success', text: "Password updated successfully! Routing to access portal..." });
        
        // Wait 2 seconds so you can see the success message, then push straight to login
        setTimeout(() => {
          navigate('/login'); 
        }, 2000);
      }
    } catch (error) {
      setStatusMessage({ 
        type: 'error', 
        text: error.response?.data?.message || "Token link has expired or is invalid." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-[#0a0a0a]">
      {/* Background Layer matching your original look */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-950/70 to-cyan-950/50 backdrop-blur-[3px]" />
      </div>

      {/* Main Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4 overflow-y-auto z-10">
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%)', 
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
          className="w-full max-w-md p-10 rounded-[2.5rem] relative transition-all duration-500 mx-4"
        >
          <div className="absolute top-[1px] left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent blur-[0.5px]" />

          <div className="mb-8">
            <h2 className="text-3xl font-light tracking-tight text-white mb-2">New Password</h2>
            <p className="text-[10px] text-accent uppercase tracking-widest font-semibold drop-shadow-[0_0_8px_rgba(0,245,212,0.3)]">
              Update your workspace configuration access security credentials.
            </p>
          </div>

          {/* Flash Alert Messages */}
          {statusMessage.text && (
            <div className={`p-4 rounded-xl mb-6 border text-xs font-mono transition-all duration-300 ${
              statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleResetSubmit}>
            {/* New Password Input */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">New Password</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 pr-12 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" required 
                />
                <button 
                  type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors text-xs font-mono uppercase tracking-tighter"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-1">
              <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">Confirm Password</label>
              <input 
                type={showPassword ? "text" : "password"} placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" required 
              />
            </div>

            <button 
              type="submit" disabled={isSubmitting}
              className="w-full mt-2 py-4 bg-accent hover:bg-accent-hover text-black font-bold rounded-xl active:scale-[0.98] transition-all duration-300 text-xs uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(0,245,212,0.2)] disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Updating New Password..." : "Add New Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}