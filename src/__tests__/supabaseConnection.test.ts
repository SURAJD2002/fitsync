import { describe, it, expect } from 'vitest';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';

describe('Live Supabase Cloud Database Connection & Schema Status', () => {
  it('confirms Supabase client is properly configured with live key', () => {
    expect(isSupabaseConfigured()).toBe(true);
  });

  it('checks connection to Supabase endpoint', async () => {
    const { error } = await supabase.auth.getSession();
    expect(error).toBeNull();
  });
});
