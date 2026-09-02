import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, BodyProfile, AuthMode } from '../types';
import { AuthService } from '../services/authService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import { App } from '@capacitor/app';

interface AuthContextType {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  user: User;
  bodyProfile: BodyProfile;
  login: (emailOrPhone: string, pass?: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, phone: string, country: string, pass?: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  saveOnboardingProfile: (profile: BodyProfile) => void;
  logout: () => void;
  updateUser: (updated: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(AuthService.getUser());
  const [bodyProfile, setBodyProfile] = useState<BodyProfile>(AuthService.getBodyProfile());
  const [authMode, setAuthMode] = useState<AuthMode>('signup');

  useEffect(() => {
    if (AuthService.isAuthenticated()) {
      setAuthMode('app');
    }

    // Handle deep links from Google OAuth callback (com.fitsync.app://...)
    const appUrlListener = App.addListener('appUrlOpen', async (event) => {
      const url = event.url;
      if (url.includes('access_token') || url.includes('code=')) {
        if (isSupabaseConfigured()) {
          try {
            // Check hash parameters
            const hash = url.split('#')[1];
            if (hash) {
              const params = new URLSearchParams(hash);
              const accessToken = params.get('access_token');
              const refreshToken = params.get('refresh_token');

              if (accessToken && refreshToken) {
                const { data } = await supabase.auth.setSession({
                  access_token: accessToken,
                  refresh_token: refreshToken,
                });
                if (data.session) {
                  AuthService.setAuthenticated(data.session.access_token);
                  setAuthMode('app');
                }
              }
            } else if (url.includes('code=')) {
              const code = new URL(url).searchParams.get('code');
              if (code) {
                const { data } = await supabase.auth.exchangeCodeForSession(code);
                if (data.session) {
                  AuthService.setAuthenticated(data.session.access_token);
                  setAuthMode('app');
                }
              }
            }
          } catch (err) {
            console.warn('[AuthContext] Deep link session exchange error:', err);
          }
        }
      }
    });

    if (isSupabaseConfigured()) {
      // Listen to real-time auth state changes
      const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        if (session?.user) {
          AuthService.setAuthenticated(session.access_token);
          setAuthMode('app');

          // Fetch full user profile from Supabase
          supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            .then(({ data: profileData }) => {
              if (profileData) {
                setUser((prev) => {
                  const updatedUser: User = {
                    ...prev,
                    id: profileData.id,
                    fullName: profileData.full_name || prev.fullName,
                    email: profileData.email || session.user.email || prev.email,
                    phoneNumber: profileData.phone_number || prev.phoneNumber,
                    countryCode: profileData.country_code || prev.countryCode,
                    avatarUrl: profileData.avatar_url || prev.avatarUrl,
                    isPremium: profileData.is_premium ?? prev.isPremium,
                    streakDays: profileData.streak_days ?? prev.streakDays,
                  };
                  AuthService.saveUser(updatedUser);
                  return updatedUser;
                });
              }
            });
        } else if (event === 'SIGNED_OUT') {
          AuthService.logout();
          setAuthMode('login');
        }
      });

      return () => {
        authListener?.subscription.unsubscribe();
        appUrlListener.then((sub) => sub.remove());
      };
    }

    return () => {
      appUrlListener.then((sub) => sub.remove());
    };
  }, []);

  const login = async (emailOrPhone: string, pass: string = 'FitSync#2026'): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await AuthService.login(emailOrPhone, pass);
      if (error) {
        return { success: false, error: error.message };
      }
      if (data && 'session' in data && data.session) {
        AuthService.setAuthenticated((data.session as any).access_token);
      }
    } else {
      AuthService.setAuthenticated();
    }

    const updated = { ...user, email: emailOrPhone };
    setUser(updated);
    AuthService.saveUser(updated);
    setAuthMode('app');
    return { success: true };
  };

  const signup = async (
    fullName: string,
    email: string,
    phoneNumber: string,
    countryCode: string,
    pass: string = 'FitSync#2026'
  ): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const { data, error } = await AuthService.signUp(email, pass, fullName, phoneNumber, countryCode);
      if (error) {
        return { success: false, error: error.message };
      }
      if (data && 'session' in data && data.session) {
        AuthService.setAuthenticated((data.session as any).access_token);
      }
    }

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
    return { success: true };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    if (isSupabaseConfigured()) {
      const { error } = await AuthService.signInWithGoogle();
      if (error) {
        return { success: false, error: error.message };
      }
    }

    // Google Sign-in Verified User fallback/sync
    const googleUser: User = {
      ...user,
      fullName: user.fullName === 'Athlete' ? 'Suraj Kumar' : user.fullName,
      email: user.email || 'suraj.google@fitsync.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      streakDays: Math.max(1, user.streakDays),
    };
    setUser(googleUser);
    AuthService.saveUser(googleUser);
    AuthService.setAuthenticated();
    setAuthMode('app');
    return { success: true };
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
        signInWithGoogle,
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
