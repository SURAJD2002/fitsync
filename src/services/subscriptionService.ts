import { supabase } from './supabaseClient';
import { SafeStorage } from './storage';
import { BusinessConfig, type PremiumFeature } from '../config/businessConfig';

export type SubscriptionStatus =
  | 'free'
  | 'trialing'
  | 'active'
  | 'cancelled'
  | 'expired'
  | 'past_due'
  | 'grace';

export type SubscriptionPlan = 'free' | 'premium';

export interface EntitlementState {
  status: SubscriptionStatus;
  plan: SubscriptionPlan;
  isPremium: boolean;
  isTrial: boolean;
  trialDaysRemaining: number;
  trialEndsAt: string | null;
  subscriptionEndsAt: string | null;
  canUsePremiumFeatures: boolean;
  cachedAt: number;
}

const STORAGE_KEY_ENTITLEMENT = 'fitsync_entitlement_v1';

const DEFAULT_FREE_ENTITLEMENT: EntitlementState = {
  status: 'free',
  plan: 'free',
  isPremium: false,
  isTrial: false,
  trialDaysRemaining: 0,
  trialEndsAt: null,
  subscriptionEndsAt: null,
  canUsePremiumFeatures: false,
  cachedAt: Date.now(),
};

class SubscriptionService {
  private currentEntitlement: EntitlementState = DEFAULT_FREE_ENTITLEMENT;

  constructor() {
    this.loadCachedEntitlement();
  }

  private loadCachedEntitlement(): void {
    const cached = SafeStorage.get<EntitlementState | null>(STORAGE_KEY_ENTITLEMENT, null);
    if (cached) {
      // Validate offline expiration timestamp
      this.currentEntitlement = this.evaluateExpiration(cached);
    }
  }

  private evaluateExpiration(state: EntitlementState): EntitlementState {
    const now = Date.now();

    // Check trial expiration
    if (state.status === 'trialing' && state.trialEndsAt) {
      const trialEndTime = new Date(state.trialEndsAt).getTime();
      if (now > trialEndTime) {
        return {
          ...state,
          status: 'expired',
          plan: 'free',
          isPremium: false,
          isTrial: false,
          trialDaysRemaining: 0,
          canUsePremiumFeatures: false,
        };
      } else {
        const msLeft = trialEndTime - now;
        const daysLeft = Math.max(1, Math.ceil(msLeft / (1000 * 60 * 60 * 24)));
        return {
          ...state,
          trialDaysRemaining: daysLeft,
          canUsePremiumFeatures: true,
          isPremium: true,
          isTrial: true,
        };
      }
    }

    // Check active paid subscription expiration
    if (state.status === 'active' && state.subscriptionEndsAt) {
      const subEndTime = new Date(state.subscriptionEndsAt).getTime();
      if (now > subEndTime) {
        return {
          ...state,
          status: 'expired',
          plan: 'free',
          isPremium: false,
          canUsePremiumFeatures: false,
        };
      }
    }

    return state;
  }

  /**
   * Synchronous check for instant UI gating.
   */
  public canUseFeature(feature: PremiumFeature): boolean {
    const evaluated = this.evaluateExpiration(this.currentEntitlement);
    this.currentEntitlement = evaluated;

    // Defined free features are always accessible
    if (!BusinessConfig.features[feature]) {
      return true;
    }

    return evaluated.canUsePremiumFeatures;
  }

  /**
   * Authoritative entitlement fetch from Supabase PostgreSQL.
   */
  public async getEntitlement(userId?: string): Promise<EntitlementState> {
    if (!userId) {
      return this.evaluateExpiration(this.currentEntitlement);
    }

    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        // No subscription row exists -> pure Free tier
        const freeState: EntitlementState = {
          ...DEFAULT_FREE_ENTITLEMENT,
          cachedAt: Date.now(),
        };
        this.currentEntitlement = freeState;
        SafeStorage.set(STORAGE_KEY_ENTITLEMENT, freeState);
        return freeState;
      }

