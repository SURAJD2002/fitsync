# 🔄 FitSync — Data Synchronization & Conflict Resolution Architecture

## 1. Synchronization Strategy

FitSync implements an **Optimistic Local-First Sync Architecture**:

```
[ User Action: Log Weight / Complete Set / Drink Water ]
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│  1. INSTANT LOCAL UPDATE (SafeStorage)                 │
│     - Immediate UI responsiveness (0ms latency)        │
│     - Stored safely in LocalStorage/WebStorage         │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│  2. ASYNC BACKGROUND SYNC (Supabase Client)           │
│     - If online & authenticated: sends upsert/insert   │
│     - If offline: local state remains fully preserved  │
└──────────────────┬─────────────────────────────────────┘
                   │
                   ▼
┌────────────────────────────────────────────────────────┐
│  3. SERVER ACKNOWLEDGEMENT & CLOUD PERSISTENCE         │
│     - Stored with PostgreSQL RLS security              │
└────────────────────────────────────────────────────────┘
```

---

## 2. Conflict Policy & Deduplication

### A. Weight History
- **ID Strategy:** Each weight log generates an immutable client UUID (`weight_${Date.now()}_${random}`).
- **Timestamping:** Stored with full ISO-8601 UTC timestamp (`recordedAt`).
- **Conflict Handling:** Server stores append-only entries per `(user_id, recorded_at)`; UI sorts chronologically by epoch ms.

### B. Workout Sessions & Routines
- **Active Sessions:** Live session state is scoped locally to avoid network lag during live exercise sets.
- **Routines & Exercises:** Last-Write-Wins (LWW) based on `updated_at` timestamp.

### C. Hydration Tracking
- **Bounded State:** Hydration is bounded between `0` and `waterTargetGlasses` (8).
- **Target Lock:** `incrementWaterIntake` locks at target once reached to avoid unexpected wrap-arounds.

---

## 3. Storage & Migration Safety

- **Corrupted JSON Recovery:** `SafeStorage.get()` catches parsing exceptions and falls back to typed schema defaults.
- **Quota Protection:** `SafeStorage.set()` catches `QuotaExceededError` gracefully without freezing React render loops.
