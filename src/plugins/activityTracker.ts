import { registerPlugin, type PluginListenerHandle } from '@capacitor/core';

export interface StepUpdateEvent {
  rawSteps: number;
  timestamp: number;
  sensorType?: string;
}

export interface ActivityTrackerPlugin {
  checkAvailability(): Promise<{ isAvailable: boolean; hasStepCounter: boolean; hasStepDetector: boolean }>;
  getPermissionStatus(): Promise<{ granted: boolean }>;
  requestPermission(): Promise<{ granted: boolean }>;
  startTracking(): Promise<{ isTracking: boolean; latestRawSteps: number }>;
  stopTracking(): Promise<{ isTracking: boolean }>;
  getLatestSensorReading(): Promise<{ rawSteps: number; timestamp: number; isTracking: boolean }>;
  addListener(
    eventName: 'stepUpdate',
    listenerFunc: (data: StepUpdateEvent) => void
  ): Promise<PluginListenerHandle>;
}

// Web mock fallback when running outside native Android
class ActivityTrackerWeb implements ActivityTrackerPlugin {
  private isTracking = false;

  async checkAvailability(): Promise<{ isAvailable: boolean; hasStepCounter: boolean; hasStepDetector: boolean }> {
    return { isAvailable: false, hasStepCounter: false, hasStepDetector: false };
  }

  async getPermissionStatus(): Promise<{ granted: boolean }> {
    return { granted: false };
  }

  async requestPermission(): Promise<{ granted: boolean }> {
    return { granted: false };
  }

  async startTracking(): Promise<{ isTracking: boolean; latestRawSteps: number }> {
    this.isTracking = false;
    return { isTracking: false, latestRawSteps: 0 };
  }

  async stopTracking(): Promise<{ isTracking: boolean }> {
    this.isTracking = false;
    return { isTracking: false };
  }

  async getLatestSensorReading(): Promise<{ rawSteps: number; timestamp: number; isTracking: boolean }> {
    return { rawSteps: 0, timestamp: Date.now(), isTracking: this.isTracking };
  }

  async addListener(): Promise<PluginListenerHandle> {
    return {
      remove: async () => {},
    };
  }
}

export const ActivityTracker = registerPlugin<ActivityTrackerPlugin>('ActivityTracker', {
  web: () => new ActivityTrackerWeb(),
});
