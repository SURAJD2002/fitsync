import { ActivityTracker, type StepUpdateEvent } from '../plugins/activityTracker';
import { SafeStorage } from './storage';
import { supabase } from './supabaseClient';

export interface DailyActivityRecord {
  date: string; // 'YYYY-MM-DD'
  steps: number;
  distanceKm: number;
  activeMinutes: number;
  caloriesBurned: number;
  lastUpdated: string;
}

export interface ActivityTrackingState {
  date: string;
  baselineRawSteps: number;
  lastRawSteps: number;
  todaySteps: number;
  distanceKm: number;
  activeMinutes: number;
  caloriesBurned: number;
  history: Record<string, DailyActivityRecord>;
}

const STORAGE_KEY = 'fitsync_activity_tracking_state';

const getLocalDateString = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export class ActivityTrackingService {
  private static instance: ActivityTrackingService;
  private state: ActivityTrackingState;
  private listeners: Set<(state: ActivityTrackingState) => void> = new Set();
  private isInitialized = false;
  private syncTimeout: any = null;

  private constructor() {
    this.state = this.loadInitialState();
  }

  public static getInstance(): ActivityTrackingService {
    if (!ActivityTrackingService.instance) {
      ActivityTrackingService.instance = new ActivityTrackingService();
    }
    return ActivityTrackingService.instance;
  }

  private loadInitialState(): ActivityTrackingState {
    const today = getLocalDateString();
    const saved = SafeStorage.get<ActivityTrackingState>(STORAGE_KEY, {
      date: today,
      baselineRawSteps: -1,
      lastRawSteps: -1,
      todaySteps: 0,
      distanceKm: 0,
      activeMinutes: 0,
      caloriesBurned: 0,
      history: {},
    });

    // Handle calendar day rollover on app launch
    if (saved.date !== today) {
      if (saved.todaySteps > 0) {
        saved.history[saved.date] = {
          date: saved.date,
          steps: saved.todaySteps,
          distanceKm: saved.distanceKm,
          activeMinutes: saved.activeMinutes,
          caloriesBurned: saved.caloriesBurned,
          lastUpdated: new Date().toISOString(),
        };
      }
      saved.date = today;
      saved.todaySteps = 0;
      saved.distanceKm = 0;
      saved.activeMinutes = 0;
      saved.caloriesBurned = 0;
      saved.baselineRawSteps = saved.lastRawSteps >= 0 ? saved.lastRawSteps : -1;
    }

    return saved;
  }

  public getState(): ActivityTrackingState {
    return { ...this.state };
  }

  public subscribe(callback: (state: ActivityTrackingState) => void): () => void {
    this.listeners.add(callback);
    callback(this.getState());
    return () => {
      this.listeners.delete(callback);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => listener(currentState));
  }

  private saveState() {
    SafeStorage.set(STORAGE_KEY, this.state);
    this.notify();
    this.scheduleCloudSync();
  }

  /**
   * Pure deterministic calculation for unit testability and data integrity.
   */
  public static computeDaySteps(
    rawSteps: number,
    baselineRawSteps: number
  ): { todaySteps: number; newBaseline: number } {
    if (rawSteps < 0) {
      return { todaySteps: 0, newBaseline: 0 };
    }

    // First ever reading
    if (baselineRawSteps < 0) {
      return { todaySteps: 0, newBaseline: rawSteps };
    }

    // Device reboot or sensor counter rollover detected
    if (rawSteps < baselineRawSteps) {
      return { todaySteps: rawSteps, newBaseline: 0 };
    }

    const steps = Math.max(0, rawSteps - baselineRawSteps);
    return { todaySteps: steps, newBaseline: baselineRawSteps };
  }

  public static computeDerivedMetrics(steps: number): {
    distanceKm: number;
    activeMinutes: number;
    caloriesBurned: number;
  } {
    // 1 step ≈ 0.000762 km (76.2 cm stride length)
    const distanceKm = Math.round(steps * 0.000762 * 100) / 100;
    // Average walking cadence: ~100 steps/minute
    const activeMinutes = Math.round(steps / 100);
    // Average walking burn: ~0.04 kcal / step for 70-75kg adult
    const caloriesBurned = Math.round(steps * 0.04);

    return { distanceKm, activeMinutes, caloriesBurned };
  }

  /**
   * Process incoming sensor reading with day boundary and anomaly handling.
   */
  public processSensorEvent(event: StepUpdateEvent): void {
    const rawSteps = event.rawSteps;
    const today = getLocalDateString();

    // 1. Calendar Day Rollover check
    if (this.state.date !== today) {
      if (this.state.todaySteps > 0) {
        this.state.history[this.state.date] = {
          date: this.state.date,
          steps: this.state.todaySteps,
          distanceKm: this.state.distanceKm,
          activeMinutes: this.state.activeMinutes,
          caloriesBurned: this.state.caloriesBurned,
          lastUpdated: new Date().toISOString(),
        };
      }
      this.state.date = today;
      this.state.baselineRawSteps = rawSteps;
      this.state.todaySteps = 0;
      this.state.distanceKm = 0;
      this.state.activeMinutes = 0;
      this.state.caloriesBurned = 0;
    }

    // 2. Compute steps relative to baseline
    const { todaySteps, newBaseline } = ActivityTrackingService.computeDaySteps(
      rawSteps,
      this.state.baselineRawSteps
    );

    // 3. Duplicate event check
    if (rawSteps === this.state.lastRawSteps && todaySteps === this.state.todaySteps) {
      return;
    }

    this.state.baselineRawSteps = newBaseline;
    this.state.lastRawSteps = rawSteps;
    this.state.todaySteps = todaySteps;

    // 4. Compute derived metrics
    const { distanceKm, activeMinutes, caloriesBurned } = ActivityTrackingService.computeDerivedMetrics(todaySteps);
    this.state.distanceKm = distanceKm;
    this.state.activeMinutes = activeMinutes;
    this.state.caloriesBurned = caloriesBurned;

    this.saveState();
  }

  /**
   * Initialize sensor listener and runtime tracking.
   */
  public async initialize(): Promise<{ isAvailable: boolean; granted: boolean; isTracking: boolean }> {
    if (this.isInitialized) {
      const status = await ActivityTracker.getPermissionStatus();
      const reading = await ActivityTracker.getLatestSensorReading();
      return { isAvailable: true, granted: status.granted, isTracking: reading.isTracking };
    }

    try {
      const availability = await ActivityTracker.checkAvailability();
      if (!availability.isAvailable) {
        return { isAvailable: false, granted: false, isTracking: false };
      }

      const permission = await ActivityTracker.getPermissionStatus();
      if (!permission.granted) {
        return { isAvailable: true, granted: false, isTracking: false };
      }

      // Start native tracking
      await ActivityTracker.addListener('stepUpdate', (event: StepUpdateEvent) => {
        this.processSensorEvent(event);
      });

      const trackingRes = await ActivityTracker.startTracking();
      this.isInitialized = true;

      // Poll latest reading if already available
      const reading = await ActivityTracker.getLatestSensorReading();
      if (reading.rawSteps >= 0) {
        this.processSensorEvent({ rawSteps: reading.rawSteps, timestamp: reading.timestamp });
      }

      return { isAvailable: true, granted: true, isTracking: trackingRes.isTracking };
    } catch (err) {
      console.warn('[ActivityTrackingService] Initialization warning:', err);
      return { isAvailable: false, granted: false, isTracking: false };
    }
  }

  /**
   * Request ACTIVITY_RECOGNITION permission from user.
   */
  public async requestPermissionAndStart(): Promise<boolean> {
    try {
      const res = await ActivityTracker.requestPermission();
      if (res.granted) {
        await this.initialize();
        return true;
      }
      return false;
    } catch (err) {
      console.error('[ActivityTrackingService] Permission request failed:', err);
      return false;
    }
  }

  /**
   * Debounced background cloud sync to Supabase.
   */
  private scheduleCloudSync() {
    if (this.syncTimeout) clearTimeout(this.syncTimeout);
    this.syncTimeout = setTimeout(() => {
      this.syncToSupabase();
    }, 5000); // 5s debounce to minimize network overhead
  }

  public async syncToSupabase(): Promise<boolean> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const record = {
        user_id: user.id,
        activity_date: this.state.date,
        steps: this.state.todaySteps,
        distance_km: this.state.distanceKm,
        active_minutes: this.state.activeMinutes,
        calories_burned: this.state.caloriesBurned,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('daily_activities')
        .upsert(record, { onConflict: 'user_id,activity_date' });

      if (error) {
        // Table might be pending migration or offline
        console.warn('[ActivityTrackingService] Cloud sync note:', error.message);
        return false;
      }

      return true;
    } catch {
      return false;
    }
  }
}

export const activityTrackingService = ActivityTrackingService.getInstance();
