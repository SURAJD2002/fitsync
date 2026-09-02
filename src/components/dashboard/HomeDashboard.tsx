import React, { useState } from 'react';
import { Flame, Timer, Footprints, Target, Play, Sparkles, Dumbbell, Utensils, Heart, Activity, Zap, Droplets, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { MetricCard } from '../common/MetricCard';

export const HomeDashboard: React.FC = () => {
  const { user } = useAuth();
  const { workout, dietPlan, setActiveTab, setIsWorkoutModalOpen, setWaterIntake } = useFitness();
  const [selectedGoal, setSelectedGoal] = useState<string>('build_muscle');
  const [planTab, setPlanTab] = useState<'workout' | 'diet' | 'routine'>('workout');

  const goals = [
    { id: 'build_muscle', label: 'Build Muscle', sub: 'Hypertrophy & Mass', icon: <Dumbbell size={18} color="var(--purple-light)" /> },
    { id: 'lose_fat', label: 'Burn Fat', sub: 'Cut & Definition', icon: <Flame size={18} color="var(--coral-light)" /> },
    { id: 'improve_fitness', label: 'Endurance', sub: 'Cardio & Stamina', icon: <Heart size={18} color="var(--emerald-light)" /> },
    { id: 'strength', label: 'Pure Strength', sub: 'Powerlifting Base', icon: <Activity size={18} color="var(--cyan-light)" /> },
    { id: 'athletic', label: 'Athleticism', sub: 'Agility & Speed', icon: <Zap size={18} color="#fbbf24" /> },
  ];

  const waterGlasses = dietPlan.waterGlassesDrunk ?? 0;
  const waterTarget = dietPlan.waterTargetGlasses || 8;
  const waterPercent = Math.min(100, Math.round((waterGlasses / waterTarget) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 18px 28px' }} className="animate-fade-in">
      {/* AI Coach Hero Glass Banner */}
      <div
        className="glass-card glow-card-purple"
        style={{
          padding: '22px 20px',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '24px',
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '68%' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.22)',
              border: '1px solid rgba(139, 92, 246, 0.45)',
              padding: '4px 10px',
              borderRadius: '99px',
              fontSize: '10.5px',
              fontWeight: 800,
              color: 'var(--purple-light)',
              letterSpacing: '0.06em',
              marginBottom: '10px',
              boxShadow: '0 0 12px rgba(139, 92, 246, 0.3)',
            }}
          >
            <Sparkles size={12} color="var(--purple-light)" />
            <span>AI HYPER-COACH</span>
          </div>

          <h2
            style={{
              fontSize: '23px',
              fontWeight: 900,
              color: '#fff',
              lineHeight: 1.18,
              marginBottom: '8px',
              fontFamily: 'var(--font-heading)',
              letterSpacing: '-0.03em',
            }}
          >
            Target Locked,<br />
            <span className="text-gradient-purple">Crush Today!</span>
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
            Tailored sets for {workout.title.toLowerCase()} & {dietPlan.dailyCaloriesTarget} kcal budget.
          </p>

          <button
            onClick={() => {
              setActiveTab('workout');
              setIsWorkoutModalOpen(true);
            }}
            style={{
              background: '#ffffff',
              color: '#090a0f',
              border: 'none',
              borderRadius: '14px',
              padding: '11px 18px',
              fontWeight: 800,
              fontSize: '13.5px',
              fontFamily: 'var(--font-heading)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(255,255,255,0.25)',
              transition: 'transform 0.15s ease',
            }}
          >
            <Play size={15} fill="#090a0f" />
            <span>Start Session</span>
          </button>
        </div>

        {/* Hero Banner Visual Layer */}
        <div
          style={{
            position: 'absolute',
            right: '-15px',
            bottom: '-10px',
            top: 0,
            width: '160px',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80"
            alt="AI Coach"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </div>

      {/* Target Focus Selector */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Target Focus</h3>
          <span style={{ color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700 }}>Customized</span>
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
                  minWidth: '135px',
                  padding: '14px',
                  borderRadius: '18px',
                  border: isSelected ? '1.5px solid var(--purple-primary)' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(139, 92, 246, 0.16)' : 'var(--bg-card)',
                  boxShadow: isSelected ? '0 4px 20px rgba(139, 92, 246, 0.25)' : 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                  transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '11px',
                    background: isSelected ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {g.icon}
                </div>
                <div>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>{g.label}</span>
                  <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{g.sub}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's Metabolic Overview Grid */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Daily Metrics</h3>
          <span style={{ color: 'var(--emerald-light)', fontSize: '12px', fontWeight: 700 }}>● Live Synced</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <MetricCard
            icon={<Flame size={19} />}
            value="480"
            label="Calories Burned"
            accentColor="var(--coral-primary)"
          />
          <MetricCard
            icon={<Timer size={19} />}
            value={`${workout.durationMins || 45}m`}
            label="Active Workout"
            accentColor="var(--emerald-primary)"
          />
          <MetricCard
            icon={<Footprints size={19} />}
            value="10,240"
            label="Steps Tracked"
            accentColor="var(--cyan-primary)"
          />
          <MetricCard
            icon={<Target size={19} />}
            value={`${user.goalProgressPercent || 68}%`}
            label="Weekly Target"
            accentColor="var(--purple-primary)"
          />
        </div>
      </div>

      {/* Interactive Quick-Tap Hydration Station */}
      <div
        className="glass-card glow-card-coral"
        style={{
          padding: '18px 20px',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        onClick={() => setWaterIntake(waterGlasses + 1)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25) 0%, rgba(59, 130, 246, 0.15) 100%)',
              border: '1px solid rgba(6, 182, 212, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cyan-light)',
              boxShadow: '0 4px 16px rgba(6, 182, 212, 0.25)',
            }}
          >
            <Droplets size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Hydration Station</span>
              <span className="badge-pill badge-cyan">{waterPercent}%</span>
            </div>
            <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
              {waterGlasses} of {waterTarget} glasses consumed today
            </span>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setWaterIntake(waterGlasses + 1);
          }}
          style={{
            background: 'var(--gradient-cyan-purple)',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '8px 14px',
            fontWeight: 800,
            fontSize: '12.5px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(6, 182, 212, 0.3)',
          }}
        >
          +1 Glass
        </button>
      </div>

      {/* Routine & AI Plan Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Active Routine</h3>
          <button
            onClick={() => setActiveTab(planTab === 'diet' ? 'diet' : 'workout')}
            style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            Manage Plan
          </button>
        </div>

        <div className="glass-card" style={{ padding: '18px', borderRadius: '22px' }}>
          {/* Sub Tab Switcher */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', padding: '4px', marginBottom: '16px' }}>
            <button
              onClick={() => setPlanTab('workout')}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: planTab === 'workout' ? 'var(--gradient-purple)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12.5px',
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: planTab === 'workout' ? 'var(--shadow-purple)' : 'none',
              }}
            >
              <Dumbbell size={14} /> Workout
            </button>
            <button
              onClick={() => setPlanTab('diet')}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: planTab === 'diet' ? 'var(--gradient-purple)' : 'transparent',
                color: '#fff',
                fontWeight: 700,
                fontSize: '12.5px',
                fontFamily: 'var(--font-heading)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
                boxShadow: planTab === 'diet' ? 'var(--shadow-purple)' : 'none',
              }}
            >
              <Utensils size={14} /> Nutrition
            </button>
          </div>

          {planTab === 'workout' && (
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
              <div
                style={{
                  width: '90px',
                  height: '84px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  position: 'relative',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img
                  src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=300&q=80"
                  alt="Workout Preview"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <span style={{ fontSize: '10.5px', color: 'var(--purple-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Today's Session
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{workout.title}</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>{workout.focusAreas.join(' • ')}</p>
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px', fontSize: '11px', color: 'var(--text-muted)' }}>
                  <span>⏱ {workout.durationMins} min</span>
                  <span>🔥 {workout.targetCalories} kcal</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveTab('workout');
                  setIsWorkoutModalOpen(true);
                }}
                className="glow-active"
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '14px',
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
                <span style={{ fontSize: '10.5px', color: 'var(--emerald-light)', fontWeight: 800, textTransform: 'uppercase' }}>
                  Caloric Blueprint
                </span>
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginTop: '2px' }}>{dietPlan.title}</h4>
                <p style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                  Target: <strong>{dietPlan.dailyCaloriesTarget} kcal</strong> ({dietPlan.proteinTarget}g Protein)
                </p>
              </div>
              <button
                onClick={() => setActiveTab('diet')}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '9px 16px',
                  color: '#fff',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span>View</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
