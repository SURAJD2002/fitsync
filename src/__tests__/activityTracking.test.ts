import { describe, it, expect, beforeEach } from 'vitest';
import { ActivityTrackingService, activityTrackingService } from '../services/activityTrackingService';
import { SafeStorage } from '../services/storage';

describe('ActivityTrackingService — Hardware Step Counter & Baseline Logic', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('1. Baseline Math & Step Subtraction', () => {
    it('initializes baseline on first sensor reading without registering fake steps', () => {
      const result = ActivityTrackingService.computeDaySteps(15420, -1);
      expect(result.todaySteps).toBe(0);
      expect(result.newBaseline).toBe(15420);
    });

    it('calculates accurate today steps after user walks', () => {
      const baseline = 15420;
      const currentReading = 17850; // walked 2430 steps
      const result = ActivityTrackingService.computeDaySteps(currentReading, baseline);
      expect(result.todaySteps).toBe(2430);
      expect(result.newBaseline).toBe(15420);
    });

    it('handles negative or invalid sensor values safely without throwing', () => {
      const result = ActivityTrackingService.computeDaySteps(-50, 1000);
      expect(result.todaySteps).toBe(0);
      expect(result.newBaseline).toBe(0);
    });
  });

  describe('2. Device Reboot & Sensor Counter Reset Protection', () => {
    it('detects device reboot (rawSteps < baseline) and prevents negative step corruption', () => {
      const previousBaseline = 45000;
      const postRebootSensorValue = 350; // phone rebooted, counter started from 0

      const result = ActivityTrackingService.computeDaySteps(postRebootSensorValue, previousBaseline);
      expect(result.todaySteps).toBe(350);
      expect(result.todaySteps).toBeGreaterThanOrEqual(0);
      expect(result.newBaseline).toBe(0);
    });
  });

  describe('3. Derived Metric Estimators (Distance, Active Minutes, Calories)', () => {
    it('computes defensible distance based on 76.2cm average stride length', () => {
      const metrics = ActivityTrackingService.computeDerivedMetrics(10000);
      expect(metrics.distanceKm).toBe(7.62);
    });

    it('computes active minutes based on standard walking cadence', () => {
      const metrics = ActivityTrackingService.computeDerivedMetrics(5400);
      expect(metrics.activeMinutes).toBe(54);
    });

    it('computes walking calorie burn based on standard metabolic equivalent', () => {
      const metrics = ActivityTrackingService.computeDerivedMetrics(8000);
      expect(metrics.caloriesBurned).toBe(320); // 8000 * 0.04
    });
  });

  describe('4. Event Processing & Deduplication', () => {
    it('processes sensor events and updates state in SafeStorage', () => {
      activityTrackingService.processSensorEvent({
        rawSteps: 5000,
        timestamp: Date.now(),
      });

      // User walks 300 steps
      activityTrackingService.processSensorEvent({
        rawSteps: 5300,
        timestamp: Date.now() + 1000,
      });

      const state = activityTrackingService.getState();
      expect(state.todaySteps).toBe(300);
      expect(state.distanceKm).toBe(0.23);
      expect(state.activeMinutes).toBe(3);
      expect(state.caloriesBurned).toBe(12);

      // Verify stored in SafeStorage
      const saved = SafeStorage.get<any>('fitsync_activity_tracking_state', null);
      expect(saved).not.toBeNull();
      expect(saved.todaySteps).toBe(300);
    });

    it('ignores duplicate sensor callbacks with identical step values', () => {
      activityTrackingService.processSensorEvent({
        rawSteps: 6000,
        timestamp: 100,
      });

      const stateBefore = activityTrackingService.getState();

      // Duplicate event
      activityTrackingService.processSensorEvent({
        rawSteps: 6000,
        timestamp: 200,
      });

      const stateAfter = activityTrackingService.getState();
      expect(stateAfter.todaySteps).toBe(stateBefore.todaySteps);
      expect(stateAfter.lastRawSteps).toBe(stateBefore.lastRawSteps);
    });
  });
});
