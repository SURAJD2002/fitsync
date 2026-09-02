import React, { useState } from 'react';
import { ChevronLeft, ArrowRight, Check, Info, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { BodyProfile, BodyType, UnitSystem } from '../../types';
import { Button } from '../common/Button';

export const BodyDetailsFlow: React.FC = () => {
  const { bodyProfile, saveOnboardingProfile, setAuthMode } = useAuth();

  const [activeStep, setActiveStep] = useState<number>(1);
  const [age, setAge] = useState<number>(bodyProfile.age || 25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>(bodyProfile.gender || 'Male');
  const [height, setHeight] = useState<number>(bodyProfile.height || 175);
  const [weight, setWeight] = useState<number>(bodyProfile.weight || 72);
  const [bodyType, setBodyType] = useState<BodyType>(bodyProfile.bodyType || 'mesomorph');
  const [unit, setUnit] = useState<UnitSystem>(bodyProfile.unit || 'cm');

  const [measurements, setMeasurements] = useState(bodyProfile.measurements || {
    chest: 102,
    waist: 81,
    hips: 96,
    arms: 34,
    thighs: 58,
  });

  const [photos] = useState(bodyProfile.photos || {
    front: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    side: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80',
    back: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
  });

  const handleContinue = () => {
    if (activeStep < 4) {
      setActiveStep((prev) => prev + 1);
    } else {
      const updatedProfile: BodyProfile = {
        age,
        gender,
        height,
        weight,
        bodyType,
        unit,
        measurements,
        photos,
      };
      saveOnboardingProfile(updatedProfile);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', width: '100%', background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.1) 0%, transparent 60%), var(--bg-dark)', padding: '16px 18px 40px' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => {
            if (activeStep > 1) setActiveStep((prev) => prev - 1);
            else setAuthMode('signup');
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            width: '38px',
            height: '38px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
          Athlete Onboarding
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '99px', padding: '5px 10px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <Sparkles size={12} color="var(--purple-light)" />
          <span>Step {activeStep}/4</span>
        </div>
      </div>

      {/* 4-Step Progress Line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', left: '12%', right: '12%', height: '2px', background: 'rgba(255,255,255,0.08)', zIndex: 0 }} />

        {[
          { step: 1, label: 'Metrics' },
          { step: 2, label: 'Somatotype' },
          { step: 3, label: 'Biometrics' },
          { step: 4, label: 'AI Plan' },
        ].map((item) => {
          const isActive = item.step === activeStep;
          const isDone = item.step < activeStep;
          return (
            <div
              key={item.step}
              onClick={() => setActiveStep(item.step)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', zIndex: 1, cursor: 'pointer' }}
            >
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '12px',
                  background: isActive || isDone ? 'var(--gradient-purple)' : 'var(--bg-surface)',
                  border: `1.5px solid ${isActive ? 'var(--purple-light)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 900,
                  boxShadow: isActive ? '0 0 14px var(--purple-glow)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                {isDone ? <Check size={16} strokeWidth={3} /> : item.step}
              </div>
              <span style={{ fontSize: '11px', fontWeight: isActive ? 800 : 600, color: isActive ? '#fff' : 'var(--text-dim)' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Step Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Basic Information Section */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '22px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>Physical Parameters</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '12px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Age</span>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '17px', fontWeight: 900, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 60 }, (_, i) => i + 16).map((num) => (
                  <option key={num} value={num} style={{ background: '#0b0d14' }}>{num} yrs</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '12px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '17px', fontWeight: 900, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Male" style={{ background: '#0b0d14' }}>Male</option>
                <option value="Female" style={{ background: '#0b0d14' }}>Female</option>
                <option value="Other" style={{ background: '#0b0d14' }}>Other</option>
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '12px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Height</span>
              <select
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '17px', fontWeight: 900, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 80 }, (_, i) => i + 140).map((h) => (
                  <option key={h} value={h} style={{ background: '#0b0d14' }}>{h} cm</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: '16px', padding: '12px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', fontWeight: 600 }}>Weight</span>
              <select
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '17px', fontWeight: 900, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 100 }, (_, i) => i + 40).map((w) => (
                  <option key={w} value={w} style={{ background: '#0b0d14' }}>{w} kg</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Somatotype Body Type Section */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Somatotype Classification</h2>
            <Info size={16} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '14px' }}>Determines metabolism and muscle building response</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'ectomorph', title: 'Ectomorph', desc: 'Fast Meta', emoji: '🏃‍♂️' },
              { id: 'mesomorph', title: 'Mesomorph', desc: 'Athletic', emoji: '🏋️‍♂️' },
              { id: 'endomorph', title: 'Endomorph', desc: 'Power', emoji: '🤸‍♂️' },
              { id: 'custom', title: 'Custom', desc: 'Adaptive', emoji: '⚙️' },
            ].map((type) => {
              const isSelected = bodyType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setBodyType(type.id as BodyType)}
                  style={{
                    background: isSelected ? 'rgba(139, 92, 246, 0.2)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isSelected ? 'var(--purple-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: '16px',
                    padding: '14px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    boxShadow: isSelected ? '0 0 16px var(--purple-glow)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  <div style={{ fontSize: '24px', marginBottom: '4px' }}>{type.emoji}</div>
                  <span style={{ fontSize: '11.5px', fontWeight: 800, color: '#fff', display: 'block' }}>{type.title}</span>
                  <span style={{ fontSize: '9.5px', color: 'var(--text-secondary)' }}>{type.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Measurements Section */}
        <div className="glass-card" style={{ padding: '20px', borderRadius: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Circumference Matrix</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Optional for precise body composition modeling</p>
            </div>

            {/* Unit System Toggle */}
            <div style={{ display: 'flex', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '99px', padding: '2px' }}>
              <button
                onClick={() => setUnit('cm')}
                style={{ background: unit === 'cm' ? 'var(--gradient-purple)' : 'transparent', color: '#fff', border: 'none', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                cm
              </button>
              <button
                onClick={() => setUnit('in')}
                style={{ background: unit === 'in' ? 'var(--gradient-purple)' : 'transparent', color: '#fff', border: 'none', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
              >
                in
              </button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
            {[
              { key: 'chest', label: 'Chest' },
              { key: 'waist', label: 'Waist' },
              { key: 'hips', label: 'Hips' },
              { key: 'arms', label: 'Arms' },
              { key: 'thighs', label: 'Thighs' },
            ].map((m) => (
              <div key={m.key} style={{ background: 'var(--bg-surface)', borderRadius: '14px', padding: '10px 4px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>{m.label}</span>
                <input
                  type="number"
                  value={measurements[m.key as keyof typeof measurements]}
                  onChange={(e) => setMeasurements({ ...measurements, [m.key]: Number(e.target.value) })}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '15px', fontWeight: 900, textAlign: 'center', width: '100%', outline: 'none' }}
                />
                <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{unit}</span>
              </div>
            ))}
          </div>
        </div>

        <Button onClick={handleContinue} icon={<ArrowRight size={18} />}>
          {activeStep === 4 ? 'Complete Onboarding 🎉' : 'Proceed to Next Step'}
        </Button>
      </div>
    </div>
  );
};
