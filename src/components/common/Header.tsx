import React, { useState } from 'react';
import { Menu, Bell, ChevronLeft, Settings, X, Flame, Sparkles } from 'lucide-react';
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.02em' }}>
              Welcome back 👋
            </span>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
              {user.fullName || 'Athlete'}
            </span>
          </div>
        );
      case 'workout':
        return 'Workout Routine';
      case 'diet':
        return 'Diet & Macros';
      case 'progress':
        return 'Analytics & Progress';
      case 'profile':
        return 'Athlete Profile';
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
          padding: '16px 18px',
          background: 'rgba(7, 8, 12, 0.88)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showBack ? (
            <button
              onClick={onBack}
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                width: '38px',
                height: '38px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <ChevronLeft size={20} />
            </button>
          ) : (
            <button
              onClick={() => setIsDrawerOpen(true)}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                width: '38px',
                height: '38px',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.15s ease',
              }}
            >
              <Menu size={20} />
            </button>
          )}

          <div style={{ fontSize: '18px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
            {getTitleContent()}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {showStreak && activeTab !== 'profile' && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'linear-gradient(135deg, rgba(249, 115, 22, 0.16) 0%, rgba(251, 191, 36, 0.08) 100%)',
                border: '1px solid rgba(249, 115, 22, 0.35)',
                padding: '5px 10px',
                borderRadius: '99px',
                fontSize: '12px',
                fontWeight: 800,
                color: '#fb923c',
                boxShadow: '0 2px 12px rgba(249, 115, 22, 0.2)',
              }}
            >
              <Flame size={15} fill="#f97316" color="#f97316" className="flame-animated" />
              <span>{user.streakDays || 1}d</span>
            </div>
          )}

          {activeTab === 'profile' ? (
            <button
              style={{
                background: 'rgba(255, 255, 255, 0.07)',
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
              <Settings size={18} />
            </button>
          ) : (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
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
                  position: 'relative',
                }}
              >
                <Bell size={18} />
                <span
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'var(--purple-primary)',
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    boxShadow: '0 0 8px var(--purple-primary)',
                  }}
                />
              </button>

              {notificationsOpen && (
                <div
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: '46px',
                    width: '270px',
                    background: 'rgba(18, 22, 35, 0.96)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '18px',
                    padding: '14px',
                    boxShadow: 'var(--shadow-lg)',
                    zIndex: 50,
                  }}
                >
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 800,
                      marginBottom: '10px',
                      borderBottom: '1px solid var(--border-subtle)',
                      paddingBottom: '8px',
                      color: 'var(--text-main)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <Sparkles size={14} color="var(--purple-light)" />
                    Activity Updates
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
                    <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)', padding: '8px 10px', borderRadius: '10px' }}>
                      ⚡ <strong>Push Day Workout</strong> scheduled for today.
                    </div>
                    <div style={{ background: 'rgba(6, 182, 212, 0.1)', border: '1px solid rgba(6, 182, 212, 0.2)', padding: '8px 10px', borderRadius: '10px' }}>
                      💧 Drink 2 more glasses of water to hit target.
                    </div>
                    <div style={{ background: 'rgba(249, 115, 22, 0.1)', border: '1px solid rgba(249, 115, 22, 0.2)', padding: '8px 10px', borderRadius: '10px' }}>
                      🔥 Streak active: <strong>{user.streakDays || 1} Days</strong> on fire!
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div
            onClick={() => setActiveTab('profile')}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '14px',
              overflow: 'hidden',
              border: '2px solid var(--purple-primary)',
              boxShadow: '0 0 12px var(--purple-glow)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease',
            }}
          >
            <img
              src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
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
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(12px)',
            zIndex: 100,
            display: 'flex',
          }}
        >
          <div
            style={{
              width: '290px',
              height: '100%',
              background: 'rgba(14, 17, 27, 0.98)',
              borderRight: '1px solid var(--border-glass)',
              padding: '24px 20px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '10px 0 40px rgba(0,0,0,0.8)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      background: 'var(--gradient-purple)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      color: '#fff',
                      boxShadow: 'var(--shadow-purple)',
                    }}
                  >
                    FS
                  </div>
                  <span style={{ fontSize: '20px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#fff' }}>FitSync</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '10px',
                    width: '32px',
                    height: '32px',
                    color: '#fff',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
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
                      padding: '13px 16px',
                      borderRadius: '14px',
                      border: activeTab === tab ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid transparent',
                      background: activeTab === tab ? 'var(--gradient-purple)' : 'transparent',
                      color: '#fff',
                      fontSize: '15px',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: activeTab === tab ? 800 : 600,
                      textTransform: 'capitalize',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      boxShadow: activeTab === tab ? 'var(--shadow-purple)' : 'none',
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-dim)', textAlign: 'center', padding: '10px 0', borderTop: '1px solid var(--border-subtle)' }}>
              FitSync AI SaaS • v1.0.0 Pro
            </div>
          </div>
          <div style={{ flex: 1 }} onClick={() => setIsDrawerOpen(false)} />
        </div>
      )}
    </>
  );
};
