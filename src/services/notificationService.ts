import { LocalNotifications, type Channel, type LocalNotificationSchema } from '@capacitor/local-notifications';
import { Capacitor } from '@capacitor/core';
import { SafeStorage } from './storage';

export interface NotificationPreferences {
  masterEnabled: boolean;
  workoutReminders: boolean;
  hydrationReminders: boolean;
  mealReminders: boolean;
  activityMilestones: boolean;
  progressReminders: boolean;
}

const PREFERENCES_KEY = 'fitsync_notification_preferences';
const DEDUP_KEY = 'fitsync_notification_dedup_log';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  masterEnabled: true,
  workoutReminders: true,
  hydrationReminders: true,
  mealReminders: true,
  activityMilestones: true,
  progressReminders: true,
};

const CHANNELS: Channel[] = [
  {
    id: 'fitsync_reminders',
    name: 'Workout Reminders',
    description: 'Daily training and workout routine alerts',
    importance: 4, // High
    visibility: 1, // Public
    sound: 'default',
    vibration: true,
  },
  {
    id: 'fitsync_hydration',
    name: 'Hydration Station',
    description: 'Intelligent daily water intake reminders',
    importance: 3, // Default
    visibility: 1,
    sound: 'default',
    vibration: false,
  },
  {
    id: 'fitsync_nutrition',
    name: 'Nutrition & Meals',
    description: 'Scheduled meal and nutritional guidance alerts',
    importance: 3,
    visibility: 1,
    sound: 'default',
    vibration: false,
  },
  {
    id: 'fitsync_activity',
    name: 'Activity Milestones',
    description: 'Daily step count and distance achievements',
    importance: 4,
    visibility: 1,
    sound: 'default',
    vibration: true,
  },
];

const getTodayDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export class NotificationService {
  private static instance: NotificationService;
  private preferences: NotificationPreferences;
  private dedupLog: Record<string, number>;
  private isInitialized = false;
  private onDeepLinkCallback?: (screen: string) => void;

  private constructor() {
    this.preferences = SafeStorage.get<NotificationPreferences>(PREFERENCES_KEY, DEFAULT_PREFERENCES);
    this.dedupLog = SafeStorage.get<Record<string, number>>(DEDUP_KEY, {});
  }

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    if (Capacitor.isNativePlatform()) {
      try {
        // Register Android Notification Channels
        for (const channel of CHANNELS) {
          await LocalNotifications.createChannel(channel);
        }

        // Register Deep Link action listener
        await LocalNotifications.addListener('localNotificationActionPerformed', (action) => {
          const extra = action.notification.extra;
          if (extra && extra.screen && this.onDeepLinkCallback) {
            this.onDeepLinkCallback(extra.screen);
          }
        });
      } catch (err) {
        console.warn('[NotificationService] Native initialization note:', err);
      }
    }

    this.isInitialized = true;
  }

  public registerDeepLinkHandler(callback: (screen: string) => void): () => void {
    this.onDeepLinkCallback = callback;
    return () => {
      this.onDeepLinkCallback = undefined;
    };
  }

  public getPreferences(): NotificationPreferences {
    return { ...this.preferences };
  }

  public updatePreferences(partial: Partial<NotificationPreferences>): NotificationPreferences {
    this.preferences = { ...this.preferences, ...partial };
    SafeStorage.set(PREFERENCES_KEY, this.preferences);

    if (!this.preferences.masterEnabled) {
      this.cancelAllScheduled();
    }
    return this.getPreferences();
  }

  public async checkPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const status = await LocalNotifications.checkPermissions();
      return status.display === 'granted';
    } catch {
      return false;
    }
  }

  public async requestPermission(): Promise<boolean> {
    if (!Capacitor.isNativePlatform()) return true;
    try {
      const status = await LocalNotifications.requestPermissions();
      return status.display === 'granted';
    } catch {
      return false;
    }
  }

  /**
   * Evaluates if a notification key has already been dispatched today.
   */
  public hasNotifiedToday(keyPrefix: string): boolean {
    const today = getTodayDateString();
    const fullKey = `${keyPrefix}_${today}`;
    return !!this.dedupLog[fullKey];
  }

  public recordNotificationFired(keyPrefix: string): void {
    const today = getTodayDateString();
    const fullKey = `${keyPrefix}_${today}`;
    this.dedupLog[fullKey] = Date.now();
    SafeStorage.set(DEDUP_KEY, this.dedupLog);
  }

  public async scheduleNotification(options: {
    id: number;
    title: string;
    body: string;
    channelId: string;
    dedupKey?: string;
    screen?: string;
    scheduleAt?: Date;
  }): Promise<boolean> {
    if (!this.preferences.masterEnabled) return false;

    // Check Category-level preferences
    if (options.channelId === 'fitsync_reminders' && !this.preferences.workoutReminders) return false;
    if (options.channelId === 'fitsync_hydration' && !this.preferences.hydrationReminders) return false;
    if (options.channelId === 'fitsync_nutrition' && !this.preferences.mealReminders) return false;
    if (options.channelId === 'fitsync_activity' && !this.preferences.activityMilestones) return false;

    // Deduplication check
    if (options.dedupKey && this.hasNotifiedToday(options.dedupKey)) {
      return false;
    }

    const hasPermission = await this.checkPermission();
    if (!hasPermission) return false;

    const notification: LocalNotificationSchema = {
      id: options.id,
      title: options.title,
      body: options.body,
      channelId: options.channelId,
      extra: {
        screen: options.screen || 'home',
      },
    };

    if (options.scheduleAt) {
      notification.schedule = {
        at: options.scheduleAt,
        allowWhileIdle: true,
      };
    }

    try {
      if (Capacitor.isNativePlatform()) {
        await LocalNotifications.schedule({ notifications: [notification] });
      } else {
        // Browser fallback / development console logging
        console.log(`[NotificationSimulated] [Channel: ${options.channelId}] ${options.title} — ${options.body}`);
      }

      if (options.dedupKey) {
        this.recordNotificationFired(options.dedupKey);
      }

      return true;
    } catch (err) {
      console.warn('[NotificationService] Schedule error:', err);
      return false;
    }
  }

  /**
   * Milestone Rule: 5k & 10k Hardware Step Milestones
   */
  public async checkStepMilestones(currentSteps: number): Promise<void> {
    if (!this.preferences.masterEnabled || !this.preferences.activityMilestones) return;

    if (currentSteps >= 10000 && !this.hasNotifiedToday('milestone_10k')) {
      await this.scheduleNotification({
        id: 10002,
        title: '🔥 10,000 Steps Goal Reached!',
        body: 'Incredible momentum! You have completed today’s daily step target.',
        channelId: 'fitsync_activity',
        dedupKey: 'milestone_10k',
        screen: 'progress',
      });
    } else if (currentSteps >= 5000 && !this.hasNotifiedToday('milestone_5k')) {
      await this.scheduleNotification({
        id: 10001,
        title: '🚶 5,000 Steps Milestone!',
        body: 'Halfway to your daily 10k target. Keep the energy moving!',
        channelId: 'fitsync_activity',
        dedupKey: 'milestone_5k',
        screen: 'progress',
      });
    }
  }

  /**
   * Workout Rule: Nudge user if workout is pending today
   */
  public async checkWorkoutReminder(isWorkoutCompleted: boolean, workoutTitle: string): Promise<void> {
    if (!this.preferences.masterEnabled || !this.preferences.workoutReminders) return;

    // Suppress if already finished
    if (isWorkoutCompleted) return;

    if (!this.hasNotifiedToday('workout_daily_reminder')) {
      await this.scheduleNotification({
        id: 20001,
        title: '⚡ Ready for Today’s Training?',
        body: `Your ${workoutTitle} session is waiting. Crush your sets today!`,
        channelId: 'fitsync_reminders',
        dedupKey: 'workout_daily_reminder',
        screen: 'workout',
      });
    }
  }

  /**
   * Hydration Rule: Nudge user if water intake is behind target
   */
  public async checkHydrationReminder(glassesDrunk: number, targetGlasses: number): Promise<void> {
    if (!this.preferences.masterEnabled || !this.preferences.hydrationReminders) return;

    // Suppress if target met
    if (glassesDrunk >= targetGlasses) return;

    const remaining = targetGlasses - glassesDrunk;
    if (!this.hasNotifiedToday('hydration_midday_nudge')) {
      await this.scheduleNotification({
        id: 30001,
        title: '💧 Hydration Check-In',
        body: `You are ${remaining} glasses away from your daily goal. Drink a fresh glass of water now.`,
        channelId: 'fitsync_hydration',
        dedupKey: 'hydration_midday_nudge',
        screen: 'home',
      });
    }
  }

  /**
   * Immediate Interactive Test Notification
   */
  public async sendTestNotification(): Promise<boolean> {
    return this.scheduleNotification({
      id: 99999,
      title: '⚡ FitSync System Verified',
      body: 'Native notification channels & audio-haptics are operational on your device.',
      channelId: 'fitsync_reminders',
      screen: 'home',
    });
  }

  public async cancelAllScheduled(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      try {
        const pending = await LocalNotifications.getPending();
        if (pending.notifications.length > 0) {
          await LocalNotifications.cancel({ notifications: pending.notifications });
        }
      } catch (err) {
        console.warn('[NotificationService] Cancel pending error:', err);
      }
    }
  }
}

export const notificationService = NotificationService.getInstance();
