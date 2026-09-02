import React, { useState, useEffect } from 'react';
import { Droplets, ChevronRight, Sparkles, ChefHat, WifiOff } from 'lucide-react';
import { useFitness } from '../../context/FitnessContext';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AIMealPlannerModal } from './AIMealPlannerModal';

export const DietScreen: React.FC = () => {
  const { dietPlan, setWaterIntake, dietViewMode, setDietViewMode } = useFitness();
  const [subTab, setSubTab] = useState<'overview' | 'meal_plan' | 'recipes' | 'nutrition'>('overview');
  const [editingMeal, setEditingMeal] = useState<any | null>(null);
  const [isAIModalOpen, setIsAIModalOpen] = useState<boolean>(false);
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const totalCaloriesConsumed = dietPlan.meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProteinConsumed = dietPlan.meals.reduce((sum, m) => sum + m.proteinGrams, 0);
  const totalCarbsConsumed = dietPlan.meals.reduce((sum, m) => sum + m.carbsGrams, 0);
  const totalFatsConsumed = dietPlan.meals.reduce((sum, m) => sum + m.fatsGrams, 0);

  const remainingKcal = Math.max(0, dietPlan.dailyCaloriesTarget - totalCaloriesConsumed);
  const proteinPercent = Math.min(100, Math.round((totalProteinConsumed / (dietPlan.proteinTarget || 1)) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 18px 30px' }} className="animate-fade-in">
      {/* Offline Status Alert Banner */}
      {!isOnline && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            borderRadius: '16px',
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: '#fca5a5',
            fontSize: '12px',
            fontWeight: 700,
          }}
        >
          <WifiOff size={16} />
          <span>Offline Mode: FitSync Authoritative Local Engine is active.</span>
        </div>
      )}

      {/* Sub Navigation Bar & View Toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
        <div className="sub-tabs-container" style={{ flex: 1 }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'meal_plan', label: 'Meal Plan' },
            { id: 'recipes', label: 'Recipes' },
            { id: 'nutrition', label: 'Macro Stats' },
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

        <button
          onClick={() => setDietViewMode(dietViewMode === 'overview' ? 'detailed' : 'overview')}
          className="badge-pill badge-purple"
          style={{ cursor: 'pointer', padding: '6px 12px', border: '1px solid var(--purple-primary)' }}
        >
          {dietViewMode === 'overview' ? 'Macro Focus' : 'Classic View'}
        </button>
      </div>

      {/* Hero AI Diet Plan Card with AI Launcher */}
      <div
        className="glass-card glow-card-emerald"
        style={{
          padding: '22px 20px',
          borderRadius: '24px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} color="var(--emerald-light)" />
            <span style={{ fontSize: '10.5px', color: 'var(--emerald-light)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              AI Nutrition Engine
            </span>
          </div>
          <span className="badge-pill badge-green">Mifflin-St Jeor Validated</span>
        </div>

        <h2 style={{ fontSize: '22px', fontWeight: 900, color: '#fff', marginBottom: '4px', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
          {dietPlan.title}
        </h2>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          Target: <strong>{dietPlan.dailyCaloriesTarget} kcal</strong> • {dietPlan.goal}
        </p>

        {/* Macro Targets Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            background: 'rgba(7, 8, 12, 0.75)',
            border: '1px solid var(--border-subtle)',
            padding: '14px 10px',
            borderRadius: '18px',
            textAlign: 'center',
            marginBottom: '14px',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Calories</span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>{dietPlan.dailyCaloriesTarget}</span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Protein</span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--cyan-light)' }}>{dietPlan.proteinTarget}g</span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Carbs</span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--coral-light)' }}>{dietPlan.carbsTarget}g</span>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Fats</span>
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#fbbf24' }}>{dietPlan.fatsTarget}g</span>
          </div>
        </div>

        <button
          onClick={() => setIsAIModalOpen(true)}
          style={{
            background: 'var(--gradient-emerald)',
            color: '#fff',
            border: 'none',
            borderRadius: '14px',
            padding: '11px 18px',
            fontWeight: 800,
            fontSize: '13px',
            fontFamily: 'var(--font-heading)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            boxShadow: '0 4px 16px rgba(16, 185, 129, 0.3)',
            transition: 'transform 0.15s ease',
          }}
        >
          <ChefHat size={16} />
          <span>Generate with AI Chef</span>
        </button>
      </div>

      {/* Today's Macro Budget & Caloric Balance */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Today's Balance</h3>
          <span style={{ color: 'var(--cyan-light)', fontSize: '12px', fontWeight: 800 }}>{remainingKcal} kcal remaining</span>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px', borderRadius: '22px' }}>
          {/* Progress Bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>🍗 Protein ({proteinPercent}%)</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalProteinConsumed} / {dietPlan.proteinTarget} g</span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${proteinPercent}%`, height: '100%', background: 'var(--gradient-cyan-purple)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>🍚 Carbohydrates</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalCarbsConsumed} / {dietPlan.carbsTarget} g</span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalCarbsConsumed / (dietPlan.carbsTarget || 1)) * 100)}%`, height: '100%', background: 'var(--gradient-fire)', borderRadius: '99px' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>🥑 Healthy Fats</span>
                <span style={{ color: 'var(--text-secondary)' }}>{totalFatsConsumed} / {dietPlan.fatsTarget} g</span>
              </div>
              <div style={{ height: '7px', background: 'rgba(255,255,255,0.06)', borderRadius: '99px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (totalFatsConsumed / (dietPlan.fatsTarget || 1)) * 100)}%`, height: '100%', background: 'var(--gradient-emerald)', borderRadius: '99px' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Meals Timeline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>Meal Schedule</h3>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px', fontWeight: 700 }}>{dietPlan.meals.length} Meals</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {dietPlan.meals.map((meal) => (
            <div
              key={meal.id}
              onClick={() => setEditingMeal(meal)}
              className="glass-card"
              style={{
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                borderRadius: '20px',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
            >
              <div
                style={{
                  width: '58px',
                  height: '58px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  flexShrink: 0,
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <img src={meal.imageUrl} alt={meal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                  <span className="badge-pill badge-purple" style={{ padding: '2px 8px', fontSize: '10px' }}>
                    {meal.type}
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>• {meal.time}</span>
                </div>
                <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>{meal.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{meal.description}</p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '4px', fontSize: '10px' }}>
                  <span style={{ color: 'var(--cyan-light)', fontWeight: 700 }}>{meal.proteinGrams}g P</span>
                  <span style={{ color: 'var(--coral-light)', fontWeight: 700 }}>{meal.carbsGrams}g C</span>
                  <span style={{ color: '#fbbf24', fontWeight: 700 }}>{meal.fatsGrams}g F</span>
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--emerald-light)', display: 'block' }}>
                  {meal.calories}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>kcal</span>
              </div>

              <ChevronRight size={16} color="var(--text-muted)" />
            </div>
          ))}
        </div>
      </div>

      {/* Water Intake Tracker */}
      <div
        className="glass-card"
        style={{
          padding: '18px 20px',
          borderRadius: '22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.2)',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cyan-light)',
              }}
            >
              <Droplets size={20} />
            </div>
            <div>
              <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Hydration Tracker</h4>
              <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)' }}>
                {dietPlan.waterGlassesDrunk} of {dietPlan.waterTargetGlasses} glasses logged
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Water Glass Cups */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
          {Array.from({ length: dietPlan.waterTargetGlasses || 8 }).map((_, idx) => {
            const isFilled = idx < dietPlan.waterGlassesDrunk;
            return (
              <button
                key={idx}
                onClick={() => setWaterIntake(idx + 1)}
                style={{
                  flex: 1,
                  height: '42px',
                  borderRadius: '12px',
                  background: isFilled ? 'var(--gradient-cyan-purple)' : 'rgba(255,255,255,0.05)',
                  border: isFilled ? '1px solid var(--cyan-light)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  fontSize: '15px',
                  boxShadow: isFilled ? '0 0 12px rgba(6, 182, 212, 0.4)' : 'none',
                  transition: 'all 0.18s var(--ease-spring)',
                }}
              >
                💧
              </button>
            );
          })}
        </div>
      </div>

      {/* Meal Detail Modal */}
      {editingMeal && (
        <Modal
          isOpen={!!editingMeal}
          onClose={() => setEditingMeal(null)}
          title={`Nutrition: ${editingMeal.title}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ height: '150px', borderRadius: '18px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <img src={editingMeal.imageUrl} alt={editingMeal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#fff' }}>{editingMeal.title}</h4>
            <p style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>{editingMeal.description}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', background: 'rgba(7, 8, 12, 0.8)', padding: '14px', borderRadius: '16px', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Calories</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--emerald-light)' }}>{editingMeal.calories}</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Protein</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--cyan-light)' }}>{editingMeal.proteinGrams}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Carbs</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: 'var(--coral-light)' }}>{editingMeal.carbsGrams}g</span>
              </div>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block', fontWeight: 700 }}>Fats</span>
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#fbbf24' }}>{editingMeal.fatsGrams}g</span>
              </div>
            </div>
            <Button onClick={() => setEditingMeal(null)}>Done</Button>
          </div>
        </Modal>
      )}

      {/* AI Meal Planner Modal */}
      <AIMealPlannerModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
      />
    </div>
  );
};
