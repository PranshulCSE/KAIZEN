import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authApi } from '../api/auth.api.js';
import { storage } from '../utils/storage.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  // We don't have a GET /me endpoint on the backend, so on refresh we trust
  // the stored token and rehydrate the user from what we saved at login time.
  useEffect(() => {
    const token = storage.getAccessToken();
    const cachedUser = localStorage.getItem('kaizen_user');
    if (token && cachedUser) {
      try {
        setUser(JSON.parse(cachedUser));
      } catch {
        storage.clearTokens();
      }
    }
    setIsBootstrapping(false);
  }, []);

  const persistSession = useCallback((sessionUser, tokens) => {
    setUser(sessionUser);
    storage.setTokens(tokens.accessToken, tokens.refreshToken);
    localStorage.setItem('kaizen_user', JSON.stringify(sessionUser));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await authApi.login({ email, password });
      persistSession(data.data.user, data.data.tokens);
      return data.data.user;
    },
    [persistSession]
  );

  const verifyOtp = useCallback(
    async (email, otp) => {
      const { data } = await authApi.verifyOtp({ email, otp });
      persistSession(data.data.user, data.data.tokens);
      return data.data.user;
    },
    [persistSession]
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // token may already be invalid/expired — clear locally regardless
    }
    storage.clearTokens();
    localStorage.removeItem('kaizen_user');
    setUser(null);
  }, []);

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isAdmin: user?.role === 'admin' || user?.role === 'super-admin',
    isBootstrapping,
    login,
    verifyOtp,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuthContext must be used within AuthProvider');
  return ctx;
};
