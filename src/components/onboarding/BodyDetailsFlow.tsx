import React, { useState } from 'react';
import { ChevronLeft, HelpCircle, ArrowRight, Check, Plus, Shield, Info } from 'lucide-react';
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

  const [photos, setPhotos] = useState(bodyProfile.photos || {
    front: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=400&q=80',
    side: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=400&q=80',
    back: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=400&q=80',
  });

  const handlePhotoUpload = (key: 'front' | 'side' | 'back') => {
    const mockImage = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
    setPhotos((prev) => ({ ...prev, [key]: mockImage }));
  };

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
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '16px 20px 40px' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => {
            if (activeStep > 1) setActiveStep((prev) => prev - 1);
            else setAuthMode('signup');
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>Your Body Details</h1>

        <button style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid var(--border-subtle)', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
          <HelpCircle size={13} /> Need Help?
        </button>
      </div>

      {/* 4-Step Progress Indicator */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '16px', left: '10%', right: '10%', height: '2px', background: 'var(--border-subtle)', zIndex: 0 }} />

        {[
          { step: 1, label: '1. Body Details' },
          { step: 2, label: '2. Goals' },
          { step: 3, label: '3. Preferences' },
          { step: 4, label: '4. AI Plan' },
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
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isActive || isDone ? 'var(--gradient-purple)' : 'var(--bg-card)',
                  border: `2px solid ${isActive ? 'var(--purple-primary)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 700,
                }}
              >
                {isDone ? <Check size={16} /> : item.step}
              </div>
              <span style={{ fontSize: '10px', fontWeight: isActive ? 700 : 500, color: isActive ? '#fff' : 'var(--text-dim)' }}>
                {item.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Main Step Content */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Basic Information Section */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff', marginBottom: '14px' }}>Basic Information</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Age</span>
              <select
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 60 }, (_, i) => i + 16).map((num) => (
                  <option key={num} value={num} style={{ background: '#181a26' }}>{num}</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Gender</span>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as any)}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                <option value="Male" style={{ background: '#181a26' }}>Male</option>
                <option value="Female" style={{ background: '#181a26' }}>Female</option>
                <option value="Other" style={{ background: '#181a26' }}>Other</option>
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Height</span>
              <select
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 80 }, (_, i) => i + 140).map((h) => (
                  <option key={h} value={h} style={{ background: '#181a26' }}>{h} cm</option>
                ))}
              </select>
            </div>

            <div style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 14px', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Weight</span>
              <select
                value={weight}
                onChange={(e) => setWeight(Number(e.target.value))}
                style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '16px', fontWeight: 800, width: '100%', outline: 'none', cursor: 'pointer' }}
              >
                {Array.from({ length: 100 }, (_, i) => i + 40).map((w) => (
                  <option key={w} value={w} style={{ background: '#181a26' }}>{w} kg</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Body Type Section */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Body Type</h2>
            <Info size={16} color="var(--text-muted)" />
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>Select the option that best describes your body</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {[
              { id: 'ectomorph', title: 'Ectomorph', desc: 'Lean' },
              { id: 'mesomorph', title: 'Mesomorph', desc: 'Athletic' },
              { id: 'endomorph', title: 'Endomorph', desc: 'Round' },
              { id: 'custom', title: 'Custom', desc: 'Tailored' },
            ].map((type) => {
              const isSelected = bodyType === type.id;
              return (
                <div
                  key={type.id}
                  onClick={() => setBodyType(type.id as BodyType)}
                  style={{
                    background: isSelected ? 'rgba(139, 92, 246, 0.15)' : 'var(--bg-surface)',
                    border: `1.5px solid ${isSelected ? 'var(--purple-primary)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 6px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected && (
                    <div style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--purple-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                      <Check size={10} />
                    </div>
                  )}
                  <div style={{ height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '6px' }}>
                    {type.id === 'mesomorph' ? '🏋️‍♂️' : type.id === 'ectomorph' ? '🏃‍♂️' : type.id === 'endomorph' ? '🤸‍♂️' : '⚙️'}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', display: 'block' }}>{type.title}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{type.desc}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Body Measurements Section */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Body Measurements <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>(Optional)</span></h2>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Add your measurements for more accurate insights</p>
            </div>

            {/* Unit System Toggle */}
            <div style={{ display: 'flex', background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '99px', padding: '2px' }}>
              <button
                onClick={() => setUnit('cm')}
                style={{ background: unit === 'cm' ? 'var(--purple-primary)' : 'transparent', color: '#fff', border: 'none', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
              >
                cm
              </button>
              <button
                onClick={() => setUnit('in')}
                style={{ background: unit === 'in' ? 'var(--purple-primary)' : 'transparent', color: '#fff', border: 'none', borderRadius: '99px', padding: '4px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}
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
              <div key={m.key} style={{ background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', padding: '10px 4px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>{m.label}</span>
                <input
                  type="number"
                  value={measurements[m.key as keyof typeof measurements]}
                  onChange={(e) => setMeasurements({ ...measurements, [m.key]: Number(e.target.value) })}
                  style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '14px', fontWeight: 800, textAlign: 'center', width: '100%', outline: 'none' }}
                />
                <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{unit}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Body Photo Section */}
        <div className="glass-card" style={{ padding: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Body Photo <span style={{ fontSize: '11px', color: 'var(--text-dim)', fontWeight: 500 }}>(Optional)</span></h2>
            <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
              Why upload? <Info size={13} />
            </button>
          </div>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>Upload front, side & back photos for better AI analysis</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '14px' }}>
            {[
              { key: 'front', label: 'Front View' },
              { key: 'side', label: 'Side View' },
              { key: 'back', label: 'Back View' },
            ].map((p) => {
              const photoUrl = photos[p.key as keyof typeof photos];
              return (
                <div
                  key={p.key}
                  onClick={() => handlePhotoUpload(p.key as any)}
                  style={{
                    height: '140px',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px dashed var(--border-subtle)',
                    background: 'var(--bg-surface)',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  {photoUrl ? (
                    <img src={photoUrl} alt={p.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '28px', opacity: 0.5 }}>🧍‍♂️</span>
                  )}
                  <span style={{ position: 'absolute', top: '6px', fontSize: '10px', fontWeight: 700, color: '#fff', background: 'rgba(0,0,0,0.6)', padding: '2px 6px', borderRadius: '4px' }}>
                    {p.label}
                  </span>
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', width: '26px', height: '26px', borderRadius: '50%', background: 'var(--purple-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    <Plus size={16} />
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--text-dim)', justifyContent: 'center' }}>
            <Shield size={14} color="var(--purple-light)" />
            <span>Your photos are private and secure. Only used for AI analysis.</span>
          </div>
        </div>

        <Button onClick={handleContinue} icon={<ArrowRight size={18} />}>
          {activeStep === 4 ? 'Finish & Generate AI Plan' : 'Continue'}
        </Button>
      </div>
    </div>
  );
};
