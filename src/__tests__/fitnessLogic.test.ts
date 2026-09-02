import { describe, it, expect, beforeEach } from 'vitest';
import { FitnessService } from '../services/fitnessService';
import { SafeStorage, STORAGE_KEYS } from '../services/storage';
import type { DietPlan, WeightDataPoint } from '../types';

describe('FitSync P0 Hardening & Business Logic Tests', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Task 1: Hydration Business Logic & Edge Cases', () => {
    it('increments water intake from 0 to 1', () => {
      FitnessService.setWaterIntake(0);
      const updated = FitnessService.incrementWaterIntake();
      expect(updated.waterGlassesDrunk).toBe(1);
    });

    it('increments from target-1 to target', () => {
      const diet = FitnessService.getDietPlan();
      const target = diet.waterTargetGlasses; // 8
      FitnessService.setWaterIntake(target - 1); // 7

      const updated = FitnessService.incrementWaterIntake();
      expect(updated.waterGlassesDrunk).toBe(target);
    });

    it('remains at target when target is reached (does not silently reset to 0)', () => {
      const diet = FitnessService.getDietPlan();
      const target = diet.waterTargetGlasses; // 8
      FitnessService.setWaterIntake(target); // 8

      const updated = FitnessService.incrementWaterIntake();
      expect(updated.waterGlassesDrunk).toBe(target);
      expect(updated.waterGlassesDrunk).not.toBe(0);
    });

    it('remains stable on repeated clicks after reaching target', () => {
      const target = 8;
      FitnessService.setWaterIntake(target);

      // Simulate rapid user tapping past maximum
      FitnessService.incrementWaterIntake();
      FitnessService.incrementWaterIntake();
      const finalDiet = FitnessService.incrementWaterIntake();

      expect(finalDiet.waterGlassesDrunk).toBe(target);
    });

    it('handles custom hydration targets safely', () => {
      const customDiet: DietPlan = {
        ...FitnessService.getDietPlan(),
        waterTargetGlasses: 12,
        waterGlassesDrunk: 11,
      };
      FitnessService.saveDietPlan(customDiet);

      const updated = FitnessService.incrementWaterIntake();
      expect(updated.waterGlassesDrunk).toBe(12);

      const afterTarget = FitnessService.incrementWaterIntake();
      expect(afterTarget.waterGlassesDrunk).toBe(12);
    });
  });

  describe('Task 2: Hardened Date Handling & Weight History', () => {
    it('logs new weight with ISO timestamp and display label', () => {
      const history = FitnessService.logNewWeight(72.5, '2 Sep');
      const latest = history[history.length - 1];

      expect(latest.weightKg).toBe(72.5);
      expect(latest.date).toBe('2 Sep');
      expect(latest.recordedAt).toBeDefined();
      expect(new Date(latest.recordedAt!).getTime()).not.toBeNaN();
    });

    it('sorts chronological records across year boundaries and same-day entries', () => {
      const mockPoints: WeightDataPoint[] = [
        { id: '1', date: 'Dec 31', recordedAt: '2025-12-31T08:00:00.000Z', weightKg: 75.0 },
        { id: '2', date: 'Jan 01', recordedAt: '2026-01-01T08:00:00.000Z', weightKg: 74.8 },
        { id: '3', date: 'Jan 01', recordedAt: '2026-01-01T20:00:00.000Z', weightKg: 74.5 },
      ];

      SafeStorage.set(STORAGE_KEYS.WEIGHT_HISTORY, mockPoints);
      const sorted = FitnessService.getWeightHistory();

      expect(sorted[0].id).toBe('1');
      expect(sorted[1].id).toBe('2');
      expect(sorted[2].id).toBe('3');
    });

    it('safely handles legacy string dates without ISO timestamps', () => {
      const legacyData: WeightDataPoint[] = [
        { date: '15 May', weightKg: 74.0 },
        { date: '10 Jan', weightKg: 75.0 },
      ];

      SafeStorage.set(STORAGE_KEYS.WEIGHT_HISTORY, legacyData);
      const sorted = FitnessService.getWeightHistory();

      expect(sorted[0].date).toBe('10 Jan');
      expect(sorted[1].date).toBe('15 May');
    });

    it('gracefully recovers from invalid date strings without throwing errors', () => {
      const corruptData: WeightDataPoint[] = [
        { date: 'invalid-date-string-xyz', weightKg: 70.0 },
        { date: '2026-08-01', recordedAt: '2026-08-01T00:00:00.000Z', weightKg: 71.0 },
      ];

      SafeStorage.set(STORAGE_KEYS.WEIGHT_HISTORY, corruptData);
      expect(() => FitnessService.getWeightHistory()).not.toThrow();
      const history = FitnessService.getWeightHistory();
      expect(history.length).toBe(2);
    });
  });

  describe('Task 3: SafeStorage Resiliency', () => {
    it('returns fallback value if key contains malformed JSON', () => {
      localStorage.setItem('corrupt_key', '{ bad json ...');
      const result = SafeStorage.get('corrupt_key', { fallback: true });
      expect(result).toEqual({ fallback: true });
    });

    it('returns fallback value if key does not exist', () => {
      const result = SafeStorage.get('non_existent_key', 42);
      expect(result).toBe(42);
    });
  });

  describe('Task 4: Workout Session Recovery', () => {
    it('saves and retrieves active workout session', () => {
      const session = {
        workoutId: 'push-day-1',
        activeExerciseIdx: 2,
        startedAt: new Date().toISOString(),
        isModalOpen: true,
      };

      FitnessService.saveWorkoutSession(session);
      const restored = FitnessService.getWorkoutSession();

      expect(restored).not.toBeNull();
      expect(restored?.workoutId).toBe('push-day-1');
      expect(restored?.activeExerciseIdx).toBe(2);
    });

    it('discards stale sessions older than 24 hours', () => {
      const staleTimestamp = new Date(Date.now() - 25 * 60 * 60 * 1000).toISOString();
      const staleSession = {
        workoutId: 'stale-workout',
        activeExerciseIdx: 1,
        startedAt: staleTimestamp,
        isModalOpen: true,
      };

      FitnessService.saveWorkoutSession(staleSession);
      const restored = FitnessService.getWorkoutSession();
      expect(restored).toBeNull();
    });

    it('clears active workout session upon completion', () => {
      FitnessService.saveWorkoutSession({
        workoutId: 'w-1',
        activeExerciseIdx: 0,
        startedAt: new Date().toISOString(),
        isModalOpen: true,
      });

      FitnessService.clearWorkoutSession();
      expect(FitnessService.getWorkoutSession()).toBeNull();
    });
  });
});
