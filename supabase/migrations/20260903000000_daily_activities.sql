-- ==============================================================================
-- FitSync Daily Activity Records & Step Tracking Schema
-- Target: Supabase PostgreSQL (https://dwaatpdaqjnqhfodduxp.supabase.co)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.daily_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL DEFAULT CURRENT_DATE,
    steps INT NOT NULL DEFAULT 0,
    distance_km NUMERIC(6, 2) DEFAULT 0.00,
    active_minutes INT DEFAULT 0,
    calories_burned INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_daily_activities_user_date UNIQUE (user_id, activity_date)
);

CREATE INDEX IF NOT EXISTS idx_daily_activities_user_date ON public.daily_activities (user_id, activity_date DESC);

-- Enable RLS
ALTER TABLE public.daily_activities ENABLE ROW LEVEL SECURITY;

-- High-performance RLS Policies
DROP POLICY IF EXISTS "Users can read own daily activity" ON public.daily_activities;
CREATE POLICY "Users can read own daily activity" ON public.daily_activities
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own daily activity" ON public.daily_activities;
CREATE POLICY "Users can insert own daily activity" ON public.daily_activities
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own daily activity" ON public.daily_activities;
CREATE POLICY "Users can update own daily activity" ON public.daily_activities
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can delete own daily activity" ON public.daily_activities;
CREATE POLICY "Users can delete own daily activity" ON public.daily_activities
    FOR DELETE USING ((SELECT auth.uid()) = user_id);
