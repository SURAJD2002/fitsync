import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';
import { Dumbbell, TrendingDown } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { Modal } from '../common/Modal';

export const ProgressScreen: React.FC = () => {
  const { weightHistory, bodyComposition, progressPhotos } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'body_stats' | 'performance' | 'photos'>('overview');
  const [timePeriod, setTimePeriod] = useState<string>('This Month');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weightKg : 72.4;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 18px 30px' }} className="animate-fade-in">
      {/* Sub Navigation Bar */}
      <div className="sub-tabs-container">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'body_stats', label: 'Body Stats' },
          { id: 'performance', label: 'Performance' },
          { id: 'photos', label: 'Photos' },
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

      {/* Hero Analytics Overview Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
              Metabolic Analytics
            </h3>
            <span style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>Real-time physiological trends</span>
          </div>

          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{
              background: 'rgba(22, 26, 41, 0.85)',
              border: '1px solid var(--border-glass)',
              color: '#fff',
              padding: '6px 14px',
              borderRadius: '99px',
              fontSize: '11.5px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-inner-glow)',
            }}
          >
            <option value="This Week" style={{ background: '#0b0d14' }}>1 Week</option>
            <option value="This Month" style={{ background: '#0b0d14' }}>1 Month</option>
            <option value="3 Months" style={{ background: '#0b0d14' }}>3 Months</option>
            <option value="1 Year" style={{ background: '#0b0d14' }}>1 Year</option>
          </select>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
          <div className="glass-card" style={{ padding: '16px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: 'var(--purple-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Dumbbell size={16} />
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Workouts Logged</span>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', display: 'block', fontFamily: 'var(--font-heading)' }}>48</span>
            <span style={{ fontSize: '10.5px', color: 'var(--purple-light)', fontWeight: 700 }}>+12% vs last month</span>
          </div>

          <div className="glass-card" style={{ padding: '16px', borderRadius: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '10px',
                  background: 'rgba(6, 182, 212, 0.2)',
                  color: 'var(--cyan-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <TrendingDown size={16} />
              </div>
              <span style={{ fontSize: '11.5px', color: 'var(--text-muted)', fontWeight: 600 }}>Current Weight</span>
            </div>
            <span style={{ fontSize: '22px', fontWeight: 900, color: '#fff', display: 'block', fontFamily: 'var(--font-heading)' }}>
              {latestWeight} kg
            </span>
            <span style={{ fontSize: '10.5px', color: 'var(--emerald-light)', fontWeight: 700 }}>-2.6 kg trend</span>
          </div>
        </div>

        {/* Interactive Gradient Area Weight Chart */}
        <div className="glass-card glow-card-purple" style={{ padding: '18px 14px 10px', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 14px', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Weight Progress Trajectory</span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)', display: 'block' }}>ISO Time-Series Logged</span>
            </div>
            <span className="badge-pill badge-purple">{latestWeight} kg</span>
          </div>

          <div style={{ width: '100%', height: '170px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightHistory}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--purple-primary)" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="var(--purple-primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10.5} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(14, 17, 27, 0.95)',
                    borderColor: 'var(--border-glass)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
                  }}
                  itemStyle={{ color: '#fff', fontWeight: 700 }}
                />
                <Area
                  type="monotone"
                  dataKey="weightKg"
                  stroke="var(--purple-primary)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#weightGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Body Composition Details */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Body Composition</h3>
          <span style={{ color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700 }}>InBody Scan</span>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '22px', display: 'flex', gap: '18px', alignItems: 'center' }}>
          {/* Radial Fat Metric */}
          <div style={{ position: 'relative', width: '90px', height: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="90" height="90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="rgba(255,255,255,0.06)" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="var(--purple-primary)" strokeWidth="12" fill="none" strokeDasharray="160 240" strokeDashoffset="0" strokeLinecap="round" />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>
                {bodyComposition.bodyFatPercent}%
              </span>
              <span style={{ fontSize: '9px', color: 'var(--emerald-light)', fontWeight: 700 }}>Athletic</span>
            </div>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '12px' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Muscle Mass</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>{bodyComposition.muscleMassKg} kg</span>
              <span style={{ color: 'var(--emerald-light)', fontSize: '10.5px', fontWeight: 700 }}>+{bodyComposition.muscleMassChange} kg</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Body Fat</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>{bodyComposition.bodyFatPercent}%</span>
              <span style={{ color: 'var(--emerald-light)', fontSize: '10.5px', fontWeight: 700 }}>{bodyComposition.bodyFatChange}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Total Water</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>{bodyComposition.waterPercent}%</span>
              <span style={{ color: 'var(--emerald-light)', fontSize: '10.5px', fontWeight: 700 }}>+{bodyComposition.waterChange}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '11px' }}>Bone Mass</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: '14px' }}>{bodyComposition.boneMassKg} kg</span>
              <span style={{ color: 'var(--emerald-light)', fontSize: '10.5px', fontWeight: 700 }}>+{bodyComposition.boneMassChange} kg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Photos Gallery */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Transformation Gallery</h3>
          <span style={{ color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700 }}>4 Photos</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {progressPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                height: '115px',
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-sm)',
                transition: 'transform 0.15s ease',
              }}
            >
              <img src={photo.imageUrl} alt={photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {photo.isLatest && (
                <span
                  style={{
                    position: 'absolute',
                    top: '5px',
                    left: '5px',
                    background: 'var(--gradient-purple)',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 900,
                    padding: '2px 6px',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px var(--purple-glow)',
                  }}
                >
                  Current
                </span>
              )}
              <span
                style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  background: 'rgba(7, 8, 12, 0.75)',
                  backdropFilter: 'blur(6px)',
                  color: '#fff',
                  fontSize: '9px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '6px',
                }}
              >
                {photo.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title={`Transformation: ${selectedPhoto.label}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ height: '320px', borderRadius: '22px', overflow: 'hidden', border: '1px solid var(--border-glass)' }}>
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
