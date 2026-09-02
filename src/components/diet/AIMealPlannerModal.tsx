import React, { useState } from 'react';
import { Sparkles, ShieldCheck, Check, RefreshCw, AlertCircle, ChefHat } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { useFitness } from '../../context/FitnessContext';
import { useAuth } from '../../context/AuthContext';
import { AIMealService, type AIMealPlanResult } from '../../services/aiMealService';
import { DeterministicNutritionEngine, type DietaryPreference } from '../../services/deterministicNutrition';
import type { DietPlan } from '../../types';

interface AIMealPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AIMealPlannerModal: React.FC<AIMealPlannerModalProps> = ({ isOpen, onClose }) => {
  const { dietPlan, setDietPlan } = useFitness();
  const { bodyProfile } = useAuth();

  const [dietaryPreference, setDietaryPreference] = useState<DietaryPreference>('High Protein');
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([]);
  const [mealCount, setMealCount] = useState<number>(4);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [previewPlan, setPreviewPlan] = useState<DietPlan | null>(null);
  const [generationResult, setGenerationResult] = useState<AIMealPlanResult | null>(null);

  const preferences: DietaryPreference[] = [
    'High Protein',
    'Mediterranean',
    'Balanced',
    'Low Carb / Keto',
    'Vegetarian',
    'Vegan',
    'Indian Balanced',
  ];

  const commonAllergies = ['Peanuts', 'Tree Nuts', 'Dairy', 'Gluten', 'Eggs', 'Shellfish', 'Soy'];

  // Authoritative Deterministic Metrics for the active user
  const authoritativeTargets = DeterministicNutritionEngine.computeMacroTargets(
    bodyProfile.gender || 'Male',
    bodyProfile.age || 25,
    bodyProfile.height || 175,
    bodyProfile.weight || 72,
    dietPlan.goal || 'Build Muscle'
  );

