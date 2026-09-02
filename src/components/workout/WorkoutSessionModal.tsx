import React, { useState } from 'react';
import { Check, ChevronRight } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const WorkoutSessionModal: React.FC = () => {
  const { isWorkoutModalOpen, setIsWorkoutModalOpen, workout, toggleSetCompletion } = useFitness();
  const [activeExerciseIdx, setActiveExerciseIdx] = useState(0);

  const currentExercise = workout.exercises[activeExerciseIdx] || workout.exercises[0];

  const handleNext = () => {
    if (activeExerciseIdx < workout.exercises.length - 1) {
      setActiveExerciseIdx((prev) => prev + 1);
    } else {
      setIsWorkoutModalOpen(false);
    }
  };

  return (
    <Modal
      isOpen={isWorkoutModalOpen}
      onClose={() => setIsWorkoutModalOpen(false)}
      title={`Live Workout: ${workout.title}`}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
