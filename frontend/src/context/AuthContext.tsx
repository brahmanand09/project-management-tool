import React from 'react';
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import  jwtDecode  from 'jwt-decode';

interface AuthContextType {
  user: any;
  setUser: (user: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => useContext(AuthContext)!;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
  });

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
