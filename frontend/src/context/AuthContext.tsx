import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/axios';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Load and verify current user on mount
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        if (storedToken === 'demo-guest-token-123') {
          // Keep guest session
          setLoading(false);
          return;
        }
        try {
          const res = await api.get('/auth/me');
          setUser(res.data.user);
          localStorage.setItem('user', JSON.stringify(res.data.user));
        } catch (error) {
          console.error('Session restore failed:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: authToken, user: loggedUser } = res.data;
    
    setToken(authToken);
    setUser(loggedUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(loggedUser));
  };

  const register = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/register', { name, email, password });
    const { token: authToken, user: registeredUser } = res.data;

    setToken(authToken);
    setUser(registeredUser);
    localStorage.setItem('token', authToken);
    localStorage.setItem('user', JSON.stringify(registeredUser));
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: 'demo-guest-user-123',
      name: 'Guest Explorer',
      email: 'guest@careertrack.com',
      createdAt: new Date().toISOString(),
    };
    const guestToken = 'demo-guest-token-123';

    setToken(guestToken);
    setUser(guestUser);
    localStorage.setItem('token', guestToken);
    localStorage.setItem('user', JSON.stringify(guestUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        login,
        register,
        loginAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
