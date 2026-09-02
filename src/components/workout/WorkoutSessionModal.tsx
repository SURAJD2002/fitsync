import React, { useState, useEffect } from 'react';
import { Check, ChevronRight, Timer } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { FitnessService } from '../../services/fitnessService';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const WorkoutSessionModal: React.FC = () => {
  const { isWorkoutModalOpen, setIsWorkoutModalOpen, workout, toggleSetCompletion } = useFitness();
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  // Restore or initialize workout session state
  useEffect(() => {
    if (isWorkoutModalOpen) {
      const existingSession = FitnessService.getWorkoutSession();
      if (existingSession && existingSession.workoutId === workout.id) {
        setActiveExerciseIdx(existingSession.activeExerciseIdx || 0);
        const startTime = Date.parse(existingSession.startedAt);
        if (!isNaN(startTime)) {
          const initialElapsed = Math.max(0, Math.floor((Date.now() - startTime) / 1000));
          setElapsedSeconds(initialElapsed);
        }
      } else {
        const newSession = {
          workoutId: workout.id,
          activeExerciseIdx: 0,
          startedAt: new Date().toISOString(),
          isModalOpen: true,
        };
        FitnessService.saveWorkoutSession(newSession);
        setElapsedSeconds(0);
      }
    }
  }, [isWorkoutModalOpen, workout.id]);

  // Live timer interval derived from session start
  useEffect(() => {
    if (!isWorkoutModalOpen) return;

    const timer = setInterval(() => {
      const session = FitnessService.getWorkoutSession();
      if (session) {
        const startTime = Date.parse(session.startedAt);
        if (!isNaN(startTime)) {
          setElapsedSeconds(Math.max(0, Math.floor((Date.now() - startTime) / 1000)));
        }
      } else {
        setElapsedSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isWorkoutModalOpen]);

  // Sync active exercise index to persistent storage
  const handleExerciseChange = (nextIdx: number) => {
    setActiveExerciseIdx(nextIdx);
    const session = FitnessService.getWorkoutSession();
    if (session) {
      FitnessService.saveWorkoutSession({
        ...session,
        activeExerciseIdx: nextIdx,
      });
    }
  };

  const handleNext = () => {
    if (activeExerciseIdx < workout.exercises.length - 1) {
      handleExerciseChange(activeExerciseIdx + 1);
    } else {
      FitnessService.clearWorkoutSession();
      setIsWorkoutModalOpen(false);
    }
  };

  const handleClose = () => {
    FitnessService.clearWorkoutSession();
    setIsWorkoutModalOpen(false);
  };

  const currentExercise = workout.exercises[activeExerciseIdx] || workout.exercises[0];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Modal
      isOpen={isWorkoutModalOpen}
      onClose={handleClose}
      title={`Live: ${workout.title}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Live Elapsed Duration Banner */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            padding: '8px 14px',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700 }}>
            <Timer size={15} />
            <span>Active Session</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', fontFamily: 'monospace' }}>
            {formatTimer(elapsedSeconds)}
          </span>
        </div>

        {/* Exercise Header */}
        <div style={{ position: 'relative', height: '140px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
          <img src={currentExercise.imageUrl} alt={currentExercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
          <div style={{ position: 'absolute', bottom: '12px', left: '12px', right: '12px' }}>
            <span style={{ fontSize: '10px', color: 'var(--purple-light)', fontWeight: 700, textTransform: 'uppercase' }}>
              Exercise {activeExerciseIdx + 1} of {workout.exercises.length} • {currentExercise.category}
            </span>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{currentExercise.name}</h3>
          </div>
        </div>

        {/* Set Tracker Table */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-muted)' }}>Sets & Reps Tracker</h4>

          {currentExercise.sets.map((set) => (
            <div
              key={set.setNumber}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                background: set.completed ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-surface)',
                border: `1px solid ${set.completed ? 'rgba(16, 185, 129, 0.3)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>Set {set.setNumber}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{set.weightKg} kg × {set.repsMax} Reps</span>
              <button
                onClick={() => toggleSetCompletion(currentExercise.id, set.setNumber)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: set.completed ? 'var(--color-green)' : 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <Check size={16} />
              </button>
            </div>
          ))}
        </div>

        <Button onClick={handleNext} icon={<ChevronRight size={18} />}>
          {activeExerciseIdx < workout.exercises.length - 1 ? 'Next Exercise' : 'Finish Workout 🎉'}
        </Button>
      </div>
    </Modal>
  );
};
