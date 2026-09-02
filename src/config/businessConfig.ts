/**
 * FitSync Business & Monetization Configuration
 * Centralized business constants to avoid hardcoding across components.
 */

export const BusinessConfig = {
  // Plan details
  currency: 'INR',
  currencySymbol: '₹',
  premiumMonthlyPrice: 99,
  billingPeriod: 'monthly' as const,
  freeTrialDays: 7,

  // Google Play Product ID
  premiumProductId: 'fitsync_premium_monthly',

  // Official Business Payment / Invoicing / Support Identifier
  businessUpi: '8825287284@upi',
  supportEmail: 'support@fitsync.app',

  // Feature keys governed by Entitlement
  features: {
    AI_MEAL_PLANNER: 'AI_MEAL_PLANNER',
    ADVANCED_HYPERTROPHY_BLUEPRINT: 'ADVANCED_HYPERTROPHY_BLUEPRINT',
    METABOLIC_PROGRESS_ANALYTICS: 'METABOLIC_PROGRESS_ANALYTICS',
    INBODY_BIOMETRIC_EXPORT: 'INBODY_BIOMETRIC_EXPORT',
  } as const,

  // Terms & Disclosures
  legal: {
    termsOfServiceUrl: 'https://fitsync.app/terms',
    privacyPolicyUrl: 'https://fitsync.app/privacy',
    refundPolicyUrl: 'https://fitsync.app/refund',
    subscriptionTermsText:
      'FitSync Premium is ₹99/month following your 7-day free trial. You may cancel at any time in Google Play Subscriptions at least 24 hours before your billing cycle ends to prevent recurring charges.',
  },
};

export type PremiumFeature = keyof typeof BusinessConfig.features;
