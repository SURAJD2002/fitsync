# 🗄️ FitSync — PostgreSQL Database Schema Documentation

This document describes the cloud database schema designed for FitSync hosted on Supabase (`https://dwaatpdaqjnqhfodduxp.supabase.co`).

---

## 1. Entity-Relationship Diagram

```
┌────────────────────────────────────────────────────────┐
│                   auth.users (Supabase)                │
└───────────────────────────┬────────────────────────────┘
                            │ 1:1 (id = user_id)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   public.profiles                      │
│  id (UUID, PK)                                         │
│  full_name (TEXT)                                      │
│  email (TEXT)                                          │
│  phone_number (TEXT)                                   │
│  country_code (TEXT)                                   │
│  avatar_url (TEXT)                                     │
│  is_premium (BOOLEAN)                                  │
│  streak_days (INT)                                     │
│  completed_workouts_count (INT)                        │
│  goal_progress_percent (INT)                           │
│  achievements_count (INT)                              │
│  created_at (TIMESTAMPTZ)                              │
│  updated_at (TIMESTAMPTZ)                              │
└─────────────┬─────────────────────────────┬────────────┘
              │ 1:1                         │ 1:N
              ▼                             ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│   public.body_profiles    │ │    public.weight_logs    │
│  id (UUID, PK/FK)         │ │  id (UUID, PK)           │
│  age (INT)                │ │  user_id (UUID, FK)      │
│  gender (TEXT)            │ │  weight_kg (NUMERIC)     │
│  height (NUMERIC)         │ │  recorded_at (TIMESTAMPTZ│
│  weight (NUMERIC)         │ │  date_label (TEXT)       │
│  body_type (TEXT)         │ │  created_at (TIMESTAMPTZ)│
│  unit (TEXT)              │ └──────────────────────────┘
│  measurements (JSONB)     │
│  photos (JSONB)           │
│  updated_at (TIMESTAMPTZ) │
└───────────────────────────┘
              │ 1:N                         │ 1:N
              ▼                             ▼
┌───────────────────────────┐ ┌──────────────────────────┐
│      public.workouts      │ │    public.diet_plans     │
│  id (UUID, PK)            │ │  id (UUID, PK)           │
│  user_id (UUID, FK)       │ │  user_id (UUID, FK)      │
│  title (TEXT)             │ │  title (TEXT)            │
│  level (TEXT)             │ │  daily_calories_target   │
│  duration_mins (INT)      │ │  protein_target (INT)    │
│  target_calories (INT)    │ │  carbs_target (INT)      │
│  focus_areas (TEXT[])     │ │  fats_target (INT)       │
│  exercises (JSONB)        │ │  water_target_glasses    │
│  created_at (TIMESTAMPTZ) │ │  water_glasses_drunk     │
│  updated_at (TIMESTAMPTZ) │ │  meals (JSONB)           │
└───────────────────────────┘ └──────────────────────────┘
```

---

## 2. Table Specifications

### `public.profiles`
- **Primary Key:** `id` (UUID references `auth.users(id)` ON DELETE CASCADE)
- **RLS:** `auth.uid() = id` (Users can only read and update their own profile).

### `public.body_profiles`
- **Primary Key / Foreign Key:** `id` (UUID references `public.profiles(id)` ON DELETE CASCADE)
- **RLS:** `auth.uid() = id` (User body metrics and somatotype).

### `public.weight_logs`
- **Primary Key:** `id` (UUID default `gen_random_uuid()`)
- **Foreign Key:** `user_id` (UUID references `public.profiles(id)` ON DELETE CASCADE)
- **Index:** `idx_weight_logs_user_date` on `(user_id, recorded_at DESC)`.
- **RLS:** `auth.uid() = user_id` (Time-series weigh-in points).

### `public.workouts`
- **Primary Key:** `id` (UUID default `gen_random_uuid()`)
- **Foreign Key:** `user_id` (UUID references `public.profiles(id)` ON DELETE CASCADE)
- **RLS:** `auth.uid() = user_id` (Workout routines & exercise sets).

### `public.diet_plans`
- **Primary Key:** `id` (UUID default `gen_random_uuid()`)
- **Foreign Key:** `user_id` (UUID references `public.profiles(id)` ON DELETE CASCADE)
- **RLS:** `auth.uid() = user_id` (Macro targets, meals, and hydration counter).

---

## 3. Triggers & Automation

### Automated Profile Creation (`handle_new_user()`)
```sql
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
```
