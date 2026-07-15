import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light');
    localStorage.setItem('arc_theme', 'dark');
  }, []);

  const toggleTheme = () => {
    // Strictly dark mode only
  };

  // 🍞 Toast Dispatcher function
  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
  };

  const closeToast = () => {
    setToast(null);
  };

  // 🔄 Check for an existing session from HttpOnly Cookie on mount
  useEffect(() => {
    (async () => {
      try {
        const response = await api.get('/api/user/profile');
        if (response.data.success && response.data.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // 🔐 Login Pipeline Handling
  const login = async (email, password) => {
    try {
      const response = await api.post('/api/auth/login', { email, password });
      if (response.data.success) {
        setUser(response.data.user);
        if (response.data.token) {
          localStorage.setItem('arc_token', response.data.token);
        }
        showToast(`Welcome back, ${response.data.user.name || 'User'}!`, 'success');
        return { success: true };
      }
      return { success: false, message: response.data.message || 'Authentication failed' };
    } catch (error) {
      const msg = error.response?.data?.message || 'Authentication failed';
      showToast(msg, 'error');
      return { 
        success: false, 
        message: msg,
        errors: error.response?.data?.errors
      };
    }
  };

  // 📝 Register Pipeline Handling
  const register = async (name, email, password) => {
    try {
      const response = await api.post('/api/auth/register', { name, email, password });
      if (response.data.success) {
        if (response.data.sandbox && response.data.otp) {
          showToast(`[SANDBOX MODE] Code: ${response.data.otp}`, 'info');
        } else {
          showToast("Verification code dispatched to your email.", 'success');
        }
        return { 
          success: true, 
          message: response.data.message,
          sandbox: response.data.sandbox,
          otp: response.data.otp 
        };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed';
      showToast(msg, 'error');
      return { 
        success: false, 
        message: msg,
        errors: error.response?.data?.errors
      };
    }
  };

  // 🔢 Verify OTP code
  const verifyOtp = async (email, otp) => {
    try {
      const response = await api.post('/api/auth/verify-otp', { email, otp });
      if (response.data.success) {
        showToast("Email verified successfully! You can now log in.", 'success');
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed';
      showToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  // 🔑 Forgot Password request
  const forgotPassword = async (email) => {
    try {
      const response = await api.post('/api/auth/forgot-password', { email });
      if (response.data.success) {
        showToast("Recovery link transmitted to your inbox.", "success");
        return { success: true };
      }
      return { success: false, message: response.data.message };
    } catch (error) {
      const msg = error.response?.data?.message || "Password recovery request failed.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // 👤 Update Profile via multipart/form-data
  const updateProfile = async (formData) => {
    try {
      const response = await api.put('/api/user/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.success && response.data.user) {
        setUser(response.data.user);
        showToast("Profile credentials synchronized successfully.", "success");
        return { success: true };
      }
      return { success: false, message: response.data.message || "Profile update failed" };
    } catch (error) {
      const msg = error.response?.data?.message || "Profile update failed.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // 🔑 Change Password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      const response = await api.put('/api/user/change-password', { currentPassword, newPassword });
      if (response.data.success) {
        showToast("Password updated successfully. Re-authentication required.", "success");
        localStorage.removeItem('arc_token');
        setUser(null);
        navigate('/login');
        return { success: true };
      }
      return { success: false, message: response.data.message || "Failed to update password." };
    } catch (error) {
      const msg = error.response?.data?.message || "Password change failed.";
      showToast(msg, "error");
      return { success: false, message: msg };
    }
  };

  // 🚪 Logout Operation
  const logoutUser = async () => {
    try {
      await api.post('/api/user/logout');
    } catch {
      // Graceful fallback
    } finally {
      localStorage.removeItem('arc_token');
      setUser(null);
      showToast("Session terminated.", "info");
      navigate('/login');
    }
  };

  // Compatibility mapping layer for App.jsx navbar triggers
  const setIsAuthenticated = (state) => {
    if (!state) logoutUser();
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    toast,
    showToast,
    closeToast,
    login,
    register,
    verifyOtp,
    forgotPassword,
    updateProfile,
    changePassword,
    logoutUser,
    logout: logoutUser,
    setIsAuthenticated,
    theme,
    toggleTheme
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);