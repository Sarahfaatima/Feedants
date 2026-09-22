import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TOKEN_STORAGE_KEY } from '../api/client';
import { loginRequest, registerRequest, fetchMe } from '../api/auth';
import { parseApiError } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On app load, restore the session from a stored JWT (if any) and
  // validate it against the backend rather than trusting stale local state.
  useEffect(() => {
    (async () => {
      try {
        const token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY);
        if (token) {
          const me = await fetchMe();
          setUser(me);
        }
      } catch (err) {
        await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const { token, user: loggedInUser } = await loginRequest(email, password);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(loggedInUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: parseApiError(err) };
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    try {
      const { token, user: newUser } = await registerRequest(name, email, password);
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token);
      setUser(newUser);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: parseApiError(err) };
    }
  }, []);

  const logout = useCallback(async () => {
    await AsyncStorage.removeItem(TOKEN_STORAGE_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), initializing, login, register, logout }),
    [user, initializing, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
