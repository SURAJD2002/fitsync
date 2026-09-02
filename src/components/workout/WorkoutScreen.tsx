import React, { useState } from 'react';
import { Play, Check, ChevronRight, Lightbulb, RefreshCw, Flame, Timer, Footprints, Target } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { MetricCard } from '../common/MetricCard';
import { Button } from '../common/Button';
import { WorkoutSessionModal } from './WorkoutSessionModal';

export const WorkoutScreen: React.FC = () => {
  const { workout, toggleExerciseCompletion, setIsWorkoutModalOpen } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'workout' | 'exercises' | 'plans' | 'history'>('workout');

  const completedCount = workout.exercises.filter((ex) => ex.completed).length;
  const progressPercent = Math.round((completedCount / workout.exercises.length) * 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 20px 30px' }}>
      {/* Sub Navigation Bar */}
      <div className="sub-tabs-container">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'workout', label: 'Workout' },
          { id: 'exercises', label: 'Exercises' },
          { id: 'plans', label: 'Plans' },
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
        className="glass-card"
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(18, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <span style={{ fontSize: '10px', background: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)', padding: '4px 10px', borderRadius: '99px', fontWeight: 600 }}>
            Level: Intermediate
          </span>
        </div>

        <div style={{ maxWidth: '65%' }}>
          <span style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: 700, textTransform: 'uppercase' }}>Today's Workout</span>
          <h2 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', margin: '4px 0 8px' }}>{workout.title}</h2>

          <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            <span>⏱ {workout.durationMins} min</span>
            <span>🔥 {workout.targetCalories} Cal</span>
            <span>🏋️ {workout.exercises.length} Exercises</span>
          </div>

          <p style={{ fontSize: '11px', color: 'var(--text-dim)', marginBottom: '16px' }}>
            Focus: {workout.focusAreas.join(' • ')}
          </p>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              onClick={() => setIsWorkoutModalOpen(true)}
              style={{ padding: '10px 18px', fontSize: '13px' }}
              icon={<Play size={16} fill="#fff" />}
            >
              Start Workout
            </Button>
            <Button
              variant="secondary"
              onClick={() => alert('Warm Up video starting...')}
              style={{ padding: '10px 14px', fontSize: '13px', width: 'auto' }}
            >
               Warm Up
            </Button>
          </div>
        </div>

        {/* Hero Athlete Photo */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            top: '40px',
            width: '140px',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80"
            alt="Male Workout Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </div>

      {/* Today's Progress Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Today's Progress</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View Analytics &gt;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <MetricCard
            icon={<Footprints size={18} />}
            value="12,450"
            label="Steps"
            accentColor="var(--purple-primary)"
            showSparkline
          />
          <MetricCard
            icon={<Flame size={18} />}
            value="480"
            label="Calories"
            accentColor="var(--color-orange)"
            showSparkline
          />
          <MetricCard
            icon={<Timer size={18} />}
            value="52"
            label="Workout Mins"
            accentColor="var(--color-green)"
            showSparkline
          />
          <MetricCard
            icon={<Target size={18} />}
            value={`${progressPercent}%`}
            label="Goal Progress"
            accentColor="var(--color-blue)"
            showSparkline
          />
        </div>
      </div>

      {/* Workout Plan Checklist Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Workout Plan</h3>
          <button
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '6px 12px',
              color: '#fff',
              fontSize: '11px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RefreshCw size={12} /> Change Split
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {workout.exercises.map((ex) => (
            <div
              key={ex.id}
              className="glass-card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                border: `1px solid ${ex.completed ? 'rgba(139, 92, 246, 0.4)' : 'var(--border-subtle)'}`,
                background: ex.completed ? 'rgba(139, 92, 246, 0.08)' : 'var(--bg-card)',
              }}
            >
              {/* Step number badge */}
              <div
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'var(--purple-dark)',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {ex.stepNumber}
              </div>

              {/* Exercise Thumbnail */}
              <div style={{ width: '56px', height: '56px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={ex.imageUrl} alt={ex.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              {/* Details */}
              <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>{ex.name}</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>{ex.category}</span>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', fontSize: '10px' }}>
                  <span style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple-light)', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                    {ex.targetSets} Sets
                  </span>
                  <span style={{ color: 'var(--text-dim)' }}>{ex.repsRange}</span>
                  <span style={{ color: 'var(--text-dim)' }}>{ex.suggestedWeightKg} kg</span>
                </div>
              </div>

              {/* Interactive Checkmark Button */}
              <button
                onClick={() => toggleExerciseCompletion(ex.id)}
                title={ex.completed ? 'Mark incomplete' : 'Mark complete'}
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  background: ex.completed ? 'var(--purple-primary)' : 'transparent',
                  border: `2px solid ${ex.completed ? 'var(--purple-primary)' : 'var(--border-subtle)'}`,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: ex.completed ? 'var(--shadow-purple)' : 'none',
                }}
              >
                {ex.completed ? <Check size={18} /> : null}
              </button>

              <ChevronRight size={16} color="var(--text-dim)" />
            </div>
          ))}
        </div>
      </div>

      {/* AI Tip Card */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(18, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Lightbulb size={22} color="var(--purple-light)" />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--purple-light)', textTransform: 'uppercase' }}>AI Tip for You</span>
          <p style={{ fontSize: '12px', color: '#fff', marginTop: '2px', lineHeight: 1.3 }}>
            Keep your elbows slightly tucked during pushdowns for better tricep activation.
          </p>
        </div>
        <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          View More Tips &gt;
        </button>
      </div>

      {/* Live Session Modal */}
      <WorkoutSessionModal />
    </div>
  );
};
