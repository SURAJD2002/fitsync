import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { SignUpForm } from './components/auth/SignUpForm';
import { LoginForm } from './components/auth/LoginForm';
import { BodyDetailsFlow } from './components/onboarding/BodyDetailsFlow';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { HomeDashboard } from './components/dashboard/HomeDashboard';
import { WorkoutScreen } from './components/workout/WorkoutScreen';
import { DietScreen } from './components/diet/DietScreen';
import { ProgressScreen } from './components/progress/ProgressScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { Smartphone, Monitor } from 'lucide-react';

const MainContent: React.FC = () => {
  const { authMode } = useAuth();
  const { activeTab } = useFitness();

  if (authMode === 'signup') {
    return <SignUpForm />;
  }

  if (authMode === 'login') {
    return <LoginForm />;
  }

  if (authMode === 'onboarding') {
    return <BodyDetailsFlow />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {activeTab === 'home' && <HomeDashboard />}
        {activeTab === 'workout' && <WorkoutScreen />}
        {activeTab === 'diet' && <DietScreen />}
        {activeTab === 'progress' && <ProgressScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
      </main>
      <BottomNav />
    </div>
  );
};

export function App() {
  const [isMobileFrame, setIsMobileFrame] = useState(true);

  return (
    <AuthProvider>
      <FitnessProvider>
        <div className={isMobileFrame ? 'viewport-mode-desktop' : ''} style={{ width: '100%', minHeight: '100vh', background: '#050608', position: 'relative' }}>
          {/* Desktop Frame Switcher Toggle Bar */}
          <div
            style={{
              position: 'fixed',
              top: '12px',
              right: '12px',
              zIndex: 9999,
              background: 'rgba(24, 26, 38, 0.9)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '99px',
              padding: '4px',
              display: 'flex',
              gap: '4px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
            }}
          >
            <button
              onClick={() => setIsMobileFrame(true)}
              style={{
                background: isMobileFrame ? 'var(--purple-primary)' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '99px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Smartphone size={14} /> Mobile Frame
            </button>
            <button
              onClick={() => setIsMobileFrame(false)}
              style={{
                background: !isMobileFrame ? 'var(--purple-primary)' : 'transparent',
                color: '#fff',
                border: 'none',
                borderRadius: '99px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Monitor size={14} /> Full Width
            </button>
          </div>

          <div className="fitsync-app-container">
            <MainContent />
          </div>
        </div>
      </FitnessProvider>
    </AuthProvider>
  );
}

export default App;
