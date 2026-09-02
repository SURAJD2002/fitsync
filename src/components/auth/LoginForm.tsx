import React, { useState } from 'react';
import { User, Lock, Globe, Dumbbell, ChevronLeft, ShieldCheck, Users, Headphones } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const LoginForm: React.FC = () => {
  const { login, setAuthMode } = useAuth();
  const [emailOrPhone, setEmailOrPhone] = useState('rahul.sharma@example.com');
  const [password, setPassword] = useState('Password123!');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
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
    login(emailOrPhone, password);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '16px 20px 40px', position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => setAuthMode('signup')}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(255, 255, 255, 0.08)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', color: '#fff', fontWeight: 600 }}>
          <Globe size={14} />
          <span>English</span>
          <span style={{ fontSize: '10px' }}>▼</span>
        </div>
      </div>

      {/* Hero Section */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ paddingRight: '120px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--gradient-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Dumbbell size={18} color="#fff" />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>FitSync</span>
          </div>

          <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
            Stronger Every Day,<br />
            Better Every <span style={{ color: 'var(--purple-light)' }}>You.</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
            Your all-in-one fitness companion for workouts, diet, and progress.
          </p>
        </div>

        <div
          style={{
            position: 'absolute',
            right: '-10px',
            top: '0',
            width: '120px',
            height: '140px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
            alt="FitSync Male Hero"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>

        {/* 3 Feature Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
            Workouts
          </div>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
            Diet Plans
          </div>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '6px', textAlign: 'center', fontSize: '10px', fontWeight: 700, color: '#fff' }}>
            Track Progress
          </div>
        </div>
      </div>

      {/* Login Card Container */}
      <form onSubmit={handleLogin} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Welcome Back! 👋</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Login to continue your fitness journey</p>
        </div>

        <Input
          label="Email or Phone Number"
          placeholder="Enter your email or phone number"
          leftIcon={<User size={18} />}
          value={emailOrPhone}
          onChange={(e) => setEmailOrPhone(e.target.value)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <Input
            label="Password"
            placeholder="Enter your password"
            isPassword
            leftIcon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div style={{ textAlign: 'right' }}>
            <button
              type="button"
              style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              Forgot Password?
            </button>
          </div>
        </div>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <Button type="submit">Login</Button>

        <div style={{ textAlign: 'center', margin: '8px 0 4px', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', width: '100%', zIndex: 0 }} />
          <span style={{ background: 'var(--bg-card)', padding: '0 12px', fontSize: '11px', color: 'var(--text-dim)', position: 'relative', zIndex: 1 }}>
            or continue with
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontWeight: 900, color: '#4285F4' }}>G</span> Google
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
             Apple
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontWeight: 900, color: '#1877F2' }}>f</span> Facebook
          </button>
        </div>
      </form>

      {/* New to FitSync Card */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>New to FitSync?</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Create an account and start your transformation today.</p>
        </div>
        <button
          onClick={() => setAuthMode('signup')}
          style={{
            background: 'rgba(139, 92, 246, 0.2)',
            border: '1px solid var(--purple-primary)',
            color: 'var(--purple-light)',
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            fontWeight: 700,
            fontSize: '12px',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          Sign Up
        </button>
      </div>

      {/* Trust Badges Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-around', fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <ShieldCheck size={16} color="var(--purple-light)" />
          <span><strong>Secure & Safe</strong><br />Your data is protected</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Users size={16} color="var(--purple-light)" />
          <span><strong>Trusted by 50K+</strong><br />Fitness enthusiasts</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <Headphones size={16} color="var(--purple-light)" />
          <span><strong>24/7 Support</strong><br />We're here to help</span>
        </div>
      </div>

      <div style={{ textAlign: 'center', fontSize: '10px', color: 'var(--text-dim)' }}>
        By continuing, you agree to our <span style={{ textDecoration: 'underline' }}>Terms of Service</span> and <span style={{ textDecoration: 'underline' }}>Privacy Policy</span>.
      </div>
    </div>
  );
};
