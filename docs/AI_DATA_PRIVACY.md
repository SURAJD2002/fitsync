# FitSync — AI Data Privacy & Security Specification

**Version:** 1.0.0  
**Compliance Standard:** Principle of Least Privilege & Data Minimization  

---

## 1. Data Minimization Matrix
FitSync strictly adheres to **zero-knowledge payload minimization**. Under no circumstances are authentication secrets, user contact information, or sensitive identifiers transmitted to external AI providers.

| User Attribute | Transmitted to AI Provider? | Justification / Rationale |
| :--- | :--- | :--- |
| **Password / Auth Tokens** | ❌ **NEVER** | Blocked at client-network boundary. |
| **Full Name** | ❌ **NO** | Replaced with generic context: "Athlete". |
| **Email / Phone Number** | ❌ **NEVER** | Completely stripped before Edge Function proxy. |
| **Supabase User UUID** | ❌ **NO** | Used only internally for rate-limiting, not sent to LLM. |
| **Age, Gender, Height, Weight**| ❌ **NO** | Processed *locally* by Deterministic Engine into Macro Targets. |
| **Authoritative Calorie & Macro Target** | ✅ **YES** | Target Calories, Protein, Carbs, Fats (numeric integers). |
| **Dietary Preference & Cuisine** | ✅ **YES** | e.g. "High Protein", "Mediterranean", "Vegetarian". |
| **Food Allergens & Dislikes** | ✅ **YES** | e.g. "Peanuts", "Shellfish", "Lactose". |
| **Number of Meals** | ✅ **YES** | e.g. 4 meals (Breakfast, Lunch, Snack, Dinner). |

---

## 2. PII Scrubbing Layer
Before the Supabase Edge Function formats the LLM system prompt, a sanitizer utility verifies that no email patterns, phone numbers, or token signatures exist in user-submitted text fields.

```typescript
function sanitizeInput(text: string): string {
  return text
    .replace(/[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/g, '[EMAIL_REDACTED]')
    .replace(/\b\d{10,15}\b/g, '[PHONE_REDACTED]')
    .slice(0, 200); // Enforce max string length
}
```

---

## 3. Storage & Telemetry Policy
* **Zero Logging of Prompts:** Raw user food preferences and AI completions are not persisted in server logs.
* **Telemetry Metrics:** Only anonymized counters are recorded (e.g., `ai_request_count`, `ai_latency_ms`, `ai_error_type`).
* **Cloud Storage:** The final user-approved meal plan is stored encrypted in Supabase `public.diet_plans` under strict user-isolated Row-Level Security (RLS).
