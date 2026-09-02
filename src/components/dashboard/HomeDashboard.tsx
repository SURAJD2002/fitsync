import React, { useState } from 'react';
import { Flame, Timer, Footprints, Target, Play, Sparkles, Dumbbell, Utensils, Heart, Activity, Zap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { MetricCard } from '../common/MetricCard';

export const HomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { workout, dietPlan, setActiveTab, setIsWorkoutModalOpen } = useFitness();
  const [selectedGoal, setSelectedGoal] = useState<string>('build_muscle');
  const [planTab, setPlanTab] = useState<'workout' | 'diet' | 'routine'>('workout');

  const goals = [
    { id: 'build_muscle', label: 'Build Muscle', sub: 'Gain strength & mass', icon: <Dumbbell size={20} color="var(--purple-light)" /> },
    { id: 'lose_fat', label: 'Lose Fat', sub: 'Burn fat & get lean', icon: <Flame size={20} color="var(--color-orange)" /> },
    { id: 'improve_fitness', label: 'Improve Fitness', sub: 'Better stamina & health', icon: <Heart size={20} color="var(--color-green)" /> },
    { id: 'strength', label: 'Strength', sub: 'Increase overall strength', icon: <Activity size={20} color="var(--color-blue)" /> },
    { id: 'athletic', label: 'Athletic', sub: 'Performance focus', icon: <Zap size={20} color="var(--color-yellow)" /> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 20px 30px' }}>
      {/* AI Coach Banner */}
      <div
        className="glass-card"
        style={{
          padding: '20px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(18, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '65%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '4px 10px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              color: 'var(--purple-light)',
              marginBottom: '8px',
            }}
          >
            <Sparkles size={12} />
            <span>AI COACH</span>
          </div>

          <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', lineHeight: 1.15, marginBottom: '6px' }}>
            Your Fitness,<br />
            <span style={{ color: 'var(--purple-light)' }}>Your Way!</span>
          </h2>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
            AI-powered plans for workouts, diet & better you.
          </p>

          <button
            onClick={() => setActiveTab('workout')}
            style={{
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px 16px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(255,255,255,0.2)',
            }}
          >
            <span>Get My Plan</span>
            <Sparkles size={14} color="#7c3aed" />
          </button>
        </div>

        {/* Hero Banner Background Image */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            bottom: '-10px',
            top: 0,
            width: '150px',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80"
            alt="AI Coach"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        </div>
      </div>

      {/* What's Your Goal? Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>What's Your Goal?</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            See All
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="sub-tabs-container">
          {goals.map((g) => {
            const isSelected = selectedGoal === g.id;
            return (
              <div
                key={g.id}
                onClick={() => setSelectedGoal(g.id)}
                className="glass-card"
                style={{
                  minWidth: '130px',
                  padding: '14px',
                  border: `1.5px solid ${isSelected ? 'var(--purple-primary)' : 'var(--border-subtle)'}`,
                  background: isSelected ? 'rgba(139, 92, 246, 0.12)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {g.icon}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>{g.label}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{g.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Overview Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Today's Overview</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            Edit Goals
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <MetricCard
            icon={<Flame size={18} />}
            value="450"
            label="Calories Burned"
            accentColor="var(--color-blue)"
          />
          <MetricCard
            icon={<Timer size={18} />}
            value="52"
            label="Workout Mins"
            accentColor="var(--color-green)"
          />
          <MetricCard
            icon={<Footprints size={18} />}
            value="12,450"
            label="Steps"
            accentColor="var(--color-orange)"
          />
          <MetricCard
            icon={<Target size={18} />}
            value={`${user.goalProgressPercent}%`}
            label="Goal Progress"
            accentColor="var(--purple-primary)"
          />
        </div>
      </div>

      {/* Your AI Plan Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Your AI Plan</h3>
          <button onClick={() => setActiveTab('workout')} style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            See Plan
          </button>
        </div>

        <div className="glass-card" style={{ padding: '16px' }}>
          {/* Sub Navigation Tabs */}
          <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '4px', marginBottom: '16px' }}>
            <button
              onClick={() => setPlanTab('workout')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: planTab === 'workout' ? 'var(--purple-primary)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Dumbbell size={14} /> Workout
            </button>
            <button
              onClick={() => setPlanTab('diet')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: planTab === 'diet' ? 'var(--purple-primary)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Utensils size={14} /> Diet
            </button>
            <button
              onClick={() => setPlanTab('routine')}
              style={{
                flex: 1,
                padding: '8px',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                background: planTab === 'routine' ? 'var(--purple-primary)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              📅 Routine
            </button>
          </div>

          {planTab === 'workout' && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div style={{ width: '100px', height: '90px', borderRadius: 'var(--radius-md)', overflow: 'hidden', position: 'relative' }}>
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80"
                  alt="Push Day"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10px', color: 'var(--purple-light)', fontWeight: 700, textTransform: 'uppercase' }}>Today's Workout</span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{workout.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{workout.focusAreas.join(' • ')}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '11px', color: 'var(--text-dim)' }}>
                  <span>⏱ {workout.durationMins} min</span>
                  <span>🔥 {workout.targetCalories} Cal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('workout');
                  setIsWorkoutModalOpen(true);
                }}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: 'var(--gradient-purple)',
                  border: 'none',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-purple)',
                }}
              >
                <Play size={20} fill="#fff" />
              </button>
            </div>
          )}

          {planTab === 'diet' && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: 700 }}>Today's Nutrition</span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{dietPlan.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Target: {dietPlan.dailyCaloriesTarget} kcal / day</p>
              </div>
              <button
                onClick={() => setActiveTab('diet')}
                style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 14px', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
              >
                View Diet
              </button>
            </div>
          )}

          {planTab === 'routine' && (
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ⚡ Evening Stretch & Mobility Routine scheduled for 7:30 PM.
            </div>
          )}
        </div>
      </div>

      {/* Recommended For You Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Recommended For You</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            See All
          </button>
        </div>

        <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }} className="sub-tabs-container">
          {[
            {
              title: 'High Protein Diet',
              subtitle: '3200 Cal • 5 Meals',
              image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80',
            },
            {
              title: 'Strength Builder',
              subtitle: '4 Weeks Program',
              image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80',
            },
            {
              title: 'Morning Routine',
              subtitle: 'Build a strong habit',
              image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=300&q=80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                minWidth: '160px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                cursor: 'pointer',
              }}
            >
              <div style={{ height: '100px', position: 'relative' }}>
                <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '10px' }}>
                <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#fff' }}>{item.title}</h4>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{item.subtitle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
