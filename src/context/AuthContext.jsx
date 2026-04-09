import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../api/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const adminSession = localStorage.getItem('adminSession');

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            setUser({ email: payload.email, role: payload.role, id: payload.id || payload._id, username: payload.username });
          }
        } else {
          localStorage.removeItem('token');
        }
      } catch {
        localStorage.removeItem('token');
      }
    } else if (adminSession === 'true') {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    const data = res.data || res;
    
    const token = data.data?.token || data.token || res.token;
    let userData = data.data?.user || data.user || {};

    if (typeof userData !== 'object') userData = {};

    userData.role = userData.role || 'user';

    localStorage.removeItem('adminSession');
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = async () => {
    const token = localStorage.getItem('token');

    if (token) {
      try {
        await authService.logout();
      } catch { }
    }

    localStorage.removeItem('token');
    localStorage.removeItem('adminSession');
    localStorage.removeItem('user');
    setUser(null);
  };

  const isAdmin = user?.role?.toLowerCase() === 'admin';

  return (
    <AuthContext.Provider value={{ user, isAdmin, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
