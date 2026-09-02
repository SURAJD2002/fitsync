import React, { useState } from 'react';
import { Menu, Bell, ChevronLeft, Settings, X, Flame } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness, type MainTab } from '../../context/FitnessContext';

interface HeaderProps {
  title?: string;
  showBack?: boolean;
  onBack?: () => void;
  showStreak?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  showBack = false,
  onBack,
  showStreak = true,
}) => {
  const { user } = useAuth();
  const { activeTab, setActiveTab } = useFitness();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const getTitleContent = () => {
    if (title) return title;
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col">
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600 }}>Good Morning 👋</span>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)' }}>{user.fullName}</span>
          </div>
        );
      case 'workout':
        return 'Workout';
      case 'diet':
        return 'Diet';
      case 'progress':
        return 'Progress';
      case 'profile':
        return 'Profile';
      default:
        return 'FitSync';
    }
  };

  return (
    <>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'rgba(9, 10, 14, 0.95)',
          backdropFilter: 'blur(12px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBack ? (
            <button
              onClick={onBack}
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
          ) : (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Menu size={22} />
            </button>
          )}

          <div style={{ fontSize: '18px', fontWeight: 800 }}>
            {getTitleContent()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {showStreak && activeTab !== 'profile' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(249, 115, 22, 0.12)',
                border: '1px solid rgba(249, 115, 22, 0.3)',
                padding: '4px 8px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 700,
                color: 'var(--color-orange)',
              }}
            >
              <Flame size={14} fill="var(--color-orange)" />
              <span>{user.streakDays}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>Day Streak</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <button
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
              <Settings size={18} />
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
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
                  position: 'relative',
                }}
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '2px',
                    background: '#ef4444',
                    color: '#fff',
                    fontSize: '9px',
                    fontWeight: 800,
                    width: '15px',
                    height: '15px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '44px',
                    width: '260px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    boxShadow: 'var(--shadow-card)',
                    zIndex: 50,
                  }}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, marginBottom: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '6px' }}>
                    Notifications
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '6px' }}>
                      ⚡ <strong>Push Day Workout</strong> is ready!
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '6px' }}>
                      💧 Drink 2 more glasses of water today.
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.04)', padding: '6px 8px', borderRadius: '6px' }}>
                      🏆 Achievement unlocked: <strong>3 Days Streak</strong>!
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            onClick={() => setActiveTab('profile')}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: '2px solid var(--purple-primary)',
              cursor: 'pointer',
            }}
          >
            <img
              src={user.avatarUrl}
              alt={user.fullName}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </header>

      {/* Drawer Overlay Menu */}
      {isDrawerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(8px)',
            zIndex: 100,
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '280px',
              height: '100%',
              background: 'var(--bg-card)',
              borderRight: '1px solid var(--border-subtle)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'var(--gradient-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      color: '#fff',
                    }}
                  >
                    FS
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>FitSync</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {(['home', 'workout', 'diet', 'progress', 'profile'] as MainTab[]).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => {
                      setActiveTab(tab);
                      setIsDrawerOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 14px',
                      borderRadius: 'var(--radius-md)',
                      border: 'none',
                      background: activeTab === tab ? 'var(--gradient-purple)' : 'transparent',
                      color: '#fff',
                      fontSize: '14px',
                      fontWeight: 700,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
              FitSync AI Fitness v1.0.0
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)} />
        </div>
      )}
    </>
  );
};
