# FitSync — World-Class Architecture Audit & Engineering Assessment

**Version:** 1.0.0  
**Date:** September 2026  
**Auditor:** Principal Software & AI Systems Architect  
**Classification:** Internal Engineering Standard  

---

## 1. Executive Summary
FitSync is a hybrid cross-platform mobile fitness and nutrition application targeting high-performance athletes and fitness enthusiasts. It is architected with a **React 19 + TypeScript + Vite** frontend, wrapped via **Capacitor 8** for Android native distribution, with a live **Supabase PostgreSQL** backend leveraging Row-Level Security (RLS) and GoTrue authentication.

This audit evaluates the codebase across ten engineering dimensions, establishing technical debt items, architectural boundaries, and safety requirements before introducing the AI v1 subsystem.

---

## 2. Current Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               Android Native (Capacitor 8)             │
│            Samsung Galaxy S22 Ultra (SM-S908E)         │
├────────────────────────────────────────────────────────┤
│                 WebView / React 19 Client              │
│  - Presentation: Obsidian Glass Design System (CSS)    │
│  - Navigation: Single-page tabbed router (State)       │
│  - State Layer: AuthContext, FitnessContext            │
│  - Local Cache: SafeStorage (Resilient LocalStorage)   │
├────────────────────────────────────────────────────────┤
│                 Secure Network Layer                   │
│  - Client SDK: @supabase/supabase-js (v2.114.0)       │
│  - Auth: GoTrue (Email/Pass + Google OAuth Deep-Link)  │
│  - Database: PostgreSQL with RLS (5 core tables)       │
└────────────────────────────────────────────────────────┘
```

---

## 3. Dimensional Analysis

### 3.1 Strengths
1. **Resilient Local Persistence:** `SafeStorage` wrapper protects against JSON corruption and quota errors, ensuring zero-crash offline behavior.
2. **Strict RLS Isolation:** PostgreSQL database enforces tenant isolation where `auth.uid() = user_id` across all 5 production tables.
3. **Deep Link Integration:** Android intent filter (`com.fitsync.app`) handles Google OAuth token capture and code exchanges cleanly.
4. **Lightweight Bundle:** Zero heavy UI component libraries (vanilla CSS tokens and Lucide icons), keeping APK build sizes minimal (~4.5MB).
5. **Deterministic Baseline:** Fitness logic, set tracking, and weight progression sorting are codified with unit test coverage (25/25 passing).

### 3.2 Weaknesses & Technical Debt
1. **State Centralization:** Contexts currently hold both active state and mock fallback fixtures; missing distinct query caching or offline sync queue.
2. **Direct Client Sync:** Client components invoke Supabase upserts fire-and-forget inside event handlers without a persistent offline mutations queue (outbox pattern).
3. **Macro Calculation Distribution:** Calorie calculations previously relied on static targets rather than dynamic Mifflin-St Jeor / Harris-Benedict formulas based on user body metrics.
4. **Client-Side AI Risk:** Calling AI APIs directly from client code would expose secret API keys inside APK bytecode or network inspectors.

---

## 4. Risk Assessment Matrix

| Dimension | Risk Severity | Description | Mitigation Strategy |
| :--- | :--- | :--- | :--- |
| **Security** | 🔴 HIGH | Exposing AI provider API keys in client JavaScript or APK. | Strict server-side boundary via Supabase Edge Function with JWT verification. |
| **Data Integrity** | 🔴 HIGH | Hallucinated AI calorie/macro values corrupting user nutrition targets. | **Deterministic Authority**: Client calculates authoritative BMR/TDEE; AI only supplies culinary items conforming to targets. |
| **Safety & Trust** | 🔴 HIGH | AI recommending extreme starvation (<1200 kcal) or pseudo-medical diets. | Pre-flight calorie floor validation, allergy filters, and safety disclaimers. |
| **Scalability** | 🟡 MEDIUM | Unauthenticated or automated abuse draining provider token quotas. | Per-user rate limiting (5 req/10m), payload size caps (<4KB), and short timeouts (12s). |
| **Offline UX** | 🟡 MEDIUM | App stalling on network drop during meal plan generation. | Non-blocking async flows, local cached plan retention, and explicit offline banners. |
| **Performance** | 🟢 LOW | Complex schema validation lagging on mobile thread. | Lightweight JSON schema validation (Zod/native TS guards) without heavy runtime overhead. |

---

## 5. Recommended Target Architecture for AI v1

```
                     [ User Interaction ]
                              │
                    [ Deterministic Engine ]
         (Mifflin-St Jeor BMR / TDEE + Macro Constraints)
                              │
                  [ Authoritative Target ]
                 (e.g., 2,350 kcal | 180g P)
                              │
               [ Supabase Edge Function Call ]
             (Bearer JWT + Sanitized Preferences)
                              │
                 ┌────────────┴────────────┐
                 ▼                         ▼
        [ Supabase Edge Func ]    [ Offline Fallback ]
        - JWT Verification        (Local Deterministic Plan)
        - Rate Limiter (5/10m)
        - AI Model (Gemini/Groq)
        - Strict JSON Schema
                 │
                 ▼
        [ Output Validator ]
        - Tolerance Check (±5%)
        - Food Safety Filters
                 │
                 ▼
          [ FitSync UI ]
     (Verified AI Nutrition Plan)
```

---

## 6. Priority Execution Matrix

1. **P0 (Security & Authority):** Implement Supabase Edge Function with server-side secrets; build standalone deterministic nutrition engine.
2. **P1 (Schema & Safety):** Implement strict TypeScript JSON schemas, macro tolerance validators, and safety guardrails.
3. **P2 (UX & Offline):** Integrate AI Meal Planner modal in `DietScreen.tsx` with step-by-step progress pills, allergy selectors, and offline resilience.
4. **P3 (Testing & Verification):** Add test suites for schema validation, malformed input rejection, and verify on Samsung Galaxy S22 Ultra.
