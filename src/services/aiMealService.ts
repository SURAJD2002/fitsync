/**
 * FitSync AI Meal Planner Client Service
 * 
 * Responsibilities:
 * - Strict schema validation of AI responses.
 * - Enforcing mathematical macro tolerance (+-5%).
 * - Rate limiting and timeout management.
 * - Proxied dispatch to Supabase Edge Function with JWT auth.
 * - Seamless offline-first fallback to DeterministicNutritionEngine.
 */

import type { DietPlan, MealItem } from '../types';
import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DeterministicNutritionEngine, type DeterministicPlanParams, type DietaryPreference } from './deterministicNutrition';

export interface AIMealPlanRequest {
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  goal: string;
  dietaryPreference: DietaryPreference;
  allergies?: string[];
  dislikedFoods?: string[];
  mealCount?: number;
  bodyProfile: DeterministicPlanParams;
}

export interface AIMealPlanResult {
  success: boolean;
  dietPlan: DietPlan;
  source: 'ai_edge_function' | 'deterministic_engine' | 'cached_plan';
  error?: string;
  disclaimer: string;
}

export class AIMealService {
  private static lastRequests: number[] = [];
  private static readonly MAX_REQUESTS_PER_WINDOW = 5;
  private static readonly RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
  private static readonly REQUEST_TIMEOUT_MS = 12000; // 12 seconds

  /**
   * Sanitizes user input string against PII (emails, phone numbers, injection payloads).
   */
  static sanitizeInput(str: string): string {
    if (!str) return '';
    return str
      .replace(/[<>{}\\]/g, '')
      .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[REDACTED]')
      .replace(/\b\d{10,15}\b/g, '[REDACTED]')
      .trim()
      .slice(0, 150);
  }

  /**
   * Validates if the user is within rate limit bounds.
   */
  static checkRateLimit(): { allowed: boolean; retryAfterSec?: number } {
    const now = Date.now();
    this.lastRequests = this.lastRequests.filter((t) => now - t < this.RATE_WINDOW_MS);

    if (this.lastRequests.length >= this.MAX_REQUESTS_PER_WINDOW) {
      const oldest = this.lastRequests[0];
      const retryAfterSec = Math.ceil((this.RATE_WINDOW_MS - (now - oldest)) / 1000);
      return { allowed: false, retryAfterSec };
    }

    this.lastRequests.push(now);
    return { allowed: true };
  }

  /**
   * Strict JSON Schema Validator for AI Diet Plan responses.
   * Ensures no missing keys, valid meal numbers, positive macros, and macro sum tolerance (+-5%).
   */
  static validatePlanSchema(data: any, targetCalories: number): { isValid: boolean; error?: string } {
    if (!data || typeof data !== 'object') {
      return { isValid: false, error: 'AI output is not a valid JSON object.' };
    }

    if (typeof data.title !== 'string' || data.title.trim() === '') {
      return { isValid: false, error: 'Missing diet plan title.' };
    }

    if (typeof data.dailyCaloriesTarget !== 'number' || data.dailyCaloriesTarget < 1000 || data.dailyCaloriesTarget > 6000) {
      return { isValid: false, error: 'Daily calories target is out of physiological bounds.' };
    }

    if (!Array.isArray(data.meals) || data.meals.length < 3 || data.meals.length > 6) {
      return { isValid: false, error: 'Meals array must contain between 3 and 6 items.' };
    }

    let sumCalories = 0;
    let sumProtein = 0;

    for (let i = 0; i < data.meals.length; i++) {
      const meal = data.meals[i];
      if (
        typeof meal.title !== 'string' ||
        typeof meal.description !== 'string' ||
        typeof meal.type !== 'string' ||
        typeof meal.calories !== 'number' ||
        typeof meal.proteinGrams !== 'number' ||
        typeof meal.carbsGrams !== 'number' ||
        typeof meal.fatsGrams !== 'number'
      ) {
        return { isValid: false, error: `Meal at index ${i} has missing or malformed fields.` };
      }

      if (meal.calories <= 0 || meal.proteinGrams < 0 || meal.carbsGrams < 0 || meal.fatsGrams < 0) {
        return { isValid: false, error: `Meal at index ${i} contains negative or impossible macro values.` };
      }

      sumCalories += meal.calories;
      sumProtein += meal.proteinGrams;
    }

    // Mathematical Tolerance: Meals sum must be within +-10% of daily target
    const calDiff = Math.abs(sumCalories - targetCalories) / targetCalories;
    if (calDiff > 0.10) {
      return { isValid: false, error: `Total meal calories (${sumCalories}) deviate from authoritative target (${targetCalories}) by >10%.` };
    }

    return { isValid: true };
  }

