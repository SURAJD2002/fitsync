export type AuthMode = 'login' | 'signup' | 'onboarding' | 'app';

export interface User {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  avatarUrl: string;
  isPremium: boolean;
  memberSince: string;
  streakDays: number;
  completedWorkoutsCount: number;
  goalProgressPercent: number;
  achievementsCount: number;
}

export type BodyType = 'ectomorph' | 'mesomorph' | 'endomorph' | 'custom';
export type UnitSystem = 'cm' | 'in';

export interface BodyMeasurements {
  chest: number;
  waist: number;
  hips: number;
  arms: number;
  thighs: number;
}

export interface BodyProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  height: number; // in cm
  weight: number; // in kg
  bodyType: BodyType;
  unit: UnitSystem;
  measurements: BodyMeasurements;
  photos: {
    front?: string;
    side?: string;
    back?: string;
  };
}

export interface ExerciseSet {
  setNumber: number;
  repsMin: number;
  repsMax: number;
  weightKg: number;
  completed: boolean;
}

export interface Exercise {
  id: string;
  stepNumber: number;
  name: string;
  category: 'Chest' | 'Shoulders' | 'Triceps' | 'Back' | 'Biceps' | 'Legs' | 'Core';
  targetSets: number;
  repsRange: string;
  suggestedWeightKg: number;
  imageUrl: string;
  completed: boolean;
  sets: ExerciseSet[];
}

export interface Workout {
  id: string;
  title: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  durationMins: number;
  targetCalories: number;
  focusAreas: string[];
  exercises: Exercise[];
}

export interface MealItem {
  id: string;
  type: 'Breakfast' | 'Mid-Morning' | 'Lunch' | 'Evening Snack' | 'Dinner' | 'Night Snack';
  time: string;
  title: string;
  description: string;
  calories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  imageUrl: string;
}

export interface DietPlan {
  title: string;
  goal: string;
  durationWeeks: number;
  dailyCaloriesTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  fiberTarget: number;
  waterTargetGlasses: number;
  waterGlassesDrunk: number;
  meals: MealItem[];
}

export interface ProgressPhoto {
  id: string;
  date: string;
  imageUrl: string;
  label: string;
  isLatest?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  subtitle: string;
  iconType: 'workouts' | 'streak' | 'weight' | 'strength' | 'consistency';
  unlocked: boolean;
}

export interface BodyComposition {
  bodyFatPercent: number;
  bodyFatChange: number;
  muscleMassKg: number;
  muscleMassChange: number;
  waterPercent: number;
  waterChange: number;
  boneMassKg: number;
  boneMassChange: number;
  bmi: number;
  bmiCategory: string;
  chestCm: number;
  chestChangeCm: number;
  waistCm: number;
  waistChangeCm: number;
}

export interface WeightDataPoint {
  id?: string;
  recordedAt?: string; // ISO-8601 string
  date: string; // Formatted date label for backward compatibility
  weightKg: number;
}

export interface ActiveWorkoutSession {
  workoutId: string;
  activeExerciseIdx: number;
  startedAt: string; // ISO-8601 timestamp
  isModalOpen: boolean;
}

