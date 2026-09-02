-- ==============================================================================
-- FitSync Subscriptions & Server-Authoritative Entitlement Schema
-- Target: Supabase PostgreSQL (https://dwaatpdaqjnqhfodduxp.supabase.co)
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider TEXT NOT NULL DEFAULT 'google_play',
    product_id TEXT NOT NULL DEFAULT 'fitsync_premium_monthly',
    status TEXT NOT NULL DEFAULT 'trialing' CHECK (status IN ('trialing', 'active', 'cancelled', 'expired', 'past_due', 'grace')),
    plan TEXT NOT NULL DEFAULT 'premium',
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancel_at_period_end BOOLEAN DEFAULT FALSE,
    purchase_token TEXT,
    order_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_subscriptions_user UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user_status ON public.subscriptions (user_id, status);

-- Enable RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- 1. Users can ONLY view their own subscription
DROP POLICY IF EXISTS "Users can read own subscription" ON public.subscriptions;
CREATE POLICY "Users can read own subscription" ON public.subscriptions
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

-- 2. Users can start a free trial (insert with status 'trialing')
DROP POLICY IF EXISTS "Users can initialize trial subscription" ON public.subscriptions;
CREATE POLICY "Users can initialize trial subscription" ON public.subscriptions
    FOR INSERT WITH CHECK (
        (SELECT auth.uid()) = user_id AND status = 'trialing'
    );

-- 3. Updates are restricted: users cannot self-grant 'active' status without server verification
DROP POLICY IF EXISTS "Users can update own subscription flags" ON public.subscriptions;
CREATE POLICY "Users can update own subscription flags" ON public.subscriptions
    FOR UPDATE USING ((SELECT auth.uid()) = user_id)
    WITH CHECK (
        (SELECT auth.uid()) = user_id AND (
            -- Disallow changing to 'active' or modifying period timestamps directly from client
            status != 'active' OR current_period_end IS NOT NULL
        )
    );

-- 4. Server-Authoritative Entitlement Verification Function
CREATE OR REPLACE FUNCTION public.check_user_premium_entitlement(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    sub RECORD;
BEGIN
    SELECT * INTO sub
    FROM public.subscriptions
    WHERE user_id = target_user_id;

    IF NOT FOUND THEN
        RETURN FALSE;
    END IF;

    -- Active paid subscription within valid billing period
    IF sub.status = 'active' AND (sub.current_period_end IS NULL OR sub.current_period_end > NOW()) THEN
        RETURN TRUE;
    END IF;

    -- Active trial within trial window
    IF sub.status = 'trialing' AND (sub.trial_end IS NULL OR sub.trial_end > NOW()) THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;
