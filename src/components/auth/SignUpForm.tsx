import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, validateEmail, validatePhone } from '../../services/authService';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const SignUpForm: React.FC = () => {
  const { signup, signInWithGoogle, setAuthMode } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const passRules = validatePassword(password);
  const isEmailValid = validateEmail(email);
  const isNameValid = fullName.trim().length >= 2;
  const isPhoneValid = validatePhone(phoneNumber);
  const isConfirmMatch = confirmPassword.length > 0 && confirmPassword === password;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNameValid) {
      setErrorMsg('Please enter your full name.');
      return;
    }
    if (!isEmailValid) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    if (!isPhoneValid) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }
    if (!passRules.isValid) {
      setErrorMsg('Password does not meet strength requirements.');
      return;
    }
    if (!isConfirmMatch) {
      setErrorMsg('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setErrorMsg('Please accept the Terms of Service and Privacy Policy.');
      return;
    }

    setErrorMsg('');
    setIsLoading(true);
    const res = await signup(fullName, email, phoneNumber, countryCode, password);
    setIsLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMsg('');
    setIsGoogleLoading(true);
    const res = await signInWithGoogle();
    setIsGoogleLoading(false);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };

  return (
    <div style={{ minHeight: '100dvh', width: '100%', background: 'radial-gradient(circle at 50% 0%, rgba(139, 92, 246, 0.12) 0%, transparent 60%), var(--bg-dark)', padding: '16px 18px 40px', position: 'relative' }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button
          onClick={() => setAuthMode('login')}
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

        <div style={{ width: '38px' }} />
      </div>

      {/* Hero Visual Section */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ paddingRight: '115px' }}>
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
            <span>JOIN THE ELITE</span>
          </div>

          <h1 style={{ fontSize: '25px', fontWeight: 900, color: '#fff', lineHeight: 1.15, fontFamily: 'var(--font-heading)', letterSpacing: '-0.03em' }}>
            Build Your Peak<br />
            Physical <span className="text-gradient-purple">Potential.</span>
          </h1>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
            Tailored AI hypertrophy routines, nutrition blueprints, and progress analytics.
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
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80"
            alt="Hero Fitness"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.85 }}
          />
        </div>
      </div>

      {/* Sign Up Form Container */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '22px 20px', display: 'flex', flexDirection: 'column', gap: '14px', borderRadius: '24px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>
            Athlete Sign Up
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Create your personalized fitness profile</p>
        </div>

        {/* Dedicated High-Visibility Google Sign-Up Button */}
        <button
          type="button"
          onClick={handleGoogleSignUp}
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
          <span>{isGoogleLoading ? 'Connecting to Google...' : 'Sign up with Google'}</span>
        </button>

        <div style={{ textAlign: 'center', margin: '4px 0', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', width: '100%', zIndex: 0 }} />
          <span style={{ background: 'rgba(18, 22, 35, 0.95)', padding: '0 12px', fontSize: '11px', color: 'var(--text-muted)', position: 'relative', zIndex: 1, fontWeight: 700 }}>
            or register with email
          </span>
        </div>

        <Input
          placeholder="Full Name"
          leftIcon={<User size={18} />}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          isValid={isNameValid}
        />

        <Input
          placeholder="Email Address"
          type="email"
          leftIcon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          isValid={isEmailValid}
        />

        <Input
          placeholder="Phone Number"
          type="tel"
          leftIcon={<Phone size={18} />}
          countrySelector={
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 700, outline: 'none', cursor: 'pointer' }}
            >
              <option value="+91" style={{ background: '#0b0d14' }}>🇮🇳 +91</option>
              <option value="+1" style={{ background: '#0b0d14' }}>🇺🇸 +1</option>
              <option value="+44" style={{ background: '#0b0d14' }}>🇬🇧 +44</option>
            </select>
          }
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          isValid={isPhoneValid}
        />

        <div>
          <Input
            placeholder="Password"
            isPassword
            leftIcon={<Lock size={18} />}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Real-time Password Strength Check */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
            <span style={{ color: passRules.hasMinLength ? 'var(--emerald-light)' : 'var(--text-dim)', fontWeight: 700 }}>
              {passRules.hasMinLength ? '✓' : '•'} 8+ chars
            </span>
            <span style={{ color: passRules.hasNumber ? 'var(--emerald-light)' : 'var(--text-dim)', fontWeight: 700 }}>
              {passRules.hasNumber ? '✓' : '•'} 1 number
            </span>
            <span style={{ color: passRules.hasSpecialChar ? 'var(--emerald-light)' : 'var(--text-dim)', fontWeight: 700 }}>
              {passRules.hasSpecialChar ? '✓' : '•'} 1 symbol
            </span>
          </div>
        </div>

        <Input
          placeholder="Confirm Password"
          isPassword
          leftIcon={<Lock size={18} />}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          isValid={isConfirmMatch}
        />

        <label className="custom-checkbox" style={{ marginTop: '4px' }}>
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ display: 'none' }}
          />
          <div className="checkbox-box" style={{ borderRadius: '8px', width: '22px', height: '22px' }}>
            {agreeTerms && '✓'}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            I agree to the <span style={{ color: 'var(--purple-light)', textDecoration: 'underline' }}>Terms of Service</span> and <span style={{ color: 'var(--purple-light)', textDecoration: 'underline' }}>Privacy Policy</span>
          </span>
        </label>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.35)', borderRadius: '12px', padding: '10px 14px', color: '#f87171', fontSize: '12px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <Button type="submit" disabled={isLoading} icon={<ArrowRight size={18} />}>
          {isLoading ? 'Creating Account...' : 'Continue to Onboarding'}
        </Button>

        <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};
