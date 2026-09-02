import type {
  Workout,
  DietPlan,
  WeightDataPoint,
  BodyComposition,
  ProgressPhoto,
  Achievement,
} from '../types';
import {
  INITIAL_WORKOUT,
  INITIAL_DIET_PLAN,
  INITIAL_WEIGHT_HISTORY,
  INITIAL_BODY_COMPOSITION,
  INITIAL_PROGRESS_PHOTOS,
  INITIAL_ACHIEVEMENTS,
} from '../data/mockFitnessData';

const WORKOUT_STORAGE_KEY = 'fitsync_active_workout';
const DIET_STORAGE_KEY = 'fitsync_active_diet';
const WEIGHT_STORAGE_KEY = 'fitsync_weight_history';

export class FitnessService {
  static getWorkout(): Workout {
    const saved = localStorage.getItem(WORKOUT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WORKOUT;
      }
    }
    return INITIAL_WORKOUT;
  }

  static saveWorkout(workout: Workout): void {
    localStorage.setItem(WORKOUT_STORAGE_KEY, JSON.stringify(workout));
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
    const saved = localStorage.getItem(DIET_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_DIET_PLAN;
      }
    }
    return INITIAL_DIET_PLAN;
  }

  static saveDietPlan(diet: DietPlan): void {
    localStorage.setItem(DIET_STORAGE_KEY, JSON.stringify(diet));
  }

  static incrementWaterIntake(): DietPlan {
    const diet = this.getDietPlan();
    const current = diet.waterGlassesDrunk || 0;
    const next = current < diet.waterTargetGlasses ? current + 1 : 0;
    const updated = { ...diet, waterGlassesDrunk: next };
    this.saveDietPlan(updated);
    return updated;
  }

  static setWaterIntake(glasses: number): DietPlan {
    const diet = this.getDietPlan();
    const updated = { ...diet, waterGlassesDrunk: Math.max(0, Math.min(diet.waterTargetGlasses, glasses)) };
    this.saveDietPlan(updated);
    return updated;
  }

  static getWeightHistory(): WeightDataPoint[] {
    const saved = localStorage.getItem(WEIGHT_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_WEIGHT_HISTORY;
      }
    }
    return INITIAL_WEIGHT_HISTORY;
  }

  static logNewWeight(weightKg: number, dateLabel: string): WeightDataPoint[] {
    const current = this.getWeightHistory();
    const updated = [...current, { date: dateLabel, weightKg }];
    localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(updated));
    return updated;
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
