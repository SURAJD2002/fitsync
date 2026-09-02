import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, BodyProfile, AuthMode } from '../types';
import { AuthService } from '../services/authService';

interface AuthContextType {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  user: User;
  bodyProfile: BodyProfile;
  login: (emailOrPhone: string, pass: string) => Promise<boolean>;
  signup: (name: string, email: string, phone: string, country: string) => Promise<boolean>;
  saveOnboardingProfile: (profile: BodyProfile) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(AuthService.getUser());
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(AuthService.getBodyProfile());
  const [authMode, setAuthMode] = useState<AuthMode>('signup'); // Default to Sign Up per PDF Page 1

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setAuthMode('app');
    }
  }, []);

  const login = async (emailOrPhone: string): Promise<boolean> => {
    AuthService.setAuthenticated();
    const updated = { ...user, email: emailOrPhone };
    setUser(updated);
    AuthService.saveUser(updated);
    setAuthMode('app');
    return true;
  };

  const signup = async (
    fullName: string,
    email: string,
    phoneNumber: string,
    countryCode: string
  ): Promise<boolean> => {
    const newUser: User = {
      ...user,
      fullName,
      email,
      phoneNumber,
      countryCode,
    };
    setUser(newUser);
    AuthService.saveUser(newUser);
    setAuthMode('onboarding');
    return true;
  };

  const saveOnboardingProfile = (profile: BodyProfile) => {
    setBodyProfile(profile);
    AuthService.saveBodyProfile(profile);
    AuthService.setAuthenticated();
    setAuthMode('app');
  };

  const logout = () => {
    AuthService.logout();
    setAuthMode('login');
  };

  const updateUser = (updated: Partial<User>) => {
    const newUser = { ...user, ...updated };
    setUser(newUser);
    AuthService.saveUser(newUser);
  };

  return (
    <AuthContext.Provider
      value={{
        authMode,
        setAuthMode,
        user,
        bodyProfile,
        login,
        signup,
        saveOnboardingProfile,
        logout,
        updateUser,
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
