import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  Workout,
  DietPlan,
  WeightDataPoint,
  BodyComposition,
  ProgressPhoto,
  Achievement,
} from '../types';
import { FitnessService } from '../services/fitnessService';
import { activityTrackingService, type ActivityTrackingState, type DailyActivityRecord } from '../services/activityTrackingService';
import { notificationService } from '../services/notificationService';

export type MainTab = 'home' | 'workout' | 'diet' | 'progress' | 'profile';

interface FitnessContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  workout: Workout;
  toggleExerciseCompletion: (exerciseId: string) => void;
  toggleSetCompletion: (exerciseId: string, setNumber: number) => void;
  dietPlan: DietPlan;
  setDietPlan: (plan: DietPlan) => void;
  incrementWaterIntake: () => void;
  setWaterIntake: (glasses: number) => void;
  weightHistory: WeightDataPoint[];
  logNewWeight: (weightKg: number, dateLabel: string) => void;
  bodyComposition: BodyComposition;
  progressPhotos: ProgressPhoto[];
  achievements: Achievement[];
  isWorkoutModalOpen: boolean;
  setIsWorkoutModalOpen: (open: boolean) => void;
  dietViewMode: 'overview' | 'detailed';
  setDietViewMode: (mode: 'overview' | 'detailed') => void;

  // Native Activity & Step Tracking v1
  stepsToday: number;
  distanceKmToday: number;
  activeMinutesToday: number;
  activityCaloriesToday: number;
  isActivityTrackingAvailable: boolean;
  isActivityTrackingActive: boolean;
  activityPermissionGranted: boolean;
  requestActivityPermission: () => Promise<boolean>;
  activityHistory: Record<string, DailyActivityRecord>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [workout, setWorkout] = useState<Workout>(FitnessService.getWorkout());
  const [dietPlan, setDietPlanState] = useState<DietPlan>(FitnessService.getDietPlan());
  const [weightHistory, setWeightHistory] = useState<WeightDataPoint[]>(FitnessService.getWeightHistory());
  const [bodyComposition] = useState<BodyComposition>(FitnessService.getBodyComposition());
  const [progressPhotos] = useState<ProgressPhoto[]>(FitnessService.getProgressPhotos());
  const [achievements] = useState<Achievement[]>(FitnessService.getAchievements());
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState<boolean>(false);
  const [dietViewMode, setDietViewMode] = useState<'overview' | 'detailed'>('overview');

  // Activity Tracking State
  const [activityState, setActivityState] = useState<ActivityTrackingState>(activityTrackingService.getState());
  const [isAvailable, setIsAvailable] = useState<boolean>(true);
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to activity service state updates
    const unsubscribe = activityTrackingService.subscribe((newState) => {
      setActivityState(newState);
    });

    // Initialize native sensors on mount
    activityTrackingService.initialize().then((res) => {
      setIsAvailable(res.isAvailable);
      setPermissionGranted(res.granted);
      setIsTracking(res.isTracking);
    });

    // Initialize Notification Channels & Deep Link Router
    notificationService.initialize();
    const unregisterDeepLink = notificationService.registerDeepLinkHandler((screen) => {
      if (['home', 'workout', 'diet', 'progress', 'profile'].includes(screen)) {
        setActiveTab(screen as MainTab);
      }
    });

    return () => {
      unsubscribe();
      unregisterDeepLink();
    };
  }, []);

  const requestActivityPermission = async (): Promise<boolean> => {
    const granted = await activityTrackingService.requestPermissionAndStart();
    setPermissionGranted(granted);
    if (granted) {
      setIsTracking(true);
    }
    return granted;
  };

  const setDietPlan = (plan: DietPlan) => {
    setDietPlanState(plan);
    FitnessService.saveDietPlan(plan);
  };

  const toggleExerciseCompletion = (exerciseId: string) => {
    const updated = FitnessService.toggleExerciseCompletion(exerciseId);
    setWorkout(updated);
  };

  const toggleSetCompletion = (exerciseId: string, setNumber: number) => {
    const updated = FitnessService.toggleSetCompletion(exerciseId, setNumber);
    setWorkout(updated);
  };

  const incrementWaterIntake = () => {
    const updated = FitnessService.incrementWaterIntake();
    setDietPlanState(updated);
  };

  const setWaterIntake = (glasses: number) => {
    const updated = FitnessService.setWaterIntake(glasses);
    setDietPlanState(updated);
  };

  const logNewWeight = (weightKg: number, dateLabel: string) => {
    const updated = FitnessService.logNewWeight(weightKg, dateLabel);
    setWeightHistory(updated);
  };

  return (
    <FitnessContext.Provider
      value={{
        activeTab,
        setActiveTab,
        workout,
        toggleExerciseCompletion,
        toggleSetCompletion,
        dietPlan,
        setDietPlan,
        incrementWaterIntake,
        setWaterIntake,
        weightHistory,
        logNewWeight,
        bodyComposition,
        progressPhotos,
        achievements,
        isWorkoutModalOpen,
        setIsWorkoutModalOpen,
        dietViewMode,
        setDietViewMode,

        // Native Activity Tracking
        stepsToday: activityState.todaySteps,
        distanceKmToday: activityState.distanceKm,
        activeMinutesToday: activityState.activeMinutes,
        activityCaloriesToday: activityState.caloriesBurned,
        isActivityTrackingAvailable: isAvailable,
        isActivityTrackingActive: isTracking,
        activityPermissionGranted: permissionGranted,
        requestActivityPermission,
        activityHistory: activityState.history,
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
