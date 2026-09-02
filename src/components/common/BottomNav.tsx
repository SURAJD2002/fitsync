import React from 'react';
import { Home, Dumbbell, Utensils, BarChart3, User } from 'lucide-react';
import { useFitness, type MainTab } from '../../context/FitnessContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFitness();

  const navItems: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={20} strokeWidth={2.4} /> },
    { id: 'workout', label: 'Workout', icon: <Dumbbell size={20} strokeWidth={2.4} /> },
    { id: 'diet', label: 'Diet', icon: <Utensils size={20} strokeWidth={2.4} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 size={20} strokeWidth={2.4} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} strokeWidth={2.4} /> },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        maxWidth: '540px',
        margin: '0 auto',
        zIndex: 50,
        padding: '0 12px calc(10px + env(safe-area-inset-bottom, 0px)) 12px',
        pointerEvents: 'none',
      }}
    >
      <nav
        style={{
          height: '68px',
          background: 'rgba(14, 17, 27, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0 6px',
          boxShadow: '0 12px 36px rgba(0, 0, 0, 0.6), 0 0 20px rgba(139, 92, 246, 0.15)',
          pointerEvents: 'auto',
        }}
      >
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '4px',
                background: isActive ? 'rgba(139, 92, 246, 0.14)' : 'transparent',
                border: isActive ? '1px solid rgba(139, 92, 246, 0.3)' : '1px solid transparent',
                borderRadius: '18px',
                color: isActive ? '#ffffff' : 'var(--text-dim)',
                fontSize: '11px',
                fontFamily: 'var(--font-heading)',
                fontWeight: isActive ? 800 : 600,
                cursor: 'pointer',
                flex: 1,
                height: '52px',
                transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                padding: '4px 0',
              }}
            >
              <div
                style={{
                  color: isActive ? 'var(--purple-light)' : 'var(--text-dim)',
                  transform: isActive ? 'scale(1.12) translateY(-1px)' : 'scale(1)',
                  filter: isActive ? 'drop-shadow(0 0 8px rgba(139, 92, 246, 0.6))' : 'none',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </div>
              <span
                style={{
                  letterSpacing: '0.02em',
                  color: isActive ? '#f8fafc' : 'var(--text-muted)',
                  fontSize: '10.5px',
                }}
              >
                {item.label}
              </span>
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '3px',
                    width: '12px',
                    height: '2px',
                    borderRadius: '2px',
                    background: 'var(--gradient-purple)',
                    boxShadow: '0 0 6px var(--purple-primary)',
                  }}
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
};
