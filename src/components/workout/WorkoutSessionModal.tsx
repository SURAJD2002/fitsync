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

  const completedSetsCount = currentExercise.sets.filter((s) => s.completed).length;

  return (
    <Modal
      isOpen={isWorkoutModalOpen}
      onClose={handleClose}
      title={`Live Session • ${workout.title}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Live Duration Banner with Neon Glow */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(6, 182, 212, 0.1) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            padding: '10px 16px',
            borderRadius: '16px',
            boxShadow: '0 4px 16px rgba(139, 92, 246, 0.2)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple-light)', fontSize: '13px', fontWeight: 800 }}>
            <Timer size={16} color="var(--purple-light)" />
            <span>ACTIVE SESSION</span>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)', letterSpacing: '0.04em' }}>
            {formatTimer(elapsedSeconds)}
          </span>
        </div>

        {/* Exercise Header Visual */}
        <div style={{ position: 'relative', height: '150px', borderRadius: '20px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
          <img src={currentExercise.imageUrl} alt={currentExercise.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(7, 8, 12, 0.92) 10%, rgba(7, 8, 12, 0.2) 60%, transparent)' }} />
          <div style={{ position: 'absolute', bottom: '14px', left: '16px', right: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
              <span className="badge-pill badge-purple" style={{ padding: '2px 8px', fontSize: '10px' }}>
                Exercise {activeExerciseIdx + 1} of {workout.exercises.length}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{currentExercise.category}</span>
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              {currentExercise.name}
            </h3>
          </div>
        </div>

        {/* Interactive Set Logger */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--text-secondary)' }}>Log Sets & Weights</h4>
            <span style={{ fontSize: '11px', color: 'var(--emerald-light)', fontWeight: 700 }}>
              {completedSetsCount}/{currentExercise.sets.length} Completed
            </span>
          </div>

          {currentExercise.sets.map((set) => (
            <div
              key={set.setNumber}
              onClick={() => toggleSetCompletion(currentExercise.id, set.setNumber)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: set.completed ? 'rgba(16, 185, 129, 0.14)' : 'rgba(22, 26, 41, 0.8)',
                border: `1.5px solid ${set.completed ? 'rgba(16, 185, 129, 0.45)' : 'var(--border-subtle)'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                transition: 'all 0.18s var(--ease-spring)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span
                  style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '8px',
                    background: set.completed ? 'var(--emerald-primary)' : 'rgba(255,255,255,0.08)',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {set.setNumber}
                </span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Set {set.setNumber}</span>
              </div>

              <span style={{ fontSize: '13px', color: 'var(--text-secondary)', fontWeight: 600 }}>
                <strong>{set.weightKg} kg</strong> × {set.repsMax} Reps
              </span>

              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: set.completed ? 'var(--emerald-primary)' : 'rgba(255,255,255,0.05)',
                  border: set.completed ? 'none' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: set.completed ? '0 0 10px rgba(16, 185, 129, 0.4)' : 'none',
                }}
              >
                {set.completed && <Check size={18} strokeWidth={3} />}
              </div>
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
