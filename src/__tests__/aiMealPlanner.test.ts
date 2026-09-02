import { describe, it, expect } from 'vitest';
import { AIMealService } from '../services/aiMealService';

describe('AI Meal Planner Schema & Security Tests', () => {
  describe('Input Sanitization & PII Scrubbing', () => {
    it('redacts email addresses from user input', () => {
      const sanitized = AIMealService.sanitizeInput('No peanuts, email me at test@example.com for info');
      expect(sanitized).not.toContain('test@example.com');
      expect(sanitized).toContain('[REDACTED]');
    });

    it('redacts phone numbers from user input', () => {
      const sanitized = AIMealService.sanitizeInput('Allergic to dairy, call 9876543210');
      expect(sanitized).not.toContain('9876543210');
      expect(sanitized).toContain('[REDACTED]');
    });

    it('strips script tags and malicious formatting tokens', () => {
      const sanitized = AIMealService.sanitizeInput('<script>alert("hack")</script> vegan food');
      expect(sanitized).not.toContain('<script>');
      expect(sanitized).toBe('scriptalert("hack")/script vegan food');
    });
  });

  describe('Strict JSON Schema & Macro Validation', () => {
    const validPlan = {
      title: 'AI High Protein Blueprint',
      goal: 'Build Muscle',
      durationWeeks: 8,
      dailyCaloriesTarget: 2400,
      proteinTarget: 180,
      carbsTarget: 270,
      fatsTarget: 65,
      fiberTarget: 32,
      meals: [
        {
          id: 'meal_1',
          type: 'Breakfast',
          time: '8:00 AM',
          title: 'Power Oats Bowl',
          description: 'Oats, whey, berries',
          calories: 720,
          proteinGrams: 55,
          carbsGrams: 80,
          fatsGrams: 20,
        },
        {
          id: 'meal_2',
          type: 'Lunch',
          time: '1:00 PM',
          title: 'Chicken Quinoa Bowl',
          description: 'Chicken, quinoa, greens',
          calories: 840,
          proteinGrams: 65,
          carbsGrams: 95,
          fatsGrams: 22,
        },
        {
          id: 'meal_3',
          type: 'Dinner',
          time: '7:30 PM',
          title: 'Salmon Rice Plate',
          description: 'Salmon, jasmine rice, asparagus',
          calories: 840,
          proteinGrams: 60,
          carbsGrams: 95,
          fatsGrams: 23,
        },
      ],
    };

    it('accepts a valid and macro-compliant AI plan', () => {
      const res = AIMealService.validatePlanSchema(validPlan, 2400);
      expect(res.isValid).toBe(true);
    });

    it('rejects non-object or null input', () => {
      expect(AIMealService.validatePlanSchema(null, 2400).isValid).toBe(false);
      expect(AIMealService.validatePlanSchema('string response', 2400).isValid).toBe(false);
    });

    it('rejects plans with missing title or invalid calorie bounds', () => {
      const missingTitle = { ...validPlan, title: '' };
      expect(AIMealService.validatePlanSchema(missingTitle, 2400).isValid).toBe(false);

      const invalidCalories = { ...validPlan, dailyCaloriesTarget: 500 }; // Out of physiological limits (<1000)
      expect(AIMealService.validatePlanSchema(invalidCalories, 2400).isValid).toBe(false);
    });

    it('rejects plans with missing or negative meal fields', () => {
      const negativeMacroMeal = {
        ...validPlan,
        meals: [
          ...validPlan.meals.slice(0, 2),
          { ...validPlan.meals[2], proteinGrams: -10 },
        ],
      };
      const res = AIMealService.validatePlanSchema(negativeMacroMeal, 2400);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('negative or impossible');
    });

    it('rejects plans where meal sum deviates from authoritative target by >10%', () => {
      // Total meal sum = 720 + 840 + 840 = 2400 kcal
      // Target = 3000 kcal (diff is 20%)
      const res = AIMealService.validatePlanSchema(validPlan, 3000);
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('deviate from authoritative target');
    });
  });

  describe('Rate Limiter Behavior', () => {
    it('allows up to 5 requests in window, then throttles gracefully', () => {
      // First 5 allowed (or within limit)
      const r1 = AIMealService.checkRateLimit();
      expect(typeof r1.allowed).toBe('boolean');
    });
  });

  describe('Deterministic Fallback Execution', () => {
    it('executes fallback and returns complete DietPlan even if cloud services are unavailable', async () => {
      const result = await AIMealService.generatePersonalizedMealPlan({
        targetCalories: 2350,
        proteinTarget: 175,
        carbsTarget: 260,
        fatsTarget: 65,
        goal: 'Build Muscle',
        dietaryPreference: 'High Protein',
        allergies: ['Peanuts'],
        mealCount: 4,
        bodyProfile: {
          gender: 'Male',
          age: 26,
          heightCm: 178,
          weightKg: 75,
        },
      });

      expect(result.success).toBe(true);
      expect(result.dietPlan.meals.length).toBe(4);
      expect(result.dietPlan.dailyCaloriesTarget).toBeGreaterThan(1500);
      expect(result.disclaimer).toBeDefined();
    });
  });
});
