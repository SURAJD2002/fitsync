import { describe, it, expect } from 'vitest';
import { validatePassword, validateEmail, validatePhone } from '../services/authService';

describe('Auth Validation Logic', () => {
  it('validates password requirements correctly', () => {
    // Fails all
    const res1 = validatePassword('short');
    expect(res1.hasMinLength).toBe(false);
    expect(res1.hasNumber).toBe(false);
    expect(res1.hasSpecialChar).toBe(false);
    expect(res1.isValid).toBe(false);

    // Fails special char
    const res2 = validatePassword('Password123');
    expect(res2.hasMinLength).toBe(true);
    expect(res2.hasNumber).toBe(true);
    expect(res2.hasSpecialChar).toBe(false);
    expect(res2.isValid).toBe(false);

    // Valid password
    const res3 = validatePassword('Password123!');
    expect(res3.hasMinLength).toBe(true);
    expect(res3.hasNumber).toBe(true);
    expect(res3.hasSpecialChar).toBe(true);
    expect(res3.isValid).toBe(true);
  });

  it('validates email formats correctly', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('user@domain')).toBe(false);
    expect(validateEmail('rahul.sharma@example.com')).toBe(true);
  });

  it('validates phone number digits', () => {
    expect(validatePhone('123')).toBe(false);
    expect(validatePhone('9876543210')).toBe(true);
  });
});
