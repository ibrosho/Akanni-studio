import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import bgImage from '../assets/aka7.jpg'; 
import { useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function Auth() {
  // Navigation States: 'login' | 'signup' | 'forgot' | 'verify'
  const [viewState, setViewState] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false); 

  // Form Inputs
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpCode, setOtpCode] = useState(""); 
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [validationErrors, setValidationErrors] = useState([]);
  
  const navigate = useNavigate();
  const { login, register, verifyOtp, forgotPassword } = useAuth();

  // Simple real-time password strength evaluator
  const getPasswordStrength = () => {
    if (!password) return { label: '', color: 'text-gray-500' };
    if (password.length < 6) return { label: 'Weak', color: 'text-red-400' };
    if (password.length < 10) return { label: 'Moderate', color: 'text-yellow-400' };
    return { label: 'Strong', color: 'text-emerald-400' };
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage({ type: '', text: '' });
    setValidationErrors([]);
    
    try {
      if (viewState === 'signup') {
        // verifying credentials & registering new account
        const result = await register(name, email, password);
        if (result?.success) {
          if (result.sandbox && result.otp) {
            setStatusMessage({ type: 'success', text: "Sandbox Mode Activated: Verification OTP has been auto-filled!" });
            setOtpCode(result.otp);
          } else {
            setStatusMessage({ type: 'success', text: "Verification OTP code sent to your email!" });
          }
          setViewState('verify'); 
        } else {
          setStatusMessage({ type: 'error', text: result?.message || "Registration anomaly detected." });
          if (result?.errors) {
            setValidationErrors(result.errors);
          }
        }
      } 
      
      else if (viewState === 'verify') {
        // verifying OTP code
        const result = await verifyOtp(email, otpCode);
        if (result?.success) {
          setStatusMessage({ type: 'success', text: "Email verified successfully! You can now log in." });
          setViewState('login'); 
          setOtpCode("");
          setPassword(""); // Clear password field for security
        } else {
          setStatusMessage({ type: 'error', text: result?.message || "Verification code is incorrect." });
        }
      } 
      
      else if (viewState === 'login') {
        // authenticating user credentials
        const result = await login(email, password);
        if (result?.success) {
          navigate('/'); 
        } else {
          setStatusMessage({ type: 'error', text: result?.message || "Authentication anomaly detected." });
          if (result?.errors) {
            setValidationErrors(result.errors);
          }
        }
      } 
      
      else if (viewState === 'forgot') {
        // dispatching password reset token Link
        const result = await forgotPassword(email);
        if (result?.success) {
          setStatusMessage({ type: 'success', text: 'Recovery link transmitted to your inbox!' });
        } else {
          setStatusMessage({ type: 'error', text: result?.message || "Forgot password request failed." });
        }
      }
    } catch {
      setStatusMessage({ type: 'error', text: "Target core server unreachable." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Trigger resend of verification OTP
  const handleResendCode = async () => {
    setIsResending(true);
    setStatusMessage({ type: '', text: '' });
    setValidationErrors([]);
    try {
      const result = await register(name, email, password);
      if (result?.success) {
        setStatusMessage({ type: 'success', text: "A fresh 6-digit code has been delivered to your inbox." });
      } else {
        setStatusMessage({ type: 'error', text: result?.message || "Could not issue a new token." });
      }
    } catch {
      setStatusMessage({ type: 'error', text: "Network pipeline bottlenecked. Try again." });
    } finally {
      setIsResending(false);
    }
  };


  const strength = getPasswordStrength();

  // Helper to extract field label from Zod error path
  const getFieldErrorLabel = (err) => {
    if (err.field) return err.field;
    if (Array.isArray(err.path) && err.path.length > 0) return err.path[err.path.length - 1];
    return '';
  };

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden z-50 bg-[#0a0a0a]">
      {/* Background Assets */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none overflow-hidden">
        <img src={bgImage} alt="Background" className="w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-zinc-950/70 to-cyan-950/50 backdrop-blur-[3px]" />
      </div>

      {/* Main Form Center Alignment Box - Align to top on mobile to avoid keyboard clips */}
      <div className="absolute inset-0 overflow-y-auto z-10 flex items-start sm:items-center justify-center p-4 py-12">
        <div 
          style={{ 
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.02) 0%, rgba(255, 255, 255, 0.005) 100%)', 
            backdropFilter: 'blur(30px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 30px 70px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.1)'
          }}
          className="w-full max-w-md p-6 sm:p-10 rounded-3xl sm:rounded-[2.5rem] relative transition-all duration-500 mx-auto my-auto"
        >
          <div className="absolute top-[1px] left-20 right-20 h-[1px] bg-gradient-to-r from-transparent via-[#00f5d4]/40 to-transparent blur-[0.5px]" />

          <AnimatePresence mode="wait">
            <motion.div
              key={viewState}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="mb-8">
                <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                  {viewState === 'signup' && "Create Account"}
                  {viewState === 'verify' && "Verify Email"}
                  {viewState === 'login' && "Welcome Back"}
                  {viewState === 'forgot' && "Recover Access"}
                </h2>
                <p className="text-[10px] text-accent uppercase tracking-widest font-semibold drop-shadow-[0_0_8px_rgba(0,245,212,0.3)]">
                  {viewState === 'signup' && "Join the Studio Workspace"}
                  {viewState === 'verify' && `Enter the code sent to ${email}`}
                  {viewState === 'login' && "Sign in to manage your spaces."}
                  {viewState === 'forgot' && "Enter your email for emergency patch deployment link."}
                </p>
              </div>

              {/* Flash Status Messaging Alerts */}
              {statusMessage.text && (
                <div className={`p-4 rounded-xl mb-6 border text-xs font-mono transition-all duration-300 ${
                  statusMessage.type === 'error' ? 'bg-red-500/10 border-red-500/30 text-red-400' : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                }`}>
                  <div>{statusMessage.text}</div>
                  {validationErrors.length > 0 && (
                    <ul className="mt-2 pl-4 list-disc space-y-1 text-[11px] text-red-300/90">
                      {validationErrors.map((err, i) => {
                        const label = getFieldErrorLabel(err);
                        return (
                          <li key={i}>
                            <span className="capitalize font-bold">{label}:</span> {err.message}
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleAuthSubmit}>
                {viewState === 'signup' && (
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">Full Name</label>
                    <input 
                      type="text" value={name} onChange={(e) => setName(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" required 
                    />
                  </div>
                )}

                {viewState !== 'verify' && (
                  <div className="space-y-1">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">Email Address</label>
                    <input 
                      type="email" placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-4 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-sm" required 
                    />
                  </div>
                )}

                {/* The OTP Input Field view window */}
                {viewState === 'verify' && (
                  <div className="space-y-2">
                    <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">6-Digit Verification Code</label>
                    <input 
                      type="text" maxLength="6" placeholder="123456" value={otpCode} onChange={(e) => setOtpCode(e.target.value)}
                      className="w-full p-4 tracking-[0.5em] text-center rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-accent text-lg font-mono" required 
                    />
                    
                    <div className="flex justify-end pt-1">
                      <button 
                        type="button" 
                        disabled={isResending} 
                        onClick={handleResendCode} 
                        className="text-xs text-accent hover:text-[#00d1b5] transition-colors font-light disabled:opacity-40"
                      >
                        {isResending ? "Dispatching code..." : "Resend code?"}
                      </button>
                    </div>
                  </div>
                )}

                {(viewState !== 'forgot' && viewState !== 'verify') && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-1">
                        <label className="block text-[9px] uppercase tracking-[0.2em] text-cyan-100/60 font-semibold">Password:</label>
                        {viewState === 'signup' && password && (
                          <span className={`text-[9px] uppercase tracking-[0.1em] font-bold ${strength.color}`}>
                            {strength.label}
                          </span>
                        )}
                      </div>
                      {viewState === 'login' && (
                        <button type="button" onClick={() => setViewState('forgot')} className="text-xs text-accent hover:text-[#00d1b5] font-light">Forgot password?</button>
                      )}
                    </div>
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
                )}

                <button 
                  type="submit" disabled={isSubmitting}
                  className="w-full mt-2 py-4 bg-accent hover:bg-accent-hover text-black font-bold rounded-xl active:scale-[0.98] transition-all duration-300 text-xs uppercase tracking-[0.2em] shadow-[0_4px_20px_rgba(0,245,212,0.2)] disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? "Executing Protocol..." : viewState === 'signup' ? "Register Account" : viewState === 'verify' ? "Verify Code" : viewState === 'login' ? "Sign In" : "Transmit Recovery Link"}
                </button>
              </form>


              {/* Base Navigation Switchboard */}
              <div className="mt-8 text-center text-sm font-light text-gray-400 border-t border-white/5 pt-6">
                {(viewState === 'signup' || viewState === 'verify') && (
                  <>Already have an account? <button type="button" onClick={() => setViewState('login')} className="text-white font-medium hover:text-accent underline underline-offset-4 decoration-white/20">Sign In</button></>
                )}
                {viewState === 'login' && (
                  <>New to the platform? <button type="button" onClick={() => setViewState('signup')} className="text-white font-medium hover:text-accent underline underline-offset-4 decoration-white/20">Create one now</button></>
                )}
                {viewState === 'forgot' && (
                  <button type="button" onClick={() => setViewState('login')} className="text-white font-medium hover:text-accent underline underline-offset-4 decoration-white/20">Return to Access Portal</button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}