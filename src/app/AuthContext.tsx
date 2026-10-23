import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { signIn as apiSignIn, signUp as apiSignUp } from '../features/auth/auth.api';

interface AuthContextValue {
  username: string | null;
  isAuthenticated: boolean;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(() => localStorage.getItem('username'));

  const value = useMemo<AuthContextValue>(() => ({
    username,
    isAuthenticated: Boolean(localStorage.getItem('accessToken')),
    async signIn(user, password) {
      const result = await apiSignIn(user, password);
      localStorage.setItem('accessToken', result.accessToken);
      localStorage.setItem('username', result.username || user);
      setUsername(result.username || user);
    },
    async signUp(user, password) {
      await apiSignUp(user, password);
    },
    signOut() {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('username');
      setUsername(null);
    },
  }), [username]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
