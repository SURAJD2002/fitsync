/**
 * FitSync Safe Storage Utility
 * Provides resilient, crash-proof persistence handling for LocalStorage/WebStorage.
 */

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'fitsync_auth_token',
  USER_DATA: 'fitsync_user_data',
  BODY_PROFILE: 'fitsync_body_profile',
  ACTIVE_WORKOUT: 'fitsync_active_workout',
  ACTIVE_DIET: 'fitsync_active_diet',
  WEIGHT_HISTORY: 'fitsync_weight_history',
  WORKOUT_SESSION: 'fitsync_workout_active_session',
} as const;

export class SafeStorage {
  /**
   * Safely retrieves and parses JSON data from localStorage.
   * Returns fallback if key doesn't exist, is corrupt, or fails parsing.
   */
  static get<T>(key: string, fallback: T): T {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }

    try {
      const raw = localStorage.getItem(key);
      if (raw === null || raw === undefined) {
        return fallback;
      }
      const parsed = JSON.parse(raw);
      return (parsed !== null && parsed !== undefined) ? parsed : fallback;
    } catch (error) {
      console.warn(`[SafeStorage] Failed to parse key "${key}". Reverting to safe default.`, error);
      return fallback;
    }
  }

  /**
   * Safely serializes and saves data to localStorage.
   * Catches and gracefully recovers from QuotaExceededError or security exceptions.
   */
  static set<T>(key: string, value: T): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`[SafeStorage] Failed to write key "${key}" to localStorage. Storage quota may be full.`, error);
      return false;
    }
  }

  /**
   * Safely removes a key from localStorage.
   */
  static remove(key: string): boolean {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[SafeStorage] Failed to remove key "${key}".`, error);
      return false;
    }
  }

  /**
   * Clears all FitSync-related keys from localStorage.
   */
  static clearFitSyncData(): void {
    Object.values(STORAGE_KEYS).forEach((key) => {
      this.remove(key);
    });
  }
}
