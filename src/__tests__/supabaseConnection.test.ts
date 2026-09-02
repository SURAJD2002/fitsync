import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

describe('Live Supabase Cloud Database Table Verification (Post-Migration)', () => {
  it('confirms Supabase client is properly configured with live key', () => {
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('verifies public.profiles table is live and accessible', async () => {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('verifies public.body_profiles table is live and accessible', async () => {
    const { data, error } = await supabase.from('body_profiles').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('verifies public.weight_logs table is live and accessible', async () => {
    const { data, error } = await supabase.from('weight_logs').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('verifies public.workouts table is live and accessible', async () => {
    const { data, error } = await supabase.from('workouts').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('verifies public.diet_plans table is live and accessible', async () => {
    const { data, error } = await supabase.from('diet_plans').select('id').limit(1);
    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });
});
