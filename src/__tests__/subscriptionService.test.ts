import { describe, it, expect, beforeEach } from 'vitest';
import { subscriptionService, type EntitlementState } from '../services/subscriptionService';
import { BusinessConfig } from '../config/businessConfig';
import { SafeStorage } from '../services/storage';

describe('FitSync Business & Monetization Architecture — SubscriptionService', () => {
  beforeEach(() => {
    localStorage.clear();
    SafeStorage.remove('fitsync_entitlement_v1');
  });

  describe('1. Business Model & Pricing Verification', () => {
    it('verifies exact subscription pricing is ₹99 / month', () => {
      expect(BusinessConfig.premiumMonthlyPrice).toBe(99);
      expect(BusinessConfig.currency).toBe('INR');
      expect(BusinessConfig.currencySymbol).toBe('₹');
      expect(BusinessConfig.billingPeriod).toBe('monthly');
    });

    it('verifies exact trial duration is 7 days', () => {
      expect(BusinessConfig.freeTrialDays).toBe(7);
    });

    it('verifies centralized Google Play subscription product ID', () => {
      expect(BusinessConfig.premiumProductId).toBe('fitsync_premium_monthly');
    });

    it('verifies official business payment & support UPI identifier', () => {
      expect(BusinessConfig.businessUpi).toBe('8825287284@upi');
      expect(BusinessConfig.supportEmail).toBe('support@fitsync.app');
    });
  });

  describe('2. Entitlement State Machine & Lifecycle Transitions', () => {
    it('defaults new users to free tier without premium access', () => {
      subscriptionService._setLocalStateForTesting({
        status: 'free',
        plan: 'free',
        isPremium: false,
        isTrial: false,
        trialDaysRemaining: 0,
        trialEndsAt: null,
        subscriptionEndsAt: null,
        canUsePremiumFeatures: false,
        cachedAt: Date.now(),
      });

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(false);
    });

    it('entitles user during active 7-day trial period', () => {
      const futureTrialEnd = new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString();

      subscriptionService._setLocalStateForTesting({
        status: 'trialing',
        plan: 'premium',
        isPremium: true,
        isTrial: true,
        trialDaysRemaining: 6,
        trialEndsAt: futureTrialEnd,
        subscriptionEndsAt: null,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      });

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(true);
      expect(subscriptionService.canUseFeature('ADVANCED_HYPERTROPHY_BLUEPRINT')).toBe(true);
    });

    it('automatically revokes access when trial expires', () => {
      // Trial ended 1 hour ago
      const pastTrialEnd = new Date(Date.now() - 3600 * 1000).toISOString();

      subscriptionService._setLocalStateForTesting({
        status: 'trialing',
        plan: 'premium',
        isPremium: true,
        isTrial: true,
        trialDaysRemaining: 0,
        trialEndsAt: pastTrialEnd,
        subscriptionEndsAt: null,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      });

      // Verification: evaluateExpiration downgrades immediately
      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(false);
    });

    it('entitles user with active paid subscription within billing period', () => {
      const nextMonthEnd = new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString();

      subscriptionService._setLocalStateForTesting({
        status: 'active',
        plan: 'premium',
        isPremium: true,
        isTrial: false,
        trialDaysRemaining: 0,
        trialEndsAt: null,
        subscriptionEndsAt: nextMonthEnd,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      });

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(true);
    });

    it('automatically revokes premium when billing period expires', () => {
      // Paid subscription expired 2 days ago
      const pastSubEnd = new Date(Date.now() - 2 * 24 * 3600 * 1000).toISOString();

      subscriptionService._setLocalStateForTesting({
        status: 'active',
        plan: 'premium',
        isPremium: true,
        isTrial: false,
        trialDaysRemaining: 0,
        trialEndsAt: null,
        subscriptionEndsAt: pastSubEnd,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      });

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(false);
    });
  });

  describe('3. Offline Resiliency & Cache Safety', () => {
    it('maintains valid active trial while offline', () => {
      const validUntil = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
      const cachedState: EntitlementState = {
        status: 'trialing',
        plan: 'premium',
        isPremium: true,
        isTrial: true,
        trialDaysRemaining: 5,
        trialEndsAt: validUntil,
        subscriptionEndsAt: null,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      };

      SafeStorage.set('fitsync_entitlement_v1', cachedState);
      subscriptionService._setLocalStateForTesting(cachedState);

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(true);
    });

    it('refuses to grant premium offline if cached period has expired', () => {
      const expiredAt = new Date(Date.now() - 10000).toISOString();
      const expiredCache: EntitlementState = {
        status: 'active',
        plan: 'premium',
        isPremium: true,
        isTrial: false,
        trialDaysRemaining: 0,
        trialEndsAt: null,
        subscriptionEndsAt: expiredAt,
        canUsePremiumFeatures: true,
        cachedAt: Date.now(),
      };

      SafeStorage.set('fitsync_entitlement_v1', expiredCache);
      subscriptionService._setLocalStateForTesting(expiredCache);

      expect(subscriptionService.canUseFeature('AI_MEAL_PLANNER')).toBe(false);
    });
  });
});
