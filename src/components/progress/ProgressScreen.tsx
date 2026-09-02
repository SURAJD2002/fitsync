import React, { useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Award, Trophy, Dumbbell, Flame, TrendingDown } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { MetricCard } from '../common/MetricCard';
import { Modal } from '../common/Modal';

export const ProgressScreen: React.FC = () => {
  const { weightHistory, bodyComposition, progressPhotos, achievements } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'body_stats' | 'performance' | 'photos'>('overview');
  const [timePeriod, setTimePeriod] = useState<string>('This Month');
  const [selectedPhoto, setSelectedPhoto] = useState<any | null>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 20px 30px' }}>
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

      {/* Your Progress Overview Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Your Progress Overview</h3>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
              color: '#fff',
              padding: '6px 12px',
              borderRadius: '99px',
              fontSize: '11px',
              fontWeight: 700,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="This Week" style={{ background: '#181a26' }}>This Week</option>
            <option value="This Month" style={{ background: '#181a26' }}>This Month</option>
            <option value="3 Months" style={{ background: '#181a26' }}>3 Months</option>
            <option value="1 Year" style={{ background: '#181a26' }}>1 Year</option>
          </select>
        </div>

        {/* 4 Summary Stat Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Dumbbell size={14} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Workouts Completed</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', display: 'block' }}>48</span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{timePeriod}</span>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingDown size={14} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Weight</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', display: 'block' }}>72.4 kg</span>
            <span style={{ fontSize: '10px', color: 'var(--color-green)', fontWeight: 700 }}>-2.6 kg</span>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(249, 115, 22, 0.15)', color: 'var(--color-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Flame size={14} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Calories Burned</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', display: 'block' }}>18,560</span>
            <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>{timePeriod}</span>
          </div>

          <div className="glass-card" style={{ padding: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', color: 'var(--color-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={14} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Goal Progress</span>
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, color: '#fff', display: 'block' }}>85%</span>
            <div style={{ height: '4px', background: 'var(--bg-surface)', borderRadius: '99px', overflow: 'hidden', marginTop: '6px' }}>
              <div style={{ width: '85%', height: '100%', background: 'var(--purple-primary)' }} />
            </div>
          </div>
        </div>

        {/* Interactive Recharts Weight Line Chart */}
        <div className="glass-card" style={{ padding: '16px 12px 8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 8px 12px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>Weight Progress</span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--purple-light)' }}>72.4 kg <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>(29 May)</span></span>
          </div>

          <div style={{ width: '100%', height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightHistory}>
                <XAxis dataKey="date" stroke="var(--text-dim)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', borderColor: 'var(--border-subtle)', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line
                  type="monotone"
                  dataKey="weightKg"
                  stroke="var(--purple-primary)"
                  strokeWidth={3}
                  dot={{ r: 4, fill: 'var(--purple-light)', stroke: 'var(--purple-primary)' }}
                  activeDot={{ r: 7, fill: '#fff', stroke: 'var(--purple-primary)', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Body Composition Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Body Composition</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View Details &gt;
          </button>
        </div>

        <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="var(--bg-surface)" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="var(--purple-primary)" strokeWidth="12" fill="none" strokeDasharray="160 240" strokeDashoffset="0" />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>{bodyComposition.bodyFatPercent}%</span>
              <span style={{ fontSize: '8px', color: 'var(--color-green)', fontWeight: 700 }}>Good</span>
            </div>
          </div>

          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '11px' }}>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Muscle Mass</span>
              <span style={{ color: '#fff', fontWeight: 800 }}>{bodyComposition.muscleMassKg} kg</span>
              <span style={{ color: 'var(--color-green)', fontSize: '10px', display: 'block', fontWeight: 700 }}>+{bodyComposition.muscleMassChange} kg</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Body Fat</span>
              <span style={{ color: '#fff', fontWeight: 800 }}>{bodyComposition.bodyFatPercent}%</span>
              <span style={{ color: 'var(--color-green)', fontSize: '10px', display: 'block', fontWeight: 700 }}>{bodyComposition.bodyFatChange}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Water</span>
              <span style={{ color: '#fff', fontWeight: 800 }}>{bodyComposition.waterPercent}%</span>
              <span style={{ color: 'var(--color-green)', fontSize: '10px', display: 'block', fontWeight: 700 }}>+{bodyComposition.waterChange}%</span>
            </div>
            <div>
              <span style={{ color: 'var(--text-dim)', display: 'block' }}>Bone Mass</span>
              <span style={{ color: '#fff', fontWeight: 800 }}>{bodyComposition.boneMassKg} kg</span>
              <span style={{ color: 'var(--color-green)', fontSize: '10px', display: 'block', fontWeight: 700 }}>+{bodyComposition.boneMassChange} kg</span>
            </div>
          </div>
        </div>

        {/* 4 Sparkline Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          <MetricCard icon={<Dumbbell size={14} />} value="72.4" label="Weight" subValue="-2.6 kg" showSparkline />
          <MetricCard icon={<Flame size={14} />} value="23.1" label="BMI" subValue="Normal" showSparkline />
          <MetricCard icon={<Trophy size={14} />} value="102" label="Chest" subValue="+2 cm" showSparkline />
          <MetricCard icon={<Award size={14} />} value="81" label="Waist" subValue="-3 cm" showSparkline />
        </div>
      </div>

      {/* Progress Photos Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Progress Photos</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View All &gt;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
          {progressPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setSelectedPhoto(photo)}
              style={{
                height: '110px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                position: 'relative',
                border: '1px solid var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <img src={photo.imageUrl} alt={photo.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {photo.isLatest && (
                <span style={{ position: 'absolute', top: '4px', left: '4px', background: 'var(--purple-primary)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  Latest
                </span>
              )}
              <span style={{ position: 'absolute', bottom: '4px', right: '4px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', fontWeight: 600, padding: '2px 6px', borderRadius: '4px' }}>
                {photo.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Achievements</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View All &gt;
          </button>
        </div>

        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }} className="sub-tabs-container">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="glass-card"
              style={{
                minWidth: '110px',
                padding: '12px 8px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.3) 0%, rgba(147, 51, 234, 0.1) 100%)',
                  border: '1px solid var(--purple-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--purple-light)',
                }}
              >
                <Award size={20} />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: '#fff', lineHeight: 1.1 }}>{ach.title}</span>
              <span style={{ fontSize: '9px', color: 'var(--text-dim)' }}>{ach.subtitle}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Photo Preview Modal */}
      {selectedPhoto && (
        <Modal isOpen={!!selectedPhoto} onClose={() => setSelectedPhoto(null)} title={`Progress Photo: ${selectedPhoto.label}`}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ height: '300px', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
              <img src={selectedPhoto.imageUrl} alt={selectedPhoto.label} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
