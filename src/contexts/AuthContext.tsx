import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  photoURL?: string;
  phone?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  updateProfile: (updates: Partial<User>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('billing_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData: User) => {
    const newUser = {
      email: userData.email,
      name: userData.name,
      photoURL: userData.photoURL || '',
      phone: userData.phone || '',
      location: userData.location || ''
    };
    setUser(newUser);
    localStorage.setItem('billing_user', JSON.stringify(newUser));
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updates };
    setUser(nextUser);
    localStorage.setItem('billing_user', JSON.stringify(nextUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('billing_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, updateProfile, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
