/**
 * FitSync Deterministic Nutrition Authority Engine
 * 
 * Standard: Mifflin-St Jeor Metabolic Equations & Clinical Macro Ratios
 * Inviolable Rule: AI NEVER calculates calorie deficits or authoritative macros;
 * the deterministic engine computes exact targets and validates all culinary outputs.
 */

import type { DietPlan, MealItem } from '../types';

export type FitnessGoal = 'Build Muscle' | 'Lose Fat' | 'Improve Fitness' | 'Strength' | 'Athletic';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extra_active';
export type DietaryPreference = 'High Protein' | 'Mediterranean' | 'Balanced' | 'Low Carb / Keto' | 'Vegetarian' | 'Vegan' | 'Indian Balanced';

export interface MetabolicMetrics {
  bmr: number;
  tdee: number;
  targetCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  fiberGrams: number;
  waterGlasses: number;
}

export interface DeterministicPlanParams {
  gender: 'Male' | 'Female' | 'Other';
  age: number;
  heightCm: number;
  weightKg: number;
  goal?: string;
  activityLevel?: ActivityLevel;
  preference?: DietaryPreference;
  allergies?: string[];
  mealCount?: number;
}

export class DeterministicNutritionEngine {
  /**
   * Calculates Basal Metabolic Rate (BMR) using Mifflin-St Jeor Equation.
   * Standard:
   * Men: (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) + 5
   * Women: (10 * weight in kg) + (6.25 * height in cm) - (5 * age in years) - 161
   */
  static calculateBMR(gender: 'Male' | 'Female' | 'Other', weightKg: number, heightCm: number, age: number): number {
    const safeWeight = Math.max(30, Math.min(250, weightKg));
    const safeHeight = Math.max(100, Math.min(250, heightCm));
    const safeAge = Math.max(14, Math.min(100, age));

    const base = (10 * safeWeight) + (6.25 * safeHeight) - (5 * safeAge);
    if (gender === 'Female') {
      return Math.round(base - 161);
    } else if (gender === 'Other') {
      return Math.round(base - 78);
    }
    return Math.round(base + 5);
  }

