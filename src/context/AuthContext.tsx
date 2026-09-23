import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole } from '../types';
import { authApi, LoginResponse, UserProfile } from '../api/authApi';

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setRole: (role: UserRole) => void;
  loginWithCredentials: (email: string, password: string) => Promise<User>;
  login: (role: UserRole, customName?: string, customEmail?: string) => Promise<void>;
  logout: () => void;
  notificationsCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapProfileToUser(profile: UserProfile): User {
  const normRole: UserRole =
    profile.role.toLowerCase() === 'professor' ? 'professor' : 'aluno';
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    role: normRole,
    matricula: profile.matricula,
    siape: profile.siape,
    avatarUrl: profile.avatarUrl,
  };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('sge_token'));
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('sge_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [role, setRoleState] = useState<UserRole | null>(() => {
    const savedRole = localStorage.getItem('sge_role') as UserRole | null;
    return savedRole || (user?.role ?? 'aluno');
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notificationsCount] = useState<number>(3);

  // Sync role and storage
  useEffect(() => {
    if (role) {
      localStorage.setItem('sge_role', role);
    }
  }, [role]);

  // Handle unauthorized event from api client
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setUser(null);
      localStorage.removeItem('sge_token');
      localStorage.removeItem('sge_user');
    };

    window.addEventListener('sge_unauthorized', handleUnauthorized);
    return () => window.removeEventListener('sge_unauthorized', handleUnauthorized);
  }, []);

  // Initialize session: restore profile or login automatically with seeded user
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const storedToken = localStorage.getItem('sge_token');
      if (storedToken) {
        try {
          const profile = await authApi.getProfile();
          if (isMounted) {
            const mappedUser = mapProfileToUser(profile);
            setUser(mappedUser);
            setRoleState(mappedUser.role);
            localStorage.setItem('sge_user', JSON.stringify(mappedUser));
            localStorage.setItem('sge_role', mappedUser.role);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.warn('Sessão expirada ou inválida, tentando reautenticação...');
          localStorage.removeItem('sge_token');
        }
      }

      // If no valid session, auto-login with default seeded student account
      try {
        const savedRole = (localStorage.getItem('sge_role') as UserRole) || 'aluno';
        const defaultEmail =
          savedRole === 'professor'
            ? 'ricardo.silva@ifce.edu.br'
            : 'luzia.fernandes@aluno.ifce.edu.br';
        const res = await authApi.login({
          email: defaultEmail,
          password: '123456',
        });
        if (isMounted) {
          localStorage.setItem('sge_token', res.token);
          const mappedUser = mapProfileToUser(res.user);
          setUser(mappedUser);
          setToken(res.token);
          setRoleState(mappedUser.role);
          localStorage.setItem('sge_user', JSON.stringify(mappedUser));
          localStorage.setItem('sge_role', mappedUser.role);
        }
      } catch (err) {
        console.error('Erro ao autenticar usuário padrão:', err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    initAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  const loginWithCredentials = useCallback(async (email: string, password: string): Promise<User> => {
    const res = await authApi.login({ email, password });
    localStorage.setItem('sge_token', res.token);
    const mappedUser = mapProfileToUser(res.user);
    setToken(res.token);
    setUser(mappedUser);
    setRoleState(mappedUser.role);
    localStorage.setItem('sge_user', JSON.stringify(mappedUser));
    localStorage.setItem('sge_role', mappedUser.role);
    return mappedUser;
  }, []);

  const login = useCallback(async (newRole: UserRole, _customName?: string, customEmail?: string) => {
    const emailToUse =
      customEmail ||
      (newRole === 'professor' ? 'ricardo.silva@ifce.edu.br' : 'luzia.fernandes@aluno.ifce.edu.br');
    await loginWithCredentials(emailToUse, '123456');
  }, [loginWithCredentials]);

  const setRole = useCallback(async (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('sge_role', newRole);
    // Switch login account according to role to keep backend context valid
    try {
      const emailToUse =
        newRole === 'professor' ? 'ricardo.silva@ifce.edu.br' : 'luzia.fernandes@aluno.ifce.edu.br';
      await loginWithCredentials(emailToUse, '123456');
    } catch (e) {
      console.warn('Erro ao alternar papel:', e);
    }
  }, [loginWithCredentials]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('sge_token');
    localStorage.removeItem('sge_user');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        setRole,
        loginWithCredentials,
        login,
        logout,
        notificationsCount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
