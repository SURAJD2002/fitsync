import { describe, it, expect, beforeEach } from 'vitest';
import { FitnessService } from '../services/fitnessService';

describe('Fitness Service Operations', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('fetches initial workout data correctly', () => {
    const workout = FitnessService.getWorkout();
    expect(workout.title).toBe('Push Day');
    expect(workout.exercises.length).toBe(6);
  });

  it('toggles exercise completion state', () => {
    const initial = FitnessService.getWorkout();
    const exId = initial.exercises[2].id; // Cable Fly
    expect(initial.exercises[2].completed).toBe(false);

    const updated = FitnessService.toggleExerciseCompletion(exId);
    const targetEx = updated.exercises.find((e) => e.id === exId);
    expect(targetEx?.completed).toBe(true);
  });

  it('increments water intake correctly', () => {
    const initialDiet = FitnessService.getDietPlan();
    expect(initialDiet.waterGlassesDrunk).toBe(6);

    const updatedDiet = FitnessService.incrementWaterIntake();
    expect(updatedDiet.waterGlassesDrunk).toBe(7);
  });

  it('logs weight entry accurately', () => {
    const history = FitnessService.logNewWeight(71.8, '5 Jun');
    expect(history.length).toBeGreaterThan(5);
    expect(history[history.length - 1].weightKg).toBe(71.8);
  });
});
