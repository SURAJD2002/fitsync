# ☁️ FitSync — Supabase Cloud Architecture

## 1. System Overview

FitSync uses an **Offline-First Hybrid Architecture** combining Supabase cloud infrastructure with resilient client-side storage (`SafeStorage`).

```
┌────────────────────────────────────────────────────────┐
│               FITSYNC CLIENT (Vite/React/Android)      │
│  - Presentation UI (Screens, Modals, Charts)           │
│  - React Context (AuthContext, FitnessContext)         │
│  - Local SafeStorage Layer (Instant UI updates)        │
└───────────────────────────┬────────────────────────────┘
                            │
               [isSupabaseConfigured() === true]
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│            SUPABASE CLOUD INFRASTRUCTURE               │
│  Project: https://dwaatpdaqjnqhfodduxp.supabase.co     │
├───────────────────────────┬────────────────────────────┤
│ 🔐 Supabase Auth          │ 🗄️ PostgreSQL Database     │
│ - JWT Session Management  │ - Row Level Security (RLS) │
│ - Email/Password Signup   │ - Automated Triggers       │
│ - Auto Token Refresh      │ - Time-Series Indexes      │
└───────────────────────────┴────────────────────────────┘
```

---

## 2. Authentication Architecture

- **Registration / Login:** Processed via `supabase.auth.signUp` and `supabase.auth.signInWithPassword`.
- **Session Listener:** `supabase.auth.onAuthStateChange` runs globally in `AuthContext` to synchronize active session tokens and load remote profile data.
- **Offline / Guest Mode:** When `isSupabaseConfigured()` is false or network is down, the client seamlessly falls back to `SafeStorage`.

---

## 3. Row-Level Security (RLS) Model

Every table in `public` schema has Row-Level Security explicitly enabled:

| Table | Policy Name | Command | Rule |
| :--- | :--- | :--- | :--- |
| `profiles` | Users can read own profile | `SELECT` | `auth.uid() = id` |
| `profiles` | Users can update own profile | `UPDATE` | `auth.uid() = id` |
| `body_profiles` | Users can read own body profile | `SELECT` | `auth.uid() = id` |
| `body_profiles` | Users can update own body profile | `ALL` | `auth.uid() = id` |
| `weight_logs` | Users can read own weight logs | `SELECT` | `auth.uid() = user_id` |
| `weight_logs` | Users can insert own weight logs | `INSERT` | `auth.uid() = user_id` |
| `workouts` | Users can manage own workouts | `ALL` | `auth.uid() = user_id` |
| `diet_plans` | Users can manage own diet plans | `ALL` | `auth.uid() = user_id` |

---

## 4. Environment Variables Configuration

| Variable | Scope | Description |
| :--- | :---: | :--- |
| `VITE_SUPABASE_URL` | Public (Client) | Supabase project endpoint (`https://dwaatpdaqjnqhfodduxp.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Public (Client) | Public anon key safe for browser/app distribution |