  const toggleAllergy = (allergy: string) => {
    if (selectedAllergies.includes(allergy)) {
      setSelectedAllergies(selectedAllergies.filter((a) => a !== allergy));
    } else {
      setSelectedAllergies([...selectedAllergies, allergy]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep(1);

    const stepInterval = setInterval(() => {
      setGenerationStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    const result = await AIMealService.generatePersonalizedMealPlan({
      targetCalories: authoritativeTargets.targetCalories,
      proteinTarget: authoritativeTargets.proteinGrams,
      carbsTarget: authoritativeTargets.carbsGrams,
      fatsTarget: authoritativeTargets.fatsGrams,
      goal: dietPlan.goal || 'Build Muscle',
      dietaryPreference,
      allergies: selectedAllergies,
      mealCount,
      bodyProfile: {
        gender: bodyProfile.gender || 'Male',
        age: bodyProfile.age || 25,
        heightCm: bodyProfile.height || 175,
        weightKg: bodyProfile.weight || 72,
        goal: dietPlan.goal || 'Build Muscle',
        preference: dietaryPreference,
        allergies: selectedAllergies,
        mealCount,
      },
    });

    clearInterval(stepInterval);
    setIsGenerating(false);
    setGenerationStep(0);
    setPreviewPlan(result.dietPlan);
    setGenerationResult(result);
  };

  const handleApplyPlan = () => {
    if (previewPlan) {
      setDietPlan(previewPlan);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="AI Chef & Nutrition Planner">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Authoritative Biometric Target Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.22) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.4)',
            borderRadius: '18px',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--purple-light)',
              }}
            >
              <ShieldCheck size={20} />
            </div>
            <div>
              <span style={{ fontSize: '10.5px', color: 'var(--purple-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                FitSync Authoritative Baseline
              </span>
              <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>
                {authoritativeTargets.targetCalories} kcal • {authoritativeTargets.proteinGrams}g Protein
              </h4>
            </div>
          </div>
          <span className="badge-pill badge-green" style={{ fontSize: '10px' }}>
            Mifflin-St Jeor
          </span>
        </div>

        {!previewPlan ? (
          <>
            {/* Step 1: Select Dietary Preference */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Dietary Architecture
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {preferences.map((p) => {
                  const isSelected = dietaryPreference === p;
                  return (
                    <button
                      key={p}
                      onClick={() => setDietaryPreference(p)}
                      style={{
                        background: isSelected ? 'var(--gradient-purple)' : 'rgba(255, 255, 255, 0.05)',
                        border: isSelected ? '1px solid var(--purple-light)' : '1px solid var(--border-subtle)',
                        borderRadius: '12px',
                        padding: '8px 14px',
                        color: '#fff',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        boxShadow: isSelected ? 'var(--shadow-purple)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Meal Frequency */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Daily Meal Schedule
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                {[
                  { count: 3, label: '3 Meals', sub: 'Classic Split' },
                  { count: 4, label: '4 Meals', sub: 'Standard Athlete' },
                  { count: 5, label: '5 Meals', sub: 'High Frequency' },
                ].map((m) => {
                  const isSelected = mealCount === m.count;
                  return (
                    <div
                      key={m.count}
                      onClick={() => setMealCount(m.count)}
                      style={{
                        padding: '10px 8px',
                        background: isSelected ? 'rgba(139, 92, 246, 0.18)' : 'rgba(255, 255, 255, 0.04)',
                        border: isSelected ? '1.5px solid var(--purple-primary)' : '1px solid var(--border-subtle)',
                        borderRadius: '14px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>{m.label}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{m.sub}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Food Allergies / Exclusions */}
            <div>
              <label style={{ fontSize: '12.5px', fontWeight: 800, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Allergens & Strict Exclusions (Optional)
              </label>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {commonAllergies.map((allergy) => {
                  const isExcluded = selectedAllergies.includes(allergy);
                  return (
                    <button
                      key={allergy}
                      onClick={() => toggleAllergy(allergy)}
                      style={{
                        background: isExcluded ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        border: isExcluded ? '1px solid #ef4444' : '1px solid var(--border-subtle)',
                        color: isExcluded ? '#fca5a5' : 'var(--text-secondary)',
                        borderRadius: '10px',
                        padding: '6px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {isExcluded && <span>✕</span>}
                      <span>{allergy}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Progress Step Animation when generating */}
            {isGenerating && (
              <div style={{ background: 'rgba(7, 8, 12, 0.8)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple-light)', fontSize: '13px', fontWeight: 800 }}>
                  <Sparkles size={16} className="flame-animated" />
                  <span>Synthesizing Personalized Nutrition...</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px' }}>
                  <div style={{ color: generationStep >= 1 ? 'var(--emerald-light)' : 'var(--text-dim)' }}>
                    {generationStep >= 1 ? '✓' : '•'} Calculating Basal Metabolism & Lean Mass Distribution
                  </div>
                  <div style={{ color: generationStep >= 2 ? 'var(--emerald-light)' : 'var(--text-dim)' }}>
                    {generationStep >= 2 ? '✓' : '•'} Enforcing Macro Ratios & Calorie Floor Safeguards
                  </div>
                  <div style={{ color: generationStep >= 3 ? 'var(--emerald-light)' : 'var(--text-dim)' }}>
                    {generationStep >= 3 ? '✓' : '•'} Crafting Micro-Nutrient Rich Recipes & Timeline
                  </div>
                </div>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating}
              icon={<ChefHat size={18} />}
            >
              {isGenerating ? 'Synthesizing Plan...' : 'Generate AI Meal Plan'}
            </Button>
          </>
        ) : (
          /* Live Plan Preview State */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--emerald-light)', fontWeight: 800, textTransform: 'uppercase' }}>
                  {generationResult?.source === 'ai_edge_function' ? '✨ AI Synthesized Blueprint' : '⚡ FitSync Authoritative Engine'}
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{previewPlan.title}</h3>
              </div>
              <button
                onClick={() => setPreviewPlan(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '6px 10px',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RefreshCw size={12} /> Regenerate
              </button>
            </div>

            {/* Macro Summary Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '8px',
                background: 'rgba(7, 8, 12, 0.8)',
                border: '1px solid var(--border-subtle)',
                padding: '12px 8px',
                borderRadius: '16px',
                textAlign: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>Calories</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff', display: 'block' }}>{previewPlan.dailyCaloriesTarget}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>Protein</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--cyan-light)', display: 'block' }}>{previewPlan.proteinTarget}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>Carbs</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--coral-light)', display: 'block' }}>{previewPlan.carbsTarget}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 700 }}>Fats</span>
                <span style={{ fontSize: '14px', fontWeight: 900, color: '#fbbf24', display: 'block' }}>{previewPlan.fatsTarget}g</span>
              </div>
            </div>

            {/* Meals Preview List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
              {previewPlan.meals.map((meal) => (
                <div
                  key={meal.id}
                  style={{
                    background: 'rgba(22, 26, 41, 0.8)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '14px',
                    padding: '10px 12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span className="badge-pill badge-purple" style={{ padding: '1px 6px', fontSize: '9.5px' }}>{meal.type}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>• {meal.time}</span>
                    </div>
                    <h5 style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{meal.title}</h5>
                    <p style={{ fontSize: '10.5px', color: 'var(--text-secondary)' }}>{meal.description}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '13px', fontWeight: 900, color: 'var(--emerald-light)' }}>{meal.calories}</span>
                    <span style={{ fontSize: '9.5px', color: 'var(--text-muted)', display: 'block' }}>kcal</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Disclaimer & Trust Note */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10.5px', color: 'var(--text-dim)' }}>
              <AlertCircle size={13} color="var(--purple-light)" />
              <span>{generationResult?.disclaimer}</span>
            </div>

            <Button onClick={handleApplyPlan} icon={<Check size={18} />}>
              Apply This Plan to Schedule
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
