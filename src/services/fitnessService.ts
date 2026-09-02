import type {
  Workout,
  DietPlan,
  WeightDataPoint,
  BodyComposition,
  ProgressPhoto,
  Achievement,
  ActiveWorkoutSession,
} from '../types';
import {
  INITIAL_WORKOUT,
  INITIAL_DIET_PLAN,
  INITIAL_WEIGHT_HISTORY,
  INITIAL_BODY_COMPOSITION,
  INITIAL_PROGRESS_PHOTOS,
  INITIAL_ACHIEVEMENTS,
} from '../data/mockFitnessData';
import { SafeStorage, STORAGE_KEYS } from './storage';

export class FitnessService {
  static getWorkout(): Workout {
    return SafeStorage.get<Workout>(STORAGE_KEYS.ACTIVE_WORKOUT, INITIAL_WORKOUT);
  }

  static saveWorkout(workout: Workout): void {
    SafeStorage.set(STORAGE_KEYS.ACTIVE_WORKOUT, workout);
  }

  static toggleExerciseCompletion(exerciseId: string): Workout {
    const workout = this.getWorkout();
    const updatedExercises = workout.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const nextState = !ex.completed;
        const updatedSets = ex.sets.map((s) => ({ ...s, completed: nextState }));
        return { ...ex, completed: nextState, sets: updatedSets };
      }
      return ex;
    });

    const updatedWorkout = { ...workout, exercises: updatedExercises };
    this.saveWorkout(updatedWorkout);
    return updatedWorkout;
  }

  static toggleSetCompletion(exerciseId: string, setNumber: number): Workout {
    const workout = this.getWorkout();
    const updatedExercises = workout.exercises.map((ex) => {
      if (ex.id === exerciseId) {
        const updatedSets = ex.sets.map((s) =>
          s.setNumber === setNumber ? { ...s, completed: !s.completed } : s
        );
        const allCompleted = updatedSets.every((s) => s.completed);
        return { ...ex, sets: updatedSets, completed: allCompleted };
      }
      return ex;
    });

    const updatedWorkout = { ...workout, exercises: updatedExercises };
    this.saveWorkout(updatedWorkout);
    return updatedWorkout;
  }

  static getDietPlan(): DietPlan {
    return SafeStorage.get<DietPlan>(STORAGE_KEYS.ACTIVE_DIET, INITIAL_DIET_PLAN);
  }

  static saveDietPlan(diet: DietPlan): void {
    SafeStorage.set(STORAGE_KEYS.ACTIVE_DIET, diet);
  }

  /**
   * Safe Hydration Increment:
   * Increments glasses by 1 until target is reached.
   * Remains at target when already reached or exceeded (does not silently reset to 0).
   */
  static incrementWaterIntake(): DietPlan {
    const diet = this.getDietPlan();
    const current = typeof diet.waterGlassesDrunk === 'number' ? diet.waterGlassesDrunk : 0;
    const target = typeof diet.waterTargetGlasses === 'number' ? diet.waterTargetGlasses : 8;
    const next = current < target ? current + 1 : target;
    const updated = { ...diet, waterGlassesDrunk: next };
    this.saveDietPlan(updated);
    return updated;
  }

  static setWaterIntake(glasses: number): DietPlan {
    const diet = this.getDietPlan();
    const target = typeof diet.waterTargetGlasses === 'number' ? diet.waterTargetGlasses : 8;
    const updated = { ...diet, waterGlassesDrunk: Math.max(0, Math.min(target, glasses)) };
    this.saveDietPlan(updated);
    return updated;
  }

  /**
   * Parses legacy or ISO dates to comparable epoch milliseconds.
   * Handles "Aug 20", "2026-08-20T...", and invalid dates.
   */
  static parseDateToEpoch(item: WeightDataPoint, fallbackIndex: number = 0): number {
    if (!item) return fallbackIndex;

    if (item.recordedAt) {
      const parsed = Date.parse(item.recordedAt);
      if (!isNaN(parsed)) return parsed;
    }

    if (item.date) {
      const parsed = Date.parse(item.date);
      if (!isNaN(parsed)) return parsed;

      // Handle month name + day strings like "Aug 20"
      const currentYear = new Date().getFullYear();
      const withYear = Date.parse(`${item.date} ${currentYear}`);
      if (!isNaN(withYear)) return withYear;
    }

    return fallbackIndex;
  }

  /**
   * Returns normalized, chronologically sorted weight history.
   * Handles legacy strings, ISO timestamps, same-day records, and year boundaries.
   */
  static getWeightHistory(): WeightDataPoint[] {
    const raw = SafeStorage.get<WeightDataPoint[]>(STORAGE_KEYS.WEIGHT_HISTORY, INITIAL_WEIGHT_HISTORY);
    if (!Array.isArray(raw)) return INITIAL_WEIGHT_HISTORY;

    return [...raw].sort((a, b) => {
      const timeA = this.parseDateToEpoch(a);
      const timeB = this.parseDateToEpoch(b);
      return timeA - timeB;
    });
  }

  static logNewWeight(weightKg: number, dateLabel?: string): WeightDataPoint[] {
    const current = this.getWeightHistory();
    const now = new Date();
    
    // Auto-generate UI date label if not provided or format nicely
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const displayLabel = dateLabel && dateLabel.trim() !== ''
      ? dateLabel
      : `${months[now.getMonth()]} ${now.getDate()}`;

    const newPoint: WeightDataPoint = {
      id: `weight_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      recordedAt: now.toISOString(),
      date: displayLabel,
      weightKg: Math.round(weightKg * 10) / 10,
    };

    const updated = [...current, newPoint];
    SafeStorage.set(STORAGE_KEYS.WEIGHT_HISTORY, updated);
    return updated;
  }

  // Active Workout Session Recovery
  static getWorkoutSession(): ActiveWorkoutSession | null {
    const session = SafeStorage.get<ActiveWorkoutSession | null>(STORAGE_KEYS.WORKOUT_SESSION, null);
    if (!session || !session.workoutId) return null;

    // Discard stale sessions older than 24 hours
    const sessionStart = Date.parse(session.startedAt);
    if (!isNaN(sessionStart)) {
      const ageHours = (Date.now() - sessionStart) / (1000 * 60 * 60);
      if (ageHours > 24) {
        this.clearWorkoutSession();
        return null;
      }
    }

    return session;
  }

  static saveWorkoutSession(session: ActiveWorkoutSession): void {
    SafeStorage.set(STORAGE_KEYS.WORKOUT_SESSION, session);
  }

  static clearWorkoutSession(): void {
    SafeStorage.remove(STORAGE_KEYS.WORKOUT_SESSION);
  }

  static getBodyComposition(): BodyComposition {
    return INITIAL_BODY_COMPOSITION;
  }

  static getProgressPhotos(): ProgressPhoto[] {
    return INITIAL_PROGRESS_PHOTOS;
  }

  static getAchievements(): Achievement[] {
    return INITIAL_ACHIEVEMENTS;
  }
}
