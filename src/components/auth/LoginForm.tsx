import React, { useState } from 'react';
import { User, Lock, Globe, ChevronLeft, ShieldCheck, Users, Headphones, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const LoginForm: React.FC = () => {
  const { login, signInWithGoogle, setAuthMode } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('athlete@fitsync.com');
  const [password, setPassword] = useState('FitSync#2026!');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setErrorMsg('Please enter your email or phone number.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    const res = await login(emailOrPhone, password);
    setIsLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 60%), var(--bg-dark)', padding: '16px 18px 40px', position: 'relative' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => setAuthMode('signup')}
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
          }}
        >
          <ChevronLeft size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '9px',
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
          <span style={{ fontSize: '18px', fontWeight: 900, fontFamily: 'var(--font-heading)', color: '#fff' }}>FitSync</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(255, 255, 255, 0.06)', border: '1px solid var(--border-subtle)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', color: '#fff', fontWeight: 700 }}>
          <Globe size={13} />
          <span>EN</span>
        </div>
      </div>

      {/* Hero Visual Section */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ paddingRight: '120px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(139, 92, 246, 0.2)',
              border: '1px solid rgba(139, 92, 246, 0.4)',
              padding: '4px 10px',
              borderRadius: '99px',
              fontSize: '10.5px',
              fontWeight: 800,
              color: 'var(--purple-light)',
              letterSpacing: '0.05em',
              marginBottom: '8px',
            }}
          >
            <Sparkles size={12} />
            <span>AI FITNESS PLATFORM</span>
          </div>

          <h1 style={{ fontSize: '25px', fontWeight: 900, color: '#fff', lineHeight: 1.15, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
            Elevate Your Body,<br />
            Own Your <span className="text-gradient-purple">Future.</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
            Sign in to access your workout routines, macros, and cloud progress tracking.
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '-12px',
            top: '-15px',
            width: '130px',
            height: '145px',
            borderRadius: '20px',
            overflow: 'hidden',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="Hero Fitness"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </div>

      {/* Login Form Container */}
      <form onSubmit={handleLogin} className="glass-card" style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px', borderRadius: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Welcome Back 👋
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Enter your athlete credentials</p>
        </div>

        {/* Dedicated High-Visibility Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={isGoogleLoading}
          style={{
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            borderRadius: '16px',
            padding: '13px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            color: '#fff',
            fontSize: '14.5px',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.18s ease',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Continue with Google'}</span>
        </button>

        <div style={{ textAlign: 'center', margin: '4px 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', width: '100%', zIndex: 0 }} />
          <span style={{ background: 'rgba(18, 22, 35, 0.95)', padding: '0 12px', fontSize: '11px', color: 'var(--text-muted)', position: 'relative', zIndex: 1, fontWeight: 700 }}>
            or continue with email
          </span>
        </div>

        <Input
          label="Email or Phone Number"
          placeholder="athlete@fitsync.com"
          leftIcon={<User size={18} />}
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Input
            label="Password"
            placeholder="••••••••••••"
            isPassword
            leftIcon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ textAlign: 'right', marginTop: '2px' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '11.5px', fontWeight: 700, cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', padding: '10px 14px', color: '#f87171', fontSize: '12px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <Button type="submit" disabled={isLoading} icon={<ArrowRight size={18} />}>
          {isLoading ? 'Verifying...' : 'Sign In'}
        </Button>
      </form>

      {/* New to FitSync Card */}
      <div className="glass-card glow-card-purple" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderRadius: '20px' }}>
        <div>
          <h3 style={{ fontSize: '14.5px', fontWeight: 800, color: '#fff' }}>New Athlete?</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Create account and start today.</p>
        </div>
        <button
          onClick={() => setAuthMode('signup')}
          style={{
            background: 'var(--gradient-purple)',
            color: '#fff',
            border: 'none',
            padding: '9px 16px',
            borderRadius: '12px',
            fontWeight: 800,
            fontSize: '12px',
            fontFamily: 'var(--font-heading)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-purple)',
          }}
        >
          Register
        </button>
      </div>

      {/* Trust Badges Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '10.5px', color: 'var(--text-muted)', textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={16} color="var(--purple-light)" />
          <span><strong>Secure Sync</strong><br />Cloud protected</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Users size={16} color="var(--cyan-light)" />
          <span><strong>50K+ Athletes</strong><br />Global community</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Headphones size={16} color="var(--emerald-light)" />
          <span><strong>AI Assisted</strong><br />Smart routines</span>
        </div>
      </div>
    </div>
  );
};
