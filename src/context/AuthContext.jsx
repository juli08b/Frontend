import { useState, useCallback } from 'react';
import { API_URL } from '../utils/helpers';
import { AuthContext } from './auth-context';

const SESSION_KEY = 'admin-sena-session';

function getStoredUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setSession = useCallback((data) => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(data));
    setUser(data);
  }, []);

  const login = useCallback(
    async (email, password) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'No se pudo iniciar sesión.');
          return false;
        }
        setSession({
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
        });
        return true;
      } catch {
        setError('Error de conexión con el servidor.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
  );

  const register = useCallback(
    async (name, email, password) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || 'No se pudo crear la cuenta.');
          return false;
        }
        setSession({
          id: data.id,
          name: data.name,
          email: data.email,
          createdAt: data.createdAt,
        });
        return true;
      } catch {
        setError('Error de conexión con el servidor.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${API_URL}/logout`, { method: 'POST' });
    } catch {
      // Ignorar errores de red al cerrar sesión local
    }
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback(
    async (data) => {
      setLoading(true);
      setError(null);
      try {
        setSession({ ...user, ...data });
        return true;
      } catch {
        setError('No se pudo actualizar el perfil.');
        return false;
      } finally {
        setLoading(false);
      }
    },
    [setSession, user]
  );

  return (
    <AuthContext.Provider
      value={{ user, loading, error, login, register, logout, updateProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
}