      const now = new Date().toISOString();
      const isTrial = data.status === 'trialing' && (!data.trial_end || data.trial_end > now);
      const isPaidActive = data.status === 'active' && (!data.current_period_end || data.current_period_end > now);

      let trialDaysRemaining = 0;
      if (isTrial && data.trial_end) {
        const diffMs = new Date(data.trial_end).getTime() - Date.now();
        trialDaysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
      }

      const effectiveStatus: SubscriptionStatus = isPaidActive
        ? 'active'
        : isTrial
        ? 'trialing'
        : 'expired';

      const state: EntitlementState = {
        status: effectiveStatus,
        plan: isPaidActive || isTrial ? 'premium' : 'free',
        isPremium: isPaidActive || isTrial,
        isTrial,
        trialDaysRemaining,
        trialEndsAt: data.trial_end,
        subscriptionEndsAt: data.current_period_end,
        canUsePremiumFeatures: isPaidActive || isTrial,
        cachedAt: Date.now(),
      };

      this.currentEntitlement = state;
      SafeStorage.set(STORAGE_KEY_ENTITLEMENT, state);
      return state;
    } catch (err) {
      console.warn('[SubscriptionService] Network error fetching entitlement, falling back to cache:', err);
      return this.evaluateExpiration(this.currentEntitlement);
    }
  }

  /**
   * Initializes a 7-day free trial for the user.
   */
  public async startFreeTrial(userId: string): Promise<{ success: boolean; error?: string }> {
    if (!userId) {
      return { success: false, error: 'User must be authenticated to start a trial.' };
    }

    try {
      const trialStart = new Date();
      const trialEnd = new Date(trialStart.getTime() + BusinessConfig.freeTrialDays * 24 * 60 * 60 * 1000);

      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: userId,
          provider: 'trial',
          product_id: BusinessConfig.premiumProductId,
          status: 'trialing',
          plan: 'premium',
          trial_start: trialStart.toISOString(),
          trial_end: trialEnd.toISOString(),
          cancel_at_period_end: false,
        })
        .select()
        .single();

      if (error) {
        // If row already exists, fetch existing subscription state
        if (error.code === '23505') {
          await this.getEntitlement(userId);
          return { success: true };
        }
        return { success: false, error: error.message };
      }

      if (data) {
        const state: EntitlementState = {
          status: 'trialing',
          plan: 'premium',
          isPremium: true,
          isTrial: true,
          trialDaysRemaining: BusinessConfig.freeTrialDays,
          trialEndsAt: trialEnd.toISOString(),
          subscriptionEndsAt: null,
          canUsePremiumFeatures: true,
          cachedAt: Date.now(),
        };
        this.currentEntitlement = state;
        SafeStorage.set(STORAGE_KEY_ENTITLEMENT, state);
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to start free trial' };
    }
  }

  /**
   * Restores existing purchases for the authenticated user from the server.
   */
  public async restorePurchases(userId: string): Promise<{ restored: boolean; entitlement: EntitlementState }> {
    const entitlement = await this.getEntitlement(userId);
    return {
      restored: entitlement.isPremium,
      entitlement,
    };
  }

  /**
   * Directs user to Google Play Subscriptions Center to manage/cancel subscription.
   */
  public manageSubscription(): void {
    const playStoreUrl = `https://play.google.com/store/account/subscriptions?package=com.fitsync.app&sku=${BusinessConfig.premiumProductId}`;
    window.open(playStoreUrl, '_blank');
  }

  /**
   * For testing & local inspection: sets memory entitlement without compromising server
   */
  public _setLocalStateForTesting(state: EntitlementState): void {
    this.currentEntitlement = state;
    SafeStorage.set(STORAGE_KEY_ENTITLEMENT, state);
  }
}

export const subscriptionService = new SubscriptionService();
