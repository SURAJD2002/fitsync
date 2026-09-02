import type { User, BodyProfile } from '../types';
import { INITIAL_USER, INITIAL_BODY_PROFILE } from '../data/mockFitnessData';
import { SafeStorage, STORAGE_KEYS } from './storage';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { Capacitor } from '@capacitor/core';

export interface PasswordValidation {
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export function validatePassword(password: string): PasswordValidation {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    hasMinLength,
    hasNumber,
    hasSpecialChar,
    isValid: hasMinLength && hasNumber && hasSpecialChar,
  };
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const digitsOnly = phone.replace(/\D/g, '');
  return digitsOnly.length >= 8 && digitsOnly.length <= 15;
}

export class AuthService {
  static getUser(): User {
    return SafeStorage.get<User>(STORAGE_KEYS.USER_DATA, INITIAL_USER);
  }

  static saveUser(user: User): void {
    SafeStorage.set(STORAGE_KEYS.USER_DATA, user);

    // Sync with Supabase if configured and user is authenticated
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.id) {
          supabase
            .from('profiles')
            .upsert({
              id: data.user.id,
              full_name: user.fullName,
              email: user.email,
              phone_number: user.phoneNumber,
              country_code: user.countryCode,
              avatar_url: user.avatarUrl,
              is_premium: user.isPremium,
              streak_days: user.streakDays,
              completed_workouts_count: user.completedWorkoutsCount,
              goal_progress_percent: user.goalProgressPercent,
              achievements_count: user.achievementsCount,
              updated_at: new Date().toISOString(),
            })
            .then(({ error }) => {
              if (error) console.warn('[AuthService] Profile sync error:', error.message);
            });
        }
      });
    }
  }

  static getBodyProfile(): BodyProfile {
    return SafeStorage.get<BodyProfile>(STORAGE_KEYS.BODY_PROFILE, INITIAL_BODY_PROFILE);
  }

  static saveBodyProfile(profile: BodyProfile): void {
    SafeStorage.set(STORAGE_KEYS.BODY_PROFILE, profile);

    // Sync with Supabase if configured
    if (isSupabaseConfigured()) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user?.id) {
          supabase
            .from('body_profiles')
            .upsert({
              id: data.user.id,
              age: profile.age,
              gender: profile.gender,
              height: profile.height,
              weight: profile.weight,
              body_type: profile.bodyType,
              unit: profile.unit,
              measurements: profile.measurements,
              photos: profile.photos,
              updated_at: new Date().toISOString(),
            })
            .then(({ error }) => {
              if (error) console.warn('[AuthService] Body profile sync error:', error.message);
            });
        }
      });
    }
  }

  static isAuthenticated(): boolean {
    const token = SafeStorage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return !!token;
  }

  static setAuthenticated(token: string = 'mock_jwt_token_fitsync'): void {
    SafeStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static async logout(): Promise<void> {
    SafeStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
    if (isSupabaseConfigured()) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn('[AuthService] Supabase signOut error:', err);
      }
    }
  }

  // Cloud Supabase Authentication Handlers
  static async signUp(email: string, pass: string, fullName: string, phone: string, country: string) {
    if (!isSupabaseConfigured()) {
      this.setAuthenticated();
      return { data: { session: null, user: { id: 'mock-user-id', email } }, error: null };
    }

    return await supabase.auth.signUp({
      email,
      password: pass,
      options: {
        data: {
          full_name: fullName,
          phone_number: phone,
          country_code: country,
        },
      },
    });
  }

  static async login(email: string, pass: string) {
    if (!isSupabaseConfigured()) {
      this.setAuthenticated();
      return { data: { session: null, user: { id: 'mock-user-id', email } }, error: null };
    }

    return await supabase.auth.signInWithPassword({
      email,
      password: pass,
    });
  }

  static async signInWithGoogle() {
    if (!isSupabaseConfigured()) {
      this.setAuthenticated();
      return { data: { url: null, provider: 'google' }, error: null };
    }

    const isNative = Capacitor.isNativePlatform();
    const redirectTo = isNative ? 'com.fitsync.app://google-auth' : window.location.origin;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        skipBrowserRedirect: isNative,
      },
    });

    if (error) {
      return { data: null, error };
    }

    if (isNative && data?.url) {
      window.location.href = data.url;
    }

    return { data, error: null };
  }
}
