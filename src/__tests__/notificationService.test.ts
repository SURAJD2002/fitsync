import { describe, it, expect, beforeEach, vi } from 'vitest';
import { notificationService } from '../services/notificationService';
import { SafeStorage } from '../services/storage';

describe('NotificationService — Smart Rules, Channels & Deduplication Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    // Reset preferences to default
    notificationService.updatePreferences({
      masterEnabled: true,
      workoutReminders: true,
      hydrationReminders: true,
      mealReminders: true,
      activityMilestones: true,
      progressReminders: true,
    });
  });

  describe('1. Preference Gating & Master Suppression', () => {
    it('persists preferences safely in SafeStorage', () => {
      notificationService.updatePreferences({ workoutReminders: false });
      const prefs = notificationService.getPreferences();
      expect(prefs.workoutReminders).toBe(false);
      expect(prefs.masterEnabled).toBe(true);

      const saved = SafeStorage.get<any>('fitsync_notification_preferences', null);
      expect(saved.workoutReminders).toBe(false);
    });

    it('suppresses all notifications when masterEnabled is false', async () => {
      notificationService.updatePreferences({ masterEnabled: false });

      const scheduled = await notificationService.scheduleNotification({
        id: 101,
        title: 'Test',
        body: 'Test body',
        channelId: 'fitsync_reminders',
      });

      expect(scheduled).toBe(false);
    });

    it('suppresses category notifications when category is disabled', async () => {
      notificationService.updatePreferences({ hydrationReminders: false });

      const scheduled = await notificationService.scheduleNotification({
        id: 102,
        title: 'Drink Water',
        body: 'Hydrate now',
        channelId: 'fitsync_hydration',
      });

      expect(scheduled).toBe(false);
    });
  });

  describe('2. Deduplication Matrix', () => {
    it('records fired notifications and prevents duplicate dispatch on same day', () => {
      const dedupKey = 'test_daily_nudge';
      expect(notificationService.hasNotifiedToday(dedupKey)).toBe(false);

      notificationService.recordNotificationFired(dedupKey);
      expect(notificationService.hasNotifiedToday(dedupKey)).toBe(true);
    });
  });

  describe('3. Step Milestone Rule (5k & 10k steps)', () => {
    it('does not fire milestone when steps are below 5,000', async () => {
      const scheduleSpy = vi.spyOn(notificationService, 'scheduleNotification');
      await notificationService.checkStepMilestones(4850);
      expect(scheduleSpy).not.toHaveBeenCalled();
      scheduleSpy.mockRestore();
    });

    it('fires 5,000 step milestone and suppresses on subsequent step increments', async () => {
      const scheduleSpy = vi.spyOn(notificationService, 'scheduleNotification');

      // User hits 5,000
      await notificationService.checkStepMilestones(5020);
      expect(scheduleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'fitsync_activity',
          dedupKey: 'milestone_5k',
        })
      );

      // User walks to 5,100 on same day -> Suppressed by dedup
      scheduleSpy.mockClear();
      await notificationService.checkStepMilestones(5100);
      expect(scheduleSpy).not.toHaveBeenCalled();

      scheduleSpy.mockRestore();
    });

    it('fires 10,000 step milestone when daily goal is reached', async () => {
      const scheduleSpy = vi.spyOn(notificationService, 'scheduleNotification');

      await notificationService.checkStepMilestones(10050);
      expect(scheduleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'fitsync_activity',
          dedupKey: 'milestone_10k',
        })
      );

      scheduleSpy.mockRestore();
    });
  });

  describe('4. Workout & Hydration Completion Suppression Rules', () => {
    it('suppresses workout reminder if user has already completed today’s workout', async () => {
      const scheduleSpy = vi.spyOn(notificationService, 'scheduleNotification');

      // Workout completed -> should suppress
      await notificationService.checkWorkoutReminder(true, 'Chest & Triceps');
      expect(scheduleSpy).not.toHaveBeenCalled();

      // Workout pending -> should trigger reminder
      await notificationService.checkWorkoutReminder(false, 'Chest & Triceps');
      expect(scheduleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'fitsync_reminders',
          dedupKey: 'workout_daily_reminder',
        })
      );

      scheduleSpy.mockRestore();
    });

    it('suppresses hydration reminder if user has reached or exceeded daily water target', async () => {
      const scheduleSpy = vi.spyOn(notificationService, 'scheduleNotification');

      // Target 8 glasses, drank 8 -> Goal met, suppress
      await notificationService.checkHydrationReminder(8, 8);
      expect(scheduleSpy).not.toHaveBeenCalled();

      // Target 8 glasses, drank 4 -> Behind target, schedule nudge
      await notificationService.checkHydrationReminder(4, 8);
      expect(scheduleSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          channelId: 'fitsync_hydration',
          dedupKey: 'hydration_midday_nudge',
        })
      );

      scheduleSpy.mockRestore();
    });
  });
});
