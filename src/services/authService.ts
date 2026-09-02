import type { User, BodyProfile } from '../types';
import { INITIAL_USER, INITIAL_BODY_PROFILE } from '../data/mockFitnessData';
import { SafeStorage, STORAGE_KEYS } from './storage';

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
  }

  static getBodyProfile(): BodyProfile {
    return SafeStorage.get<BodyProfile>(STORAGE_KEYS.BODY_PROFILE, INITIAL_BODY_PROFILE);
  }

  static saveBodyProfile(profile: BodyProfile): void {
    SafeStorage.set(STORAGE_KEYS.BODY_PROFILE, profile);
  }

  static isAuthenticated(): boolean {
    const token = SafeStorage.get<string | null>(STORAGE_KEYS.AUTH_TOKEN, null);
    return !!token;
  }

  static setAuthenticated(token: string = 'mock_jwt_token_fitsync'): void {
    SafeStorage.set(STORAGE_KEYS.AUTH_TOKEN, token);
  }

  static logout(): void {
    SafeStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
  }
}

