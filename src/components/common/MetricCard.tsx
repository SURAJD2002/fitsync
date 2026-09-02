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
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        borderRadius: '20px',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(18, 22, 35, 0.75)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: `${accentColor}1F`,
            border: `1px solid ${accentColor}4D`,
            color: accentColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 4px 12px ${accentColor}26`,
          }}
        >
          {icon}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '20px', fontWeight: 900, color: '#ffffff', lineHeight: 1.1, fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            {value}
          </span>
          <span style={{ fontSize: '11.5px', fontWeight: 600, color: 'var(--text-secondary)' }}>
            {label}
          </span>
        </div>
      </div>

      {subValue && (
        <span style={{ fontSize: '10.5px', color: accentColor, fontWeight: 800, letterSpacing: '0.02em' }}>
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
