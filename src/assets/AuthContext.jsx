import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

// Configure axios defaults to automatically send credentials/cookies with every request
axios.defaults.baseURL = 'http://localhost:5000/api';
axios.defaults.withCredentials = true;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a session already exists when the user refreshes or visits the site
  useEffect(() => {
    const checkAuthSession = async () => {
      try {
        const response = await axios.get('/auth/me');
        if (response.data.success) {
          setUser(response.data.user);
        }
      } catch {
        setUser(null); // Explicitly clear if unauthorized
      } finally {
        setLoading(false);
      }
    };
    checkAuthSession();
  }, []);

  const loginUser = async (email, password) => {
    const response = await axios.post('/auth/login', { email, password });
    if (response.data.success) setUser(response.data.user);
    return response.data;
  };

  const logoutUser = async () => {
    await axios.post('/auth/logout');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);