import React, { useState, useEffect, Suspense } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FitnessProvider, useFitness } from './context/FitnessContext';
import { Header } from './components/common/Header';
import { BottomNav } from './components/common/BottomNav';
import { Smartphone, Monitor, Loader2 } from 'lucide-react';
import { App as CapApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

// Lazy-loaded routes for optimized bundle splitting & reduced initial load
const HomeDashboard = React.lazy(() => import('./components/dashboard/HomeDashboard').then((m) => ({ default: m.HomeDashboard })));
const WorkoutScreen = React.lazy(() => import('./components/workout/WorkoutScreen').then((m) => ({ default: m.WorkoutScreen })));
const DietScreen = React.lazy(() => import('./components/diet/DietScreen').then((m) => ({ default: m.DietScreen })));
const ProgressScreen = React.lazy(() => import('./components/progress/ProgressScreen').then((m) => ({ default: m.ProgressScreen })));
const ProfileScreen = React.lazy(() => import('./components/profile/ProfileScreen').then((m) => ({ default: m.ProfileScreen })));
const SignUpForm = React.lazy(() => import('./components/auth/SignUpForm').then((m) => ({ default: m.SignUpForm })));
const LoginForm = React.lazy(() => import('./components/auth/LoginForm').then((m) => ({ default: m.LoginForm })));
const BodyDetailsFlow = React.lazy(() => import('./components/onboarding/BodyDetailsFlow').then((m) => ({ default: m.BodyDetailsFlow })));

const LoadingScreen: React.FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '12px' }}>
    <Loader2 size={32} className="animate-spin" color="var(--purple-primary)" />
    <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Loading FitSync...</span>
  </div>
);

const MainContent: React.FC = () => {
  const { authMode, setAuthMode } = useAuth();
  const { activeTab, setActiveTab, isWorkoutModalOpen, setIsWorkoutModalOpen } = useFitness();

  // Android Native Hardware Back Button Handler
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    const backListener = CapApp.addListener('backButton', () => {
      if (isWorkoutModalOpen) {
        setIsWorkoutModalOpen(false);
      } else if (activeTab !== 'home') {
        setActiveTab('home');
      } else if (authMode === 'onboarding') {
        setAuthMode('signup');
      } else {
        CapApp.exitApp();
      }
    });

    return () => {
      backListener.then((handler) => handler.remove());
    };
  }, [isWorkoutModalOpen, activeTab, authMode, setIsWorkoutModalOpen, setActiveTab, setAuthMode]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      {authMode === 'signup' && <SignUpForm />}
      {authMode === 'login' && <LoginForm />}
      {authMode === 'onboarding' && <BodyDetailsFlow />}

      {authMode === 'app' && (
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
      )}
    </Suspense>
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
