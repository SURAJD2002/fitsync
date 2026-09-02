import type { User, BodyProfile } from '../types';
import { INITIAL_USER, INITIAL_BODY_PROFILE } from '../data/mockFitnessData';

const USER_STORAGE_KEY = 'fitsync_user_data';
const PROFILE_STORAGE_KEY = 'fitsync_body_profile';
const AUTH_TOKEN_KEY = 'fitsync_auth_token';

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
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_USER;
      }
    }
    return INITIAL_USER;
  }

  static saveUser(user: User): void {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  }

  static getBodyProfile(): BodyProfile {
    const saved = localStorage.getItem(PROFILE_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_BODY_PROFILE;
      }
    }
    return INITIAL_BODY_PROFILE;
  }

  static saveBodyProfile(profile: BodyProfile): void {
    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }

  static isAuthenticated(): boolean {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  }

  static setAuthenticated(token: string = 'mock_jwt_token_fitsync'): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  }

  static logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  }
}