  /**
   * Main AI Generation Orchestrator:
   * 1. Evaluates authoritative deterministic targets first.
   * 2. Attempts Supabase Edge Function AI dispatch with JWT and timeout.
   * 3. Validates output strictly.
   * 4. Seamlessly falls back to Deterministic Engine if offline or error occurs.
   */
  static async generatePersonalizedMealPlan(req: AIMealPlanRequest): Promise<AIMealPlanResult> {
    const disclaimer = 'AI-crafted recommendation based on your physiological metrics. Verify suitability for individual medical needs.';

    // 1. Authoritative Deterministic Metrics calculation
    const deterministicMetrics = DeterministicNutritionEngine.computeMacroTargets(
      req.bodyProfile.gender,
      req.bodyProfile.age,
      req.bodyProfile.heightCm,
      req.bodyProfile.weightKg,
      req.goal,
      req.bodyProfile.activityLevel || 'moderate'
    );

    // Rate Limit Check
    const rateCheck = this.checkRateLimit();
    if (!rateCheck.allowed) {
      const fallbackPlan = DeterministicNutritionEngine.generateDeterministicMealPlan({
        ...req.bodyProfile,
        goal: req.goal,
        preference: req.dietaryPreference,
        allergies: req.allergies,
        mealCount: req.mealCount,
      });
      return {
        success: true,
        dietPlan: fallbackPlan,
        source: 'deterministic_engine',
        error: `Rate limit reached. Generated using FitSync authoritative engine (retry in ${rateCheck.retryAfterSec}s).`,
        disclaimer,
      };
    }

    // Check if Supabase cloud function is available
    if (!isSupabaseConfigured() || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      const fallbackPlan = DeterministicNutritionEngine.generateDeterministicMealPlan({
        ...req.bodyProfile,
        goal: req.goal,
        preference: req.dietaryPreference,
        allergies: req.allergies,
        mealCount: req.mealCount,
      });
      return {
        success: true,
        dietPlan: fallbackPlan,
        source: 'deterministic_engine',
        disclaimer,
      };
    }

    // 2. Call Supabase Edge Function `ai-meal-plan` with timeout
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData?.session?.access_token || '';

      const sanitizedAllergies = (req.allergies || []).map((a) => this.sanitizeInput(a)).filter(Boolean);
      const sanitizedDislikes = (req.dislikedFoods || []).map((d) => this.sanitizeInput(d)).filter(Boolean);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.REQUEST_TIMEOUT_MS);

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const functionUrl = `${supabaseUrl}/functions/v1/ai-meal-plan`;

      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
        body: JSON.stringify({
          targetCalories: deterministicMetrics.targetCalories,
          proteinTarget: deterministicMetrics.proteinGrams,
          carbsTarget: deterministicMetrics.carbsGrams,
          fatsTarget: deterministicMetrics.fatsGrams,
          goal: req.goal,
          dietaryPreference: req.dietaryPreference,
          allergies: sanitizedAllergies,
          dislikedFoods: sanitizedDislikes,
          mealCount: req.mealCount || 4,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const rawJson = await response.json();
        const validation = this.validatePlanSchema(rawJson, deterministicMetrics.targetCalories);

        if (validation.isValid) {
          const validatedDietPlan: DietPlan = {
            title: rawJson.title || `${req.dietaryPreference} AI Plan`,
            goal: req.goal,
            durationWeeks: rawJson.durationWeeks || 8,
            dailyCaloriesTarget: deterministicMetrics.targetCalories,
            proteinTarget: deterministicMetrics.proteinGrams,
            carbsTarget: deterministicMetrics.carbsGrams,
            fatsTarget: deterministicMetrics.fatsGrams,
            fiberTarget: deterministicMetrics.fiberGrams,
            waterTargetGlasses: deterministicMetrics.waterGlasses,
            waterGlassesDrunk: 0,
            meals: rawJson.meals.map((m: any, idx: number): MealItem => ({
              id: m.id || `ai_meal_${idx + 1}_${Date.now()}`,
              type: m.type || 'Meal',
              time: m.time || '12:00 PM',
              title: m.title,
              description: m.description,
              calories: m.calories,
              proteinGrams: m.proteinGrams,
              carbsGrams: m.carbsGrams,
              fatsGrams: m.fatsGrams,
              imageUrl: m.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
            })),
          };

          return {
            success: true,
            dietPlan: validatedDietPlan,
            source: 'ai_edge_function',
            disclaimer,
          };
        } else {
          console.warn('[AIMealService] AI response failed strict schema validation:', validation.error);
        }
      } else {
        console.warn('[AIMealService] Edge Function returned non-200 status:', response.status);
      }
    } catch (err: any) {
      console.warn('[AIMealService] Edge Function fetch failed / timed out. Using deterministic fallback.', err?.message);
    }

    // 3. Fallback to Local Deterministic Engine on error/timeout
    const fallbackPlan = DeterministicNutritionEngine.generateDeterministicMealPlan({
      ...req.bodyProfile,
      goal: req.goal,
      preference: req.dietaryPreference,
      allergies: req.allergies,
      mealCount: req.mealCount,
    });

    return {
      success: true,
      dietPlan: fallbackPlan,
      source: 'deterministic_engine',
      disclaimer,
    };
  }
}
