# FitSync — AI Provider & Model Decision Record

**Status:** Approved  
**Date:** September 2026  
**Author:** AI Systems & Product Architect  
**Feature:** AI Meal Planner v1  

---

## 1. Context & Objectives
FitSync requires an AI inference engine capable of generating personalized, macro-compliant meal recipes and daily dietary schedules. The system must operate reliably within a zero-cost / generous free-tier development tier, support strict JSON structure enforcement, maintain sub-second response times on mobile networks, and execute behind a secure Supabase Edge Function boundary.

---

## 2. Provider Evaluation Matrix

| Provider & Model | Free Tier Allowance | Structured Output | Avg Latency | Context Window | Edge Function Suitability | Decision |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Gemini 2.0 / 1.5 Flash** | **15 RPM / 1M TPM / 1,500 RPD** | **Native `response_schema`** | **~600ms** | **1,000,000 tokens** | **Excellent (Native REST)** | **SELECTED (Primary)** |
| **Groq (Llama 3.3 70B)** | 30 RPM / 6K TPM / 14.4K RPD | JSON Mode (`type: json_object`) | ~280ms | 128,000 tokens | Excellent (OpenAI format) | **SELECTED (Secondary Fallback)** |
| **OpenAI (GPT-4o mini)** | Pay-as-you-go only ($0.15/1M) | Structured Outputs (Zod) | ~750ms | 128,000 tokens | Excellent | Rejected (No free tier without payment) |
| **HuggingFace Serverless** | Rate limited per IP | Fragile JSON parsing | ~2,500ms | Variable | Poor (Cold starts) | Rejected (Unreliable) |

---

## 3. Selected Architecture: Google Gemini 1.5/2.0 Flash + Groq Fallback

### 3.1 Why Gemini Flash was chosen as Primary
1. **Guaranteed JSON Schema Compliance:** Gemini's `response_schema` engine enforces exact JSON schema contracts at the token generation level, eliminating hallucinations in key names or data types.
2. **Generous Free Quota:** 1,500 requests per day is more than sufficient for internal testing, alpha cohorts, and staging validation without incurring cloud bills.
3. **Low Latency on Edge:** Lightweight parameter size delivers sub-800ms generation on Supabase Deno runtime.
4. **Zero Client Exposure:** The API key is stored exclusively as a Supabase Secret (`GEMINI_API_KEY`) and accessed only in server-side Edge Functions.

---

## 4. Fallback & Resilience Strategy

```
[ FitSync Client Request ]
           │
           ▼
[ Supabase Edge Function: ai-meal-plan ]
           │
     ┌─────┴─────────────────────────┐
     │ (Attempt 1: Gemini 2.0/1.5)   │
     ▼                               │
  SUCCESS ──► Return Validated Plan   │
     │                               │
   FAILS (429/500/Timeout)           │
     │                               │
     ▼                               │
  (Attempt 2: Groq Llama 3.3 70B)    │
     │                               │
     ├──► SUCCESS ──► Return Plan    │
     │                               │
   FAILS                             │
     ▼                               ▼
[ Client Fallback: Deterministic Algorithmic Meal Plan ]
  (Calculates 100% exact macros & recipes locally)
```

---

## 5. Security & Migration Plan
* **Secrets Management:** Managed via `supabase secrets set GEMINI_API_KEY=...`. No client-side `.env` or Vite variables are created for AI providers.
* **Migration Path:** The Edge Function interface standardizes input (`dietaryPreferences`, `targetMacros`, `allergies`) and output (`DietPlan`), allowing the underlying AI provider to be swapped in under 15 lines of server code without requiring mobile app updates.
