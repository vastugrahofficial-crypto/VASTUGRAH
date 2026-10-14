import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'vastugrah_auth_user';
const USERS_DB_KEY = 'vastugrah_users_db';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Auto-initialize with a default seeker session if desired, or leave null
      }
    } catch (e) {
      console.warn("Could not load user from localStorage", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveUserSession = (userData) => {
    setUser(userData);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    } catch (e) {
      console.warn("Could not persist user", e);
    }
    return userData;
  };

  const login = async (email, password) => {
    // Check local database or create session
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    } catch (_) {}

    const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existing && existing.password && existing.password !== password) {
      throw new Error("Invalid password. Please check your credentials.");
    }

    const userData = existing || {
      id: 'usr_' + Date.now(),
      email,
      displayName: email.split('@')[0],
      createdAt: new Date().toISOString(),
    };

    return saveUserSession(userData);
  };

  const register = async (email, password, displayName) => {
    let users = [];
    try {
      users = JSON.parse(localStorage.getItem(USERS_DB_KEY) || '[]');
    } catch (_) {}

    const name = displayName || email.split('@')[0];
    const newUser = {
      id: 'usr_' + Date.now(),
      email,
      password,
      displayName: name,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
    } catch (_) {}

    return saveUserSession(newUser);
  };

  const loginWithGoogle = async () => {
    const googleUser = {
      id: 'google_' + Date.now(),
      email: 'seeker.vastu@gmail.com',
      displayName: 'Aditya Sharma',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
      provider: 'google',
      createdAt: new Date().toISOString(),
    };
    return saveUserSession(googleUser);
  };

  const guestLogin = async () => {
    const guestUser = {
      id: 'guest_' + Date.now(),
      email: 'guest@vastugrah.com',
      displayName: 'Vedic Seeker',
      isGuest: true,
      createdAt: new Date().toISOString(),
    };
    return saveUserSession(guestUser);
  };

  const logout = async () => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}
  };

  const forgotPassword = async (email) => {
    return true;
  };

  const resetPassword = async (code, newPassword) => {
    return true;
  };

  const checkUserAuth = () => {
    // no-op, already checked on mount
  };

  const value = {
    user,
    loading,
    isLoadingAuth: loading,
    isLoadingPublicSettings: false,
    authChecked: !loading,
    authError: null,
    isAuthenticated: !!user,
    login,
    register,
    loginWithGoogle,
    guestLogin,
    logout,
    forgotPassword,
    resetPassword,
    checkUserAuth,
    navigateToLogin: () => {
      window.location.href = '/login';
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthContext;
