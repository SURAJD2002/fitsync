import React from 'react';

interface MetricCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  accentColor?: string;
  subValue?: string;
  showSparkline?: boolean;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  value,
  label,
  accentColor = 'var(--purple-primary)',
  subValue,
  showSparkline = false,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="glass-card"
      style={{
        padding: '14px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: `${accentColor}1A`,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>
            {value}
          </span>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {label}
          </span>
        </div>
      </div>

      {subValue && (
        <span style={{ fontSize: '10px', color: accentColor, fontWeight: 700 }}>
          {subValue}
        </span>
      )}

      {showSparkline && (
        <div style={{ height: '24px', width: '100%', marginTop: '4px' }}>
          <svg width="100%" height="24" viewBox="0 0 100 24" preserveAspectRatio="none">
            <path
              d="M0,18 Q20,6 40,14 T80,8 T100,16"
              fill="none"
              stroke={accentColor}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}
    </div>
  );
};
