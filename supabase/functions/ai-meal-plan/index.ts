// Follow Supabase Edge Functions Deno runtime standard
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RequestPayload {
  targetCalories: number;
  proteinTarget: number;
  carbsTarget: number;
  fatsTarget: number;
  goal: string;
  dietaryPreference: string;
  allergies?: string[];
  dislikedFoods?: string[];
  mealCount?: number;
}

serve(async (req: Request) => {
  // Handle CORS Preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    // Verify JWT Token & get authenticated user
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized user token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Server-Authoritative Entitlement Check (Rule 18 & 19: AI Meal Planner Gate)
    const { data: hasEntitlement, error: entitlementError } = await supabaseClient.rpc(
      'check_user_premium_entitlement',
      { target_user_id: user.id }
    );

    if (entitlementError || !hasEntitlement) {
      return new Response(
        JSON.stringify({
          error: 'PREMIUM_REQUIRED',
          message: 'FitSync Premium (₹99/mo) or active trial required to generate custom AI meal plans.',
          code: 'PAYWALL_TRIGGER',
        }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const payload: RequestPayload = await req.json();

    // Input Validation
    if (!payload.targetCalories || !payload.proteinTarget || !payload.carbsTarget || !payload.fatsTarget) {
      return new Response(JSON.stringify({ error: 'Missing authoritative target metrics' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Safety checks against dangerous extreme diets
    if (payload.targetCalories < 1000 || payload.targetCalories > 6000) {
      return new Response(JSON.stringify({ error: 'Calorie target out of safe physiological bounds (1000-6000 kcal)' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    const groqApiKey = Deno.env.get('GROQ_API_KEY');

    const mealCount = payload.mealCount && payload.mealCount >= 3 && payload.mealCount <= 5 ? payload.mealCount : 4;
    const allergiesText = payload.allergies && payload.allergies.length > 0 ? `STRICT ALLERGIES TO EXCLUDE: ${payload.allergies.join(', ')}.` : 'NO ALLERGIES.';
    const dislikesText = payload.dislikedFoods && payload.dislikedFoods.length > 0 ? `Foods to avoid: ${payload.dislikedFoods.join(', ')}.` : '';

    const systemPrompt = `You are a certified master sports nutritionist and culinary chef for elite athletes.
Generate a structured daily meal plan conforming strictly to the following parameters:
- Goal: ${payload.goal}
- Dietary Preference: ${payload.dietaryPreference}
- Total Calories: ${payload.targetCalories} kcal (The sum of all meals MUST equal approx ${payload.targetCalories} kcal ± 5%)
- Protein: ${payload.proteinTarget}g
- Carbs: ${payload.carbsTarget}g
- Fats: ${payload.fatsTarget}g
- Number of Meals: ${mealCount}
- ${allergiesText}
- ${dislikesText}

Safety Rules:
- Never provide medical prescriptions or extreme calorie deprivation.
- Do NOT include allergens listed above.
- You must return ONLY raw valid JSON matching this schema (do NOT wrap in markdown backticks):
{
  "title": "string",
  "goal": "string",
  "durationWeeks": 8,
  "dailyCaloriesTarget": number,
  "proteinTarget": number,
  "carbsTarget": number,
  "fatsTarget": number,
  "fiberTarget": number,
  "meals": [
    {
      "id": "meal_1",
      "type": "Breakfast",
      "time": "8:00 AM",
      "title": "string",
      "description": "string recipe ingredients and cooking guidance",
      "calories": number,
      "proteinGrams": number,
      "carbsGrams": number,
      "fatsGrams": number,
      "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80"
    }
  ]
}`;

    // 1. Primary Attempt: Google Gemini Flash
    if (geminiApiKey) {
      try {
        const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': geminiApiKey,
          },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseMimeType: 'application/json',
              temperature: 0.3,
            },
          }),
        });

        if (geminiRes.ok) {
          const geminiJson = await geminiRes.json();
          let rawText = geminiJson?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            // Strip any code block backticks if present
            rawText = rawText.replace(/^```json\s*/, '').replace(/```\s*$/, '').trim();
            const parsed = JSON.parse(rawText);
            return new Response(JSON.stringify(parsed), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        } else {
          console.warn('[EdgeFunction] Gemini API error:', geminiRes.status, await geminiRes.text());
        }
      } catch (err: any) {
        console.warn('[EdgeFunction] Gemini call failed, attempting fallback:', err?.message);
      }
    }

    // 2. Secondary Attempt: Groq (Llama 3.3 70B)
    if (groqApiKey) {
      try {
        const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: 'You are an AI nutrition planner that outputs valid JSON only.' },
              { role: 'user', content: systemPrompt },
            ],
            response_format: { type: 'json_object' },
            temperature: 0.3,
          }),
        });

        if (groqRes.ok) {
          const groqJson = await groqRes.json();
          const rawContent = groqJson?.choices?.[0]?.message?.content;
          if (rawContent) {
            const parsed = JSON.parse(rawContent);
            return new Response(JSON.stringify(parsed), {
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }
        }
      } catch (err: any) {
        console.warn('[EdgeFunction] Groq fallback failed:', err?.message);
      }
    }

    // Fallback if API keys not set or provider failed
    return new Response(JSON.stringify({
      error: 'AI Provider unavailable or key not configured in Edge Function. Client will use deterministic engine.',
    }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message || 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
