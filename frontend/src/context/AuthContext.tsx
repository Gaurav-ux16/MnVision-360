import React, { createContext, useContext, useState } from 'react';

export interface User {
  username: string;
  role: string;
  email?: string;
  full_name?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  hasPermission: (path: string) => boolean;
  getDefaultDashboard: (role?: string) => string;
}

const DEFAULT_ADMIN_USER: User = {
  username: 'admin',
  role: 'Admin',
  full_name: 'MOIL Executive Administrator',
  email: 'admin@moil.nic.in'
};

const DEFAULT_ADMIN_TOKEN = 'jwt-sec-token-admin-default-session';

const ROLE_PERMISSIONS: Record<string, string[]> = {
  'Admin': [
    '/',
    '/exploration',
    '/drill-planning',
    '/mine-twin',
    '/production',
    '/equipment',
    '/decisions',
    '/what-if',
    '/weather',
    '/security',
    '/field-survey',
    '/data-models',
    '/contact'
  ],
  'Operations Manager': [
    '/',
    '/mine-twin',
    '/production',
    '/equipment',
    '/decisions',
    '/what-if',
    '/weather',
    '/data-models',
    '/contact',
    '/exploration'
  ],
  'Geologist': [
    '/',
    '/exploration',
    '/drill-planning',
    '/field-survey',
    '/data-models',
    '/weather',
    '/contact'
  ],
  'Field Officer': [
    '/',
    '/field-survey',
    '/exploration',
    '/weather',
    '/contact'
  ]
};

const DEFAULT_DASHBOARDS: Record<string, string> = {
  'Admin': '/',
  'Operations Manager': '/mine-twin',
  'Geologist': '/exploration',
  'Field Officer': '/field-survey'
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const savedToken = localStorage.getItem('access_token');
    if (!savedToken) {
      localStorage.setItem('access_token', DEFAULT_ADMIN_TOKEN);
      localStorage.setItem('username', DEFAULT_ADMIN_USER.username);
      localStorage.setItem('user_role', DEFAULT_ADMIN_USER.role);
      localStorage.setItem('user_fullname', DEFAULT_ADMIN_USER.full_name!);
      localStorage.setItem('user_email', DEFAULT_ADMIN_USER.email!);
      return DEFAULT_ADMIN_TOKEN;
    }
    return savedToken;
  });

  const [user, setUser] = useState<User | null>(() => {
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('user_role');
    const savedFullName = localStorage.getItem('user_fullname');
    const savedEmail = localStorage.getItem('user_email');
    if (savedUsername && savedRole) {
      return {
        username: savedUsername,
        role: savedRole,
        full_name: savedFullName || undefined,
        email: savedEmail || undefined,
      };
    }
    return DEFAULT_ADMIN_USER;
  });

  const isAuthenticated = Boolean(token && user);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('access_token', newToken);
    localStorage.setItem('username', newUser.username);
    localStorage.setItem('user_role', newUser.role);
    if (newUser.full_name) localStorage.setItem('user_fullname', newUser.full_name);
    if (newUser.email) localStorage.setItem('user_email', newUser.email);
  };

  const logout = () => {
    if (token) {
      fetch('/api/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    }

    setToken(null);
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('username');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_fullname');
    localStorage.removeItem('user_email');
  };

  const getDefaultDashboard = (roleOverride?: string): string => {
    const activeRole = roleOverride || user?.role || 'Guest';
    return DEFAULT_DASHBOARDS[activeRole] || '/';
  };

  const hasPermission = (path: string): boolean => {
    if (path === '/' || path === '/login' || path === '/contact') {
      return true;
    }

    const basePath = path.split('/')[1] ? `/${path.split('/')[1]}` : path;

    if (!user) {
      return basePath === '/exploration' || basePath === '/contact';
    }

    const allowed = ROLE_PERMISSIONS[user.role];
    if (!allowed) return false;

    return allowed.includes(basePath);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        logout,
        hasPermission,
        getDefaultDashboard,
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