  /**
   * Calculates Total Daily Energy Expenditure (TDEE) based on activity multiplier.
   */
  static calculateTDEE(bmr: number, activity: ActivityLevel = 'moderate'): number {
    const multipliers: Record<ActivityLevel, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      very_active: 1.725,
      extra_active: 1.9,
    };
    const factor = multipliers[activity] || 1.55;
    return Math.round(bmr * factor);
  }

  /**
   * Calculates exact target calories and macro split with clinical safety floors.
   * Safety rules:
   * - Females: Calorie floor minimum 1,200 kcal/day.
   * - Males: Calorie floor minimum 1,500 kcal/day.
   * - Protein: 1.8g to 2.2g per kg bodyweight for hypertrophy/active goals.
   * - Fats: 20% - 30% of total calories (essential for hormonal balance).
   * - Carbs: Remaining energy budget.
   */
  static computeMacroTargets(
    gender: 'Male' | 'Female' | 'Other',
    age: number,
    heightCm: number,
    weightKg: number,
    goal: string = 'Build Muscle',
    activity: ActivityLevel = 'moderate'
  ): MetabolicMetrics {
    const bmr = this.calculateBMR(gender, weightKg, heightCm, age);
    const tdee = this.calculateTDEE(bmr, activity);

    let calorieAdjustment = 0;
    let proteinMultiplier = 1.8; // grams per kg

    const normalizedGoal = goal.toLowerCase();
    if (normalizedGoal.includes('muscle') || normalizedGoal.includes('bulk')) {
      calorieAdjustment = 350; // Calorie surplus
      proteinMultiplier = 2.2;
    } else if (normalizedGoal.includes('fat') || normalizedGoal.includes('lose') || normalizedGoal.includes('cut')) {
      calorieAdjustment = -450; // Moderate caloric deficit
      proteinMultiplier = 2.2; // High protein to preserve lean muscle in deficit
    } else if (normalizedGoal.includes('strength') || normalizedGoal.includes('power')) {
      calorieAdjustment = 200;
      proteinMultiplier = 2.0;
    } else if (normalizedGoal.includes('athletic')) {
      calorieAdjustment = 150;
      proteinMultiplier = 1.9;
    }

    let targetCalories = Math.round(tdee + calorieAdjustment);

    // Enforce Inviolable Safety Floors
    const minFloor = gender === 'Female' ? 1200 : 1500;
    if (targetCalories < minFloor) {
      targetCalories = minFloor;
    }

    // Macro grams calculations
    const proteinGrams = Math.round(weightKg * proteinMultiplier);
    const proteinCalories = proteinGrams * 4;

    // Fat: 25% of target calories (9 kcal/g)
    const fatCalories = Math.round(targetCalories * 0.25);
    const fatsGrams = Math.round(fatCalories / 9);

    // Carbs: Remainder calories (4 kcal/g)
    const remainingCalories = Math.max(200, targetCalories - (proteinCalories + fatCalories));
    const carbsGrams = Math.round(remainingCalories / 4);

    // Fiber: ~14g per 1,000 kcal
    const fiberGrams = Math.round((targetCalories / 1000) * 14);

    // Hydration: 35ml per kg bodyweight (converted to 250ml glasses)
    const waterGlasses = Math.max(8, Math.round((weightKg * 35) / 250));

    return {
      bmr,
      tdee,
      targetCalories,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      fiberGrams,
      waterGlasses,
    };
  }

  /**
   * Generates a 100% deterministic, macro-accurate meal plan locally.
   * Serves as immediate fallback if AI is offline, rate-limited, or fails validation.
   */
  static generateDeterministicMealPlan(params: DeterministicPlanParams): DietPlan {
    const metrics = this.computeMacroTargets(
      params.gender,
      params.age,
      params.heightCm,
      params.weightKg,
      params.goal || 'Build Muscle',
      params.activityLevel || 'moderate'
    );

    const mealCount = params.mealCount && params.mealCount >= 3 && params.mealCount <= 5 ? params.mealCount : 4;
    const pref = params.preference || 'High Protein';

    const mealTitlesByPref: Record<DietaryPreference, { b: string; l: string; s: string; d: string; descB: string; descL: string; descS: string; descD: string }> = {
      'High Protein': {
        b: 'Egg White & Whey Power Oats',
        l: 'Grilled Chicken Breast & Herb Quinoa',
        s: 'Greek Yogurt & Almond Crunch',
        d: 'Seared Salmon Fillet with Steamed Asparagus',
        descB: 'Rolled oats, 4 egg whites, 1 scoop whey isolate, and chia seeds.',
        descL: '200g chicken breast, quinoa, broccoli florets, and olive oil dressing.',
        descS: 'Non-fat Greek yogurt, raw almonds, and fresh blueberries.',
        descD: 'Wild Atlantic salmon, asparagus spears, and roasted sweet potato mash.',
      },
      'Mediterranean': {
        b: 'Greek Avocado & Feta Scramble',
        l: 'Lemon Herb Chicken & Mediterranean Bulgur',
        s: 'Walnut & Olive Hummus with Cucumbers',
        d: 'Baked Cod with Rosemary Roasted Vegetables',
        descB: 'Eggs scrambled with spinach, cherry tomatoes, and feta cheese.',
        descL: 'Marinated chicken breast, bulgur, kalamata olives, and olive oil.',
        descS: 'Crushed walnuts, hummus dip, and crisp cucumber slices.',
        descD: 'Pacific cod fillet baked with zucchini, bell peppers, and olive tapenade.',
      },
      'Balanced': {
        b: 'Classic Oatmeal & Scrambled Eggs',
        l: 'Turkey Breast Rice Bowl',
        s: 'Apple Slices with Peanut Butter',
        d: 'Lean Beef Stir-Fry with Jasmine Rice',
        descB: 'Oats with cinnamon, 3 whole eggs, and half a banana.',
        descL: 'Sliced turkey breast, brown rice, green beans, and avocado.',
        descS: 'Crisp green apple with 1 tbsp natural peanut butter.',
        descD: '90% lean ground beef, stir-fry vegetables, and jasmine rice.',
      },
      'Low Carb / Keto': {
        b: 'Avocado & Bacon Cheddar Omelet',
        l: 'Cobb Salad with Chicken & Blue Cheese',
        s: 'Roasted Macadamia Nuts & Celery Sticks',
        d: 'Ribeye Steak with Garlic Butter Mushrooms',
        descB: '3 pasture-raised eggs, bacon strips, avocado, and aged cheddar.',
        descL: 'Grilled chicken, mixed greens, hard-boiled eggs, and ranch dressing.',
        descS: 'High-fat macadamia nuts and celery with cream cheese.',
        descD: 'Grass-fed ribeye, sautéed mushrooms in butter, and creamed spinach.',
      },
      'Vegetarian': {
        b: 'Cottage Cheese & Berry Oatmeal Bowl',
        l: 'Paneer / Tofu Tikka & Quinoa Pilaf',
        s: 'Edamame & Roasted Pumpkin Seeds',
        d: 'Lentil Dal & Steamed Cauliflower Rice',
        descB: 'Low-fat paneer/cottage cheese, rolled oats, and fresh berries.',
        descL: 'Marinated cottage cheese or tofu, quinoa, and bell pepper stir-fry.',
        descS: 'Steamed salted edamame pods and pumpkin seed mix.',
        descD: 'High-protein yellow lentil soup, spinach, and brown rice.',
      },
      'Vegan': {
        b: 'Tofu Scramble with Sourdough & Chia Pudding',
        l: 'Tempeh & Chickpea Buddha Bowl',
        s: 'Plant Protein Shake with Almond Butter',
        d: 'Black Bean & Quinoa Protein Stew',
        descB: 'Spiced organic tofu, nutritional yeast, and chia seed pudding.',
        descL: 'Marinated tempeh cubes, roasted chickpeas, kale, and tahini drizzle.',
        descS: 'Pea/rice protein blend, unsweetened almond milk, and almond butter.',
        descD: 'Black beans, organic quinoa, roasted peppers, and avocado salsa.',
      },
      'Indian Balanced': {
        b: 'Moong Dal Chilla & Paneer Bhurji',
        l: 'Grilled Chicken / Soya Curry with Brown Rice',
        s: 'Roasted Chana & Makhana Trail Mix',
        d: 'Tandoori Fish / Paneer with Mixed Sprouts Salad',
        descB: 'Sprouted moong crepes filled with spiced grated paneer.',
        descL: 'Lean chicken or soya chunks curry, brown basmati rice, and cucumber raita.',
        descS: 'Spiced roasted chickpeas, fox nuts (makhana), and green tea.',
        descD: 'Tandoori marinated fish or paneer with tossed sprouts and lemon.',
      },
    };

    const selectedPref = mealTitlesByPref[pref] || mealTitlesByPref['High Protein'];

    // Ratio distribution: Breakfast 30%, Lunch 35%, Snack 15%, Dinner 20%
    const distributions = [
      { type: 'Breakfast' as const, time: '8:00 AM', factor: 0.30, title: selectedPref.b, desc: selectedPref.descB, img: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80' },
      { type: 'Lunch' as const, time: '1:00 PM', factor: 0.35, title: selectedPref.l, desc: selectedPref.descL, img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
      { type: 'Evening Snack' as const, time: '4:30 PM', factor: 0.15, title: selectedPref.s, desc: selectedPref.descS, img: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?auto=format&fit=crop&w=400&q=80' },
      { type: 'Dinner' as const, time: '8:00 PM', factor: 0.20, title: selectedPref.d, desc: selectedPref.descD, img: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=400&q=80' },
    ];

    const activeDistributions = mealCount === 3
      ? [
          { ...distributions[0], factor: 0.35 },
          { ...distributions[1], factor: 0.40 },
          { ...distributions[3], factor: 0.25 },
        ]
      : distributions;

    const meals: MealItem[] = activeDistributions.map((d, index) => ({
      id: `det_meal_${index + 1}_${Date.now()}`,
      type: d.type,
      time: d.time,
      title: d.title,
      description: d.desc,
      calories: Math.round(metrics.targetCalories * d.factor),
      proteinGrams: Math.round(metrics.proteinGrams * d.factor),
      carbsGrams: Math.round(metrics.carbsGrams * d.factor),
      fatsGrams: Math.round(metrics.fatsGrams * d.factor),
      imageUrl: d.img,
    }));

    return {
      title: `${pref} ${params.goal || 'Performance'} Blueprint`,
      goal: params.goal || 'Build Muscle',
      durationWeeks: 8,
      dailyCaloriesTarget: metrics.targetCalories,
      proteinTarget: metrics.proteinGrams,
      carbsTarget: metrics.carbsGrams,
      fatsTarget: metrics.fatsGrams,
      fiberTarget: metrics.fiberGrams,
      waterTargetGlasses: metrics.waterGlasses,
      waterGlassesDrunk: 0,
      meals,
    };
  }
}
