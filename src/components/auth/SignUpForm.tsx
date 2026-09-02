import React, { useState } from 'react';
import { User, Mail, Phone, Lock, ArrowRight, Dumbbell, Utensils, BarChart3, ChevronLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { validatePassword, validateEmail, validatePhone } from '../../services/authService';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const SignUpForm: React.FC = () => {
  const { signup, setAuthMode } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

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
      setErrorMsg('Password does not meet requirements.');
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
    const res = await signup(fullName, email, phoneNumber, countryCode, password);
    if (!res.success && res.error) {
      setErrorMsg(res.error);
    }
  };


  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '16px 20px 40px', position: 'relative' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <button
          onClick={() => setAuthMode('login')}
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
            }}
          >
            <Dumbbell size={18} color="#fff" />
          </div>
          <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>FitSync</span>
        </div>
        <div style={{ width: '36px' }} />
      </div>

      {/* Hero Section */}
      <div style={{ position: 'relative', marginBottom: '24px' }}>
        <div style={{ paddingRight: '120px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#fff', lineHeight: 1.15 }}>
            Create Account<br />
            Start Your <span style={{ color: 'var(--purple-light)' }}>Transformation</span>
          </h1>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.4 }}>
            Join thousands of users who are building stronger, healthier versions of themselves.
          </p>
        </div>

        {/* Hero Male Photo Background overlay */}
        <div
          style={{
            position: 'absolute',
            right: '-10px',
            top: '-20px',
            width: '130px',
            height: '160px',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            pointerEvents: 'none',
            maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=300&q=80"
            alt="Hero Fitness"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
        </div>

        {/* 3 Feature Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Dumbbell size={16} color="var(--purple-light)" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>Smart Workouts</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <Utensils size={16} color="var(--purple-light)" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>Personalized Diet</span>
          </div>
          <div style={{ flex: 1, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.25)', borderRadius: 'var(--radius-md)', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <BarChart3 size={16} color="var(--purple-light)" />
            <span style={{ fontSize: '10px', fontWeight: 700, color: '#fff' }}>Track Progress</span>
          </div>
        </div>
      </div>

      {/* Sign Up Form Container */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>Sign Up</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Create your account to get started</p>
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
              style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '13px', fontWeight: 600, outline: 'none', cursor: 'pointer' }}
            >
              <option value="+91" style={{ background: '#181a26' }}>🇮🇳 +91</option>
              <option value="+1" style={{ background: '#181a26' }}>🇺🇸 +1</option>
              <option value="+44" style={{ background: '#181a26' }}>🇬🇧 +44</option>
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

          {/* Password Validation Indicators */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', fontSize: '11px', flexWrap: 'wrap' }}>
            <span style={{ color: passRules.hasMinLength ? 'var(--color-green)' : 'var(--text-dim)', fontWeight: 600 }}>
              {passRules.hasMinLength ? '✓' : '•'} At least 8 characters
            </span>
            <span style={{ color: passRules.hasNumber ? 'var(--color-green)' : 'var(--text-dim)', fontWeight: 600 }}>
              {passRules.hasNumber ? '✓' : '•'} 1 number
            </span>
            <span style={{ color: passRules.hasSpecialChar ? 'var(--color-green)' : 'var(--text-dim)', fontWeight: 600 }}>
              {passRules.hasSpecialChar ? '✓' : '•'} 1 special character
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

        <label className="custom-checkbox">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            style={{ display: 'none' }}
          />
          <div className="checkbox-box">✓</div>
          <span style={{ fontSize: '12px' }}>
            I agree to the <span style={{ color: 'var(--purple-light)', textDecoration: 'underline' }}>Terms of Service</span> and <span style={{ color: 'var(--purple-light)', textDecoration: 'underline' }}>Privacy Policy</span>
          </span>
        </label>

        {errorMsg && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 'var(--radius-sm)', padding: '8px 12px', color: '#ef4444', fontSize: '12px', fontWeight: 600 }}>
            {errorMsg}
          </div>
        )}

        <Button type="submit" icon={<ArrowRight size={18} />}>
          Create Account
        </Button>

        {/* Social Sign Up */}
        <div style={{ textAlign: 'center', margin: '8px 0 4px', position: 'relative' }}>
          <div style={{ borderTop: '1px solid var(--border-subtle)', position: 'absolute', top: '50%', width: '100%', zIndex: 0 }} />
          <span style={{ background: 'var(--bg-card)', padding: '0 12px', fontSize: '11px', color: 'var(--text-dim)', position: 'relative', zIndex: 1 }}>
            or sign up with
          </span>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            style={{
              flex: 1,
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
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
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
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
              background: '#fff',
              color: '#000',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              padding: '10px',
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

        <div style={{ textAlign: 'center', marginTop: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline' }}
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
};
