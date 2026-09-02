-- ==============================================================================
-- FitSync Complete PostgreSQL Database Schema & Row-Level Security (RLS)
-- Project: FitSync SaaS Backend
-- Target: Supabase (https://dwaatpdaqjnqhfodduxp.supabase.co)
-- ==============================================================================

-- 1. PROFILES TABLE (Extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT,
    phone_number TEXT,
    country_code TEXT DEFAULT '+91',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    is_premium BOOLEAN DEFAULT FALSE,
    member_since TEXT DEFAULT TO_CHAR(NOW(), 'Mon YYYY'),
    streak_days INT DEFAULT 1,
    completed_workouts_count INT DEFAULT 0,
    goal_progress_percent INT DEFAULT 0,
    achievements_count INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. BODY PROFILES TABLE (Onboarding metrics & Somatotype)
CREATE TABLE IF NOT EXISTS public.body_profiles (
    id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
    age INT DEFAULT 25,
    gender TEXT DEFAULT 'Male',
    height NUMERIC DEFAULT 175,
    weight NUMERIC DEFAULT 72,
    body_type TEXT DEFAULT 'mesomorph',
    unit TEXT DEFAULT 'cm',
    measurements JSONB DEFAULT '{"chest": 102, "waist": 81, "hips": 96, "arms": 34, "thighs": 58}'::jsonb,
    photos JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. WEIGHT LOGS TABLE (Historical weigh-ins with time-series indexing)
CREATE TABLE IF NOT EXISTS public.weight_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    date_label TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weight_logs_user_date ON public.weight_logs (user_id, recorded_at DESC);

-- 4. WORKOUTS TABLE (User Workout Routines & Exercise Set tracking)
CREATE TABLE IF NOT EXISTS public.workouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    level TEXT DEFAULT 'Intermediate',
    duration_mins INT DEFAULT 45,
    target_calories INT DEFAULT 380,
    focus_areas TEXT[] DEFAULT ARRAY['Chest', 'Triceps', 'Shoulders'],
    exercises JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. DIET PLANS TABLE (Macro budgets, Hydration, and Meals)
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'High Protein Muscle Gain Plan',
    goal TEXT DEFAULT 'Build Muscle',
    duration_weeks INT DEFAULT 8,
    daily_calories_target INT DEFAULT 2350,
    protein_target INT DEFAULT 180,
    carbs_target INT DEFAULT 280,
    fats_target INT DEFAULT 70,
    fiber_target INT DEFAULT 35,
    water_target_glasses INT DEFAULT 8,
    water_glasses_drunk INT DEFAULT 0,
    meals JSONB NOT NULL DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weight_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diet_plans ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can view and update their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Body Profiles: Users can access their body metrics
CREATE POLICY "Users can read own body profile" ON public.body_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own body profile" ON public.body_profiles
    FOR ALL USING (auth.uid() = id);

-- Weight Logs: Users can manage their weigh-in logs
CREATE POLICY "Users can read own weight logs" ON public.weight_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own weight logs" ON public.weight_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own weight logs" ON public.weight_logs
    FOR DELETE USING (auth.uid() = user_id);

-- Workouts: Users can manage their workouts
CREATE POLICY "Users can manage own workouts" ON public.workouts
    FOR ALL USING (auth.uid() = user_id);

-- Diet Plans: Users can manage their diet & hydration
CREATE POLICY "Users can manage own diet plans" ON public.diet_plans
    FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER ON SIGNUP
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, phone_number)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', 'FitSync Athlete'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'phone_number', '')
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.body_profiles (id)
    VALUES (new.id)
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
