# FitSync — AI Systems Architecture & Contract Specification

**Version:** 1.0.0  
**Status:** Canonical Reference  

---

## 1. System Architecture Diagram

```
┌────────────────────────────────────────────────────────┐
│               FitSync Client (React 19)                │
│                                                        │
│  [1. User Body Metrics] ──► [2. Deterministic Engine]  │
│                                (Mifflin-St Jeor TDEE)  │
│                                           │            │
│  [4. Sanitized Payload] ◄─────────────────┘            │
│   - Target Calories: 2,350 kcal                        │
│   - Target Macros: 180g P / 280g C / 70g F             │
│   - Diet Style: High Protein                           │
│   - Allergies: None                                    │
└──────────────────────────┬─────────────────────────────┘
                           │ (HTTPS + Bearer JWT)
                           ▼
┌────────────────────────────────────────────────────────┐
│           Supabase Edge Function: ai-meal-plan         │
│                                                        │
│  - JWT Verification (`auth.getUser()`)                 │
│  - Rate Limiter (5 requests per 10 mins per user)      │
│  - Prompt Sanitizer & Medical Guardrails               │
│  - LLM Inference (Google Gemini 1.5/2.0 Flash)         │
│  - JSON Schema Structural Enforcement                  │
│  - Mathematical Macro Tolerance Validation (±5%)       │
└──────────────────────────┬─────────────────────────────┘
                           │ (Validated JSON Contract)
                           ▼
┌────────────────────────────────────────────────────────┐
│               FitSync Client State Layer               │
│                                                        │
│  - Client Schema & Safety Verification                 │
│  - Persist to SafeStorage (`active_diet`)              │
│  - Cloud Upsert to `public.diet_plans` (RLS)           │
│  - Update DietScreen UI with Chef Meal Timeline        │
└────────────────────────────────────────────────────────┘
```

---

## 2. Deterministic Authority vs AI Personalization Boundary

### 2.1 The Inviolable Law of Nutrition in FitSync
**AI NEVER decides a user's total daily calorie deficit or macro budget.**

1. **Deterministic Authority:**
   - **BMR (Basal Metabolic Rate):** Calculated via Mifflin-St Jeor Equation:
     $$\text{BMR}_{\text{Male}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yrs)} + 5$$
     $$\text{BMR}_{\text{Female}} = 10 \times \text{weight (kg)} + 6.25 \times \text{height (cm)} - 5 \times \text{age (yrs)} - 161$$
   - **TDEE (Total Daily Energy Expenditure):** $\text{BMR} \times \text{Activity Factor}$ (1.2 to 1.75).
   - **Goal Adjustments:**
     - Build Muscle: $\text{TDEE} + 350\text{ kcal}$ (Protein: $2.0\text{g/kg}$)
     - Fat Loss: $\text{TDEE} - 450\text{ kcal}$ (Min floor: $1,200\text{ kcal/day}$)
     - Maintain: $\text{TDEE}$

2. **AI Personalization Layer:**
   - AI translates the exact quantitative macro numbers into appetizing, culinary meal combinations, cook times, and portion descriptions.
   - If AI meals sum to a macro value outside $\pm 5\%$ of the authoritative target, the client automatically normalizes the meal quantities.

---

## 3. Strict JSON Data Contract

### 3.1 Request Payload
```json
{
  "targetCalories": 2350,
  "proteinTarget": 180,
  "carbsTarget": 280,
  "fatsTarget": 70,
  "goal": "Build Muscle",
  "dietaryPreference": "High Protein",
  "allergies": ["Peanuts"],
  "mealCount": 4
}
```

### 3.2 Response Payload
```json
{
  "title": "AI Personalized High-Protein Muscle Blueprint",
  "goal": "Build Muscle",
  "durationWeeks": 8,
  "dailyCaloriesTarget": 2350,
  "proteinTarget": 180,
  "carbsTarget": 280,
  "fatsTarget": 70,
  "fiberTarget": 35,
  "waterTargetGlasses": 8,
  "waterGlassesDrunk": 0,
  "meals": [
    {
      "id": "meal_1_breakfast",
      "type": "Breakfast",
      "time": "8:00 AM",
      "title": "Power Oatmeal with Greek Yogurt & Berries",
      "description": "Rolled oats, whey isolate, Greek yogurt, chia seeds, and fresh blueberries.",
      "calories": 580,
      "proteinGrams": 45,
      "carbsGrams": 70,
      "fatsGrams": 14,
      "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
    }
  ],
  "disclaimer": "AI-generated recommendation. Consult a health professional for clinical needs."
}
```
