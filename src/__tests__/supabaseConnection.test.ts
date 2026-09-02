import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

describe('Live Supabase Cloud Database Verification', () => {
  it('confirms Supabase client is properly configured with live key', () => {
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('verifies public.profiles table exists and responds to queries', async () => {
    const { data, error } = await supabase.from('profiles').select('id').limit(1);
    // If the table exists, error should either be null or an expected RLS response (not 404/relation does not exist)
    if (error) {
      expect(error.message).not.toContain('relation "public.profiles" does not exist');
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });

  it('verifies public.weight_logs table exists and responds to queries', async () => {
    const { data, error } = await supabase.from('weight_logs').select('id').limit(1);
    if (error) {
      expect(error.message).not.toContain('relation "public.weight_logs" does not exist');
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });

  it('verifies public.workouts table exists and responds to queries', async () => {
    const { data, error } = await supabase.from('workouts').select('id').limit(1);
    if (error) {
      expect(error.message).not.toContain('relation "public.workouts" does not exist');
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });

  it('verifies public.diet_plans table exists and responds to queries', async () => {
    const { data, error } = await supabase.from('diet_plans').select('id').limit(1);
    if (error) {
      expect(error.message).not.toContain('relation "public.diet_plans" does not exist');
    } else {
      expect(Array.isArray(data)).toBe(true);
    }
  });
});
