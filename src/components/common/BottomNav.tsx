import React from 'react';
import { Home, Dumbbell, Utensils, BarChart3, User } from 'lucide-react';
import { useFitness, type MainTab } from '../../context/FitnessContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useFitness();

  const navItems: { id: MainTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Home size={20} /> },
    { id: 'workout', label: 'Workout', icon: <Dumbbell size={20} /> },
    { id: 'diet', label: 'Diet', icon: <Utensils size={20} /> },
    { id: 'progress', label: 'Progress', icon: <BarChart3 size={20} /> },
    { id: 'profile', label: 'Profile', icon: <User size={20} /> },
  ];

  return (
    <nav
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        height: '64px',
        background: 'rgba(18, 20, 28, 0.95)',
        backdropFilter: 'blur(16px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 40,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
      }}
    >
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '3px',
              background: 'transparent',
              border: 'none',
              color: isActive ? 'var(--purple-primary)' : 'var(--text-dim)',
              fontSize: '11px',
              fontWeight: isActive ? 700 : 500,
              cursor: 'pointer',
              flex: 1,
              height: '100%',
              transition: 'color 0.15s ease, transform 0.15s ease',
            }}
          >
            <div
              style={{
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s ease',
              }}
            >
              {item.icon}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
