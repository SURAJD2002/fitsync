import React, { useState } from 'react';
import { Droplets, RefreshCw, ChevronRight, Edit3, Bot } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const DietScreen: React.FC = () => {
  const { dietPlan, setWaterIntake, dietViewMode, setDietViewMode } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'meal_plan' | 'recipes' | 'nutrition' | 'groceries'>('overview');
  const [editingMeal, setEditingMeal] = useState<any | null>(null);

  const totalCaloriesConsumed = dietPlan.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinConsumed = dietPlan.meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalCarbsConsumed = dietPlan.meals.reduce((sum, m) => sum + m.carbsGrams, 0);
  const totalFatsConsumed = dietPlan.meals.reduce((sum, m) => sum + m.fatsGrams, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 20px 30px' }}>
      {/* Sub Navigation Bar & Page 6 / Page 7 Mode Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="sub-tabs-container" style={{ flex: 1 }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'meal_plan', label: 'Meal Plan' },
            { id: 'recipes', label: 'Recipes' },
            { id: 'nutrition', label: 'Nutrition' },
            { id: 'groceries', label: 'Groceries' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`sub-tab-item ${subTab === tab.id ? 'active' : ''}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* View Switcher button for Page 6 vs Page 7 */}
        <button
          onClick={() => setDietViewMode(dietViewMode === 'overview' ? 'detailed' : 'overview')}
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid var(--purple-primary)',
            color: 'var(--purple-light)',
            padding: '4px 10px',
            borderRadius: '99px',
            fontSize: '10px',
            fontWeight: 700,
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          {dietViewMode === 'overview' ? 'Page 7 View' : 'Page 6 View'}
        </button>
      </div>

      {/* Page 6 Hero AI Diet Plan Card */}
      {dietViewMode === 'overview' ? (
        <div
          className="glass-card"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2) 0%, rgba(18, 20, 28, 0.95) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: 700 }}>YOUR AI DIET PLAN</span>
              <span className="badge-pill badge-green">✨ AI Generated</span>
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{dietPlan.title}</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              💪 Goal: {dietPlan.goal} • Duration: {dietPlan.durationWeeks} Weeks
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Daily Calories</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-green)' }}>{dietPlan.dailyCaloriesTarget} <span style={{ fontSize: '9px' }}>kcal</span></span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Protein</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-blue)' }}>{dietPlan.proteinTarget} <span style={{ fontSize: '9px' }}>g</span></span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Carbs</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-orange)' }}>{dietPlan.carbsTarget} <span style={{ fontSize: '9px' }}>g</span></span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Fats</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-yellow)' }}>{dietPlan.fatsTarget} <span style={{ fontSize: '9px' }}>g</span></span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Page 7 Hero View with Donut Chart Representation */
        <div
          className="glass-card"
          style={{
            padding: '20px',
            background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(18, 20, 28, 0.95) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: 700 }}>🪄 AI DIET PLAN</span>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '4px 0' }}>High Protein Muscle Gain Plan</h2>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '14px' }}>
              2,350 Cal • 180g Protein • 280g Carbs • 70g Fats
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 12px', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <RefreshCw size={12} /> Recalculate Plan
              </button>
              <button style={{ background: 'var(--purple-primary)', border: 'none', borderRadius: 'var(--radius-md)', padding: '6px 12px', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>
                View Full Plan &gt;
              </button>
            </div>
          </div>

          {/* Macro Donut Chart SVG */}
          <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" stroke="var(--bg-surface)" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="38" stroke="var(--color-blue)" strokeWidth="12" fill="none" strokeDasharray="60 180" strokeDashoffset="0" />
              <circle cx="50" cy="50" r="38" stroke="var(--color-orange)" strokeWidth="12" fill="none" strokeDasharray="100 180" strokeDashoffset="-60" />
              <circle cx="50" cy="50" r="38" stroke="var(--color-yellow)" strokeWidth="12" fill="none" strokeDasharray="40 180" strokeDashoffset="-160" />
            </svg>
            <div style={{ position: 'absolute', textAlign: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>2,350</span>
              <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>Calories</span>
            </div>
          </div>
        </div>
      )}

      {/* Today's Nutrition Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Today's Nutrition</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View Details &gt;
          </button>
        </div>

        {dietViewMode === 'overview' ? (
          <div className="glass-card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
            {/* Donut total calories remaining */}
            <div style={{ position: 'relative', width: '100px', height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="100" height="100" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="var(--bg-surface)" strokeWidth="10" fill="none" />
                <circle cx="50" cy="50" r="40" stroke="var(--purple-primary)" strokeWidth="10" fill="none" strokeDasharray="180 250" strokeDashoffset="0" />
              </svg>
              <div style={{ position: 'absolute', textAlign: 'center' }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>
                  {dietPlan.dailyCaloriesTarget - totalCaloriesConsumed}
                </span>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>kcal left</span>
              </div>
            </div>

            {/* Horizontal Macro Progress Bars */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>● Protein</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalProteinConsumed} / {dietPlan.proteinTarget} g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalProteinConsumed / dietPlan.proteinTarget) * 100)}%`, height: '100%', background: 'var(--color-blue)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>● Carbs</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalCarbsConsumed} / {dietPlan.carbsTarget} g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalCarbsConsumed / dietPlan.carbsTarget) * 100)}%`, height: '100%', background: 'var(--color-orange)' }} />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                  <span style={{ color: '#fff', fontWeight: 600 }}>● Fats</span>
                  <span style={{ color: 'var(--text-muted)' }}>{totalFatsConsumed} / {dietPlan.fatsTarget} g</span>
                </div>
                <div style={{ height: '6px', background: 'var(--bg-surface)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${Math.min(100, (totalFatsConsumed / dietPlan.fatsTarget) * 100)}%`, height: '100%', background: 'var(--color-yellow)' }} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Page 7 Grid Nutrition Cards */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-green)', display: 'block' }}>{totalCaloriesConsumed}</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Consumed</span>
            </div>
            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-blue)', display: 'block' }}>{totalProteinConsumed}g</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Protein</span>
            </div>
            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-orange)', display: 'block' }}>{totalCarbsConsumed}g</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Carbs</span>
            </div>
            <div className="glass-card" style={{ padding: '12px 8px', textAlign: 'center' }}>
              <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-yellow)', display: 'block' }}>{totalFatsConsumed}g</span>
              <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Fats</span>
            </div>
          </div>
        )}
      </div>

      {/* Today's Meal Plan Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>Today's Meal Plan</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit3 size={13} /> Edit Plan
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dietPlan.meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => setEditingMeal(meal)}
              className="glass-card"
              style={{
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                cursor: 'pointer',
              }}
            >
              <div style={{ width: '54px', height: '54px', borderRadius: 'var(--radius-md)', overflow: 'hidden', flexShrink: 0 }}>
                <img src={meal.imageUrl} alt={meal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '11px', color: 'var(--purple-light)', fontWeight: 700 }}>{meal.type}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-dim)' }}>• {meal.time}</span>
                </div>
                <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff', margin: '2px 0' }}>{meal.title}</h4>
                <p style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{meal.description}</p>
                {dietViewMode === 'detailed' && (
                  <div style={{ display: 'flex', gap: '6px', marginTop: '4px', fontSize: '9px' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.15)', color: 'var(--color-blue)', padding: '2px 6px', borderRadius: '4px' }}>{meal.proteinGrams}g P</span>
                    <span style={{ background: 'rgba(249, 115, 22, 0.15)', color: 'var(--color-orange)', padding: '2px 6px', borderRadius: '4px' }}>{meal.carbsGrams}g C</span>
                    <span style={{ background: 'rgba(245, 158, 11, 0.15)', color: 'var(--color-yellow)', padding: '2px 6px', borderRadius: '4px' }}>{meal.fatsGrams}g F</span>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-green)' }}>
                  {meal.calories} <span style={{ fontSize: '9px' }}>kcal</span>
                </span>
              </div>

              <ChevronRight size={16} color="var(--text-dim)" />
            </div>
          ))}
        </div>
      </div>

      {/* Water Intake Tracker Section */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Droplets size={22} color="var(--color-blue)" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>Water Intake</h4>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {dietPlan.waterGlassesDrunk} / {dietPlan.waterTargetGlasses} Glasses
            </span>
          </div>
        </div>

        {/* Interactive Water Cup Buttons */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {Array.from({ length: dietPlan.waterTargetGlasses }).map((_, idx) => {
            const isFilled = idx < dietPlan.waterGlassesDrunk;
            return (
              <div
                key={idx}
                onClick={() => setWaterIntake(idx + 1)}
                style={{
                  width: '24px',
                  height: '32px',
                  borderRadius: '4px',
                  background: isFilled ? 'var(--color-blue)' : 'rgba(255,255,255,0.06)',
                  border: `1px solid ${isFilled ? 'var(--color-blue)' : 'var(--border-subtle)'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '12px',
                }}
              >
                💧
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Nutrition Insight Card */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(18, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}
      >
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(139, 92, 246, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Bot size={22} color="var(--purple-light)" />
        </div>
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--purple-light)', textTransform: 'uppercase' }}>AI Nutrition Insight</span>
          <p style={{ fontSize: '12px', color: '#fff', marginTop: '2px', lineHeight: 1.3 }}>
            Great job! You're on track with your protein intake. Try increasing your water intake to improve recovery.
          </p>
        </div>
      </div>

      {/* Meal Detail Modal */}
      {editingMeal && (
        <Modal
          isOpen={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          title={`Meal Details: ${editingMeal.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
              <img src={editingMeal.imageUrl} alt={editingMeal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>{editingMeal.title}</h4>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{editingMeal.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: 'var(--bg-surface)', padding: '12px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Calories</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-green)' }}>{editingMeal.calories}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Protein</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-blue)' }}>{editingMeal.proteinGrams}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Carbs</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-orange)' }}>{editingMeal.carbsGrams}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-dim)', display: 'block' }}>Fats</span>
                <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-yellow)' }}>{editingMeal.fatsGrams}g</span>
              </div>
            </div>
            <Button onClick={() => setEditingMeal(null)}>Close</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
