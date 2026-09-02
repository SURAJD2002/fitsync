import React, { useState } from 'react';
import { Play, Check, RefreshCw, Flame, Target } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { WorkoutSessionModal } from './WorkoutSessionModal';

export const WorkoutScreen: React.FC = () => {
  const { workout, toggleExerciseCompletion, setIsWorkoutModalOpen } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'workout' | 'exercises' | 'plans' | 'history'>('workout');

  const completedCount = workout.exercises.filter((ex) => ex.completed).length;
  const progressPercent = Math.round((completedCount / (workout.exercises.length || 1)) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 18px 30px' }} className="animate-fade-in">
      {/* Sub Navigation Bar */}
      <div className="sub-tabs-container">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'workout', label: 'Workout Split' },
          { id: 'exercises', label: 'Exercises' },
          { id: 'plans', label: 'AI Routines' },
          { id: 'history', label: 'History' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSubTab(tab.id as any)}
            className={`sub-tab-item ${subTab === tab.id ? 'active' : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Today's Workout Card */}
      <div
        className="glass-card glow-card-purple"
        style={{
          padding: '22px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
        }}
      >
        <div style={{ position: 'absolute', top: '16px', right: '16px', zIndex: 3 }}>
          <span className="badge-pill badge-purple">
            {workout.level || 'Intermediate'}
          </span>
        </div>

        <div style={{ maxWidth: '66%', position: 'relative', zIndex: 2 }}>
          <span style={{ fontSize: '10.5px', color: 'var(--purple-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Today's Scheduled Split
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: '4px 0 8px', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
            {workout.title}
          </h2>

          <div style={{ display: 'flex', gap: '10px', fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px', flexWrap: 'wrap' }}>
            <span>⏱ <strong>{workout.durationMins}m</strong> duration</span>
            <span>🔥 <strong>{workout.targetCalories}</strong> kcal</span>
            <span>🏋️ <strong>{workout.exercises.length}</strong> sets</span>
          </div>

          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Target: {workout.focusAreas.join(' • ')}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => setIsWorkoutModalOpen(true)}
              style={{ padding: '11px 18px', fontSize: '13.5px', width: 'auto' }}
              icon={<Play size={16} fill="#fff" />}
            >
              Start Session
            </Button>
          </div>
        </div>

        {/* Hero Athlete Visual Mask */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            top: '30px',
            width: '150px',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80"
            alt="Workout Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </div>

      {/* Today's Workout Metrics */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Session Progress</h3>
          <span style={{ color: 'var(--purple-light)', fontSize: '12px', fontWeight: 800 }}>{progressPercent}% Done</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <MetricCard
            icon={<Target size={18} />}
            value={`${completedCount}/${workout.exercises.length}`}
            label="Exercises Done"
            accentColor="var(--purple-primary)"
            showSparkline
          />
          <MetricCard
            icon={<Flame size={18} />}
            value={`${Math.round((progressPercent / 100) * workout.targetCalories)} kcal`}
            label="Calories Burned"
            accentColor="var(--coral-primary)"
            showSparkline
          />
        </div>
      </div>

      {/* Workout Plan Exercise Cards */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Exercise List</h3>
          <button
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '12px',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '11.5px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={13} /> Edit Split
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {workout.exercises.map((ex) => (
            <div
              key={ex.id}
              className="glass-card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderRadius: '20px',
                border: ex.completed ? '1.5px solid rgba(139, 92, 246, 0.45)' : '1px solid var(--border-subtle)',
                background: ex.completed ? 'rgba(139, 92, 246, 0.1)' : 'var(--bg-card)',
                boxShadow: ex.completed ? '0 4px 20px rgba(139, 92, 246, 0.15)' : 'var(--shadow-sm)',
                transition: 'all 0.2s ease',
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '10px',
                  background: ex.completed ? 'var(--gradient-purple)' : 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: ex.completed ? '0 0 10px var(--purple-glow)' : 'none',
                }}
              >
                {ex.stepNumber}
              </div>

              {/* Exercise Thumbnail */}
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>{ex.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block' }}>{ex.category}</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '6px', fontSize: '10.5px' }}>
                  <span className="badge-pill badge-purple" style={{ padding: '2px 8px', fontSize: '10px' }}>
                    {ex.targetSets} Sets
                  </span>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{ex.repsRange}</span>
                  <span style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>{ex.suggestedWeightKg} kg</span>
                </div>
              </div>

              {/* Interactive Checkmark Button */}
              <button
                onClick={() => toggleExerciseCompletion(ex.id)}
                title={ex.completed ? 'Mark incomplete' : 'Mark complete'}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '14px',
                  background: ex.completed ? 'var(--gradient-purple)' : 'rgba(255,255,255,0.04)',
                  border: ex.completed ? '1px solid var(--purple-light)' : '1px solid var(--border-subtle)',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.18s var(--ease-spring)',
                  boxShadow: ex.completed ? 'var(--shadow-purple)' : 'none',
                }}
              >
                {ex.completed ? <Check size={20} strokeWidth={3} /> : null}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Live Session Modal */}
      <WorkoutSessionModal />
    </div>
  );
};
