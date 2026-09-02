import React, { createContext, useContext, useState } from 'react';
import type {
  Workout,
  DietPlan,
  WeightDataPoint,
  BodyComposition,
  ProgressPhoto,
  Achievement,
} from '../types';
import { FitnessService } from '../services/fitnessService';

export type MainTab = 'home' | 'workout' | 'diet' | 'progress' | 'profile';

interface FitnessContextType {
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  workout: Workout;
  toggleExerciseCompletion: (exerciseId: string) => void;
  toggleSetCompletion: (exerciseId: string, setNumber: number) => void;
  dietPlan: DietPlan;
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
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTab>('home');
  const [workout, setWorkout] = useState<Workout>(FitnessService.getWorkout());
  const [dietPlan, setDietPlan] = useState<DietPlan>(FitnessService.getDietPlan());
  const [weightHistory, setWeightHistory] = useState<WeightDataPoint[]>(FitnessService.getWeightHistory());
  const [bodyComposition] = useState<BodyComposition>(FitnessService.getBodyComposition());
  const [progressPhotos] = useState<ProgressPhoto[]>(FitnessService.getProgressPhotos());
  const [achievements] = useState<Achievement[]>(FitnessService.getAchievements());
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState<boolean>(false);
  const [dietViewMode, setDietViewMode] = useState<'overview' | 'detailed'>('overview');

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
    setDietPlan(updated);
  };

  const setWaterIntake = (glasses: number) => {
    const updated = FitnessService.setWaterIntake(glasses);
    setDietPlan(updated);
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
