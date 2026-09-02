import { describe, it, expect } from 'vitest';
import { DeterministicNutritionEngine } from '../services/deterministicNutrition';

describe('Deterministic Nutrition Authority Engine Tests', () => {
  describe('Mifflin-St Jeor BMR Calculation', () => {
    it('accurately calculates BMR for male athlete (72kg, 175cm, 25yo)', () => {
      // Men: (10 * 72) + (6.25 * 175) - (5 * 25) + 5
      // = 720 + 1093.75 - 125 + 5 = 1693.75 -> 1694
      const bmr = DeterministicNutritionEngine.calculateBMR('Male', 72, 175, 25);
      expect(bmr).toBe(1694);
    });

    it('accurately calculates BMR for female athlete (60kg, 165cm, 28yo)', () => {
      // Women: (10 * 60) + (6.25 * 165) - (5 * 28) - 161
      // = 600 + 1031.25 - 140 - 161 = 1330.25 -> 1330
      const bmr = DeterministicNutritionEngine.calculateBMR('Female', 60, 165, 28);
      expect(bmr).toBe(1330);
    });

    it('clamps outlier values safely within physiological limits', () => {
      const bmrMin = DeterministicNutritionEngine.calculateBMR('Male', 10, 50, 5); // Clamped to 30kg, 100cm, 14yo
      expect(bmrMin).toBeGreaterThan(500);

      const bmrMax = DeterministicNutritionEngine.calculateBMR('Male', 400, 300, 120); // Clamped to 250kg, 250cm, 100yo
      expect(bmrMax).toBeLessThan(5000);
    });
  });

  describe('TDEE & Macro Energy Budget', () => {
    it('applies standard activity multipliers correctly', () => {
      const bmr = 1500;
      expect(DeterministicNutritionEngine.calculateTDEE(bmr, 'sedentary')).toBe(1800);
      expect(DeterministicNutritionEngine.calculateTDEE(bmr, 'moderate')).toBe(2325);
      expect(DeterministicNutritionEngine.calculateTDEE(bmr, 'very_active')).toBe(2588);
    });

    it('enforces inviolable calorie floor of 1200 kcal for female deficit targets', () => {
      // Very small female in severe deficit
      const targets = DeterministicNutritionEngine.computeMacroTargets('Female', 45, 145, 42, 'Lose Fat', 'sedentary');
      expect(targets.targetCalories).toBeGreaterThanOrEqual(1200);
    });

    it('enforces inviolable calorie floor of 1500 kcal for male deficit targets', () => {
      // Male in deficit
      const targets = DeterministicNutritionEngine.computeMacroTargets('Male', 50, 160, 50, 'Lose Fat', 'sedentary');
      expect(targets.targetCalories).toBeGreaterThanOrEqual(1500);
    });

    it('assigns high protein (2.2g/kg) for muscle building goals', () => {
      const weight = 80;
      const targets = DeterministicNutritionEngine.computeMacroTargets('Male', 25, 180, weight, 'Build Muscle', 'moderate');
      expect(targets.proteinGrams).toBe(176); // 80 * 2.2 = 176
    });

    it('calculates proportional hydration targets (35ml/kg converted to glasses)', () => {
      const targets = DeterministicNutritionEngine.computeMacroTargets('Male', 25, 180, 80, 'Build Muscle');
      // 80kg * 35ml = 2800ml / 250ml = 11.2 -> 11 glasses
      expect(targets.waterGlasses).toBe(11);
    });
  });

  describe('Deterministic Plan Generation & Offline Guarantee', () => {
    it('generates a complete valid DietPlan locally across preferences', () => {
      const preferences = ['High Protein', 'Mediterranean', 'Balanced', 'Low Carb / Keto', 'Vegetarian', 'Vegan', 'Indian Balanced'] as const;

      preferences.forEach((pref) => {
        const plan = DeterministicNutritionEngine.generateDeterministicMealPlan({
          gender: 'Male',
          age: 26,
          heightCm: 178,
          weightKg: 75,
          goal: 'Build Muscle',
          preference: pref,
          mealCount: 4,
        });

        expect(plan.dailyCaloriesTarget).toBeGreaterThan(1500);
        expect(plan.proteinTarget).toBeGreaterThan(100);
        expect(plan.meals.length).toBe(4);

        // Sum of meal calories must match dailyCaloriesTarget within 5%
        const totalMealCal = plan.meals.reduce((sum, m) => sum + m.calories, 0);
        const diff = Math.abs(totalMealCal - plan.dailyCaloriesTarget);
        expect(diff).toBeLessThanOrEqual(plan.dailyCaloriesTarget * 0.05);
      });
    });
  });
});
