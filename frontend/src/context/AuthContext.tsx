import { createContext, ReactNode, useEffect, useState } from 'react';
import { clearAuthTokens, getAccessToken, setAuthTokens } from '@/api/axiosInstance';
import { User } from '@/types/user.types';
import { loginRequest, logoutRequest, meRequest, signupRequest } from '@/modules/auth/api/auth.api';
import { LoginPayload, SignupPayload } from '@/modules/auth/types/auth.types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<User>;
  signup: (payload: SignupPayload) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      if (!getAccessToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await meRequest();
        setUser(currentUser);
      } catch {
        clearAuthTokens();
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (payload: LoginPayload) => {
    const result = await loginRequest(payload);
    setAuthTokens(result.token, result.refreshToken);
    setUser(result.user);
    return result.user;
  };

  const signup = async (payload: SignupPayload) => {
    await signupRequest(payload);
  };

  const logout = async () => {
    try {
      await logoutRequest();
    } finally {
      clearAuthTokens();
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
