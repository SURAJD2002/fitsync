import React, { useState } from 'react';
import {
  Sparkles,
  Check,
  ShieldCheck,
  RotateCcw,
  X,
  CreditCard,
  Mail,
  Loader2,
} from 'lucide-react';
import { BusinessConfig } from '../../config/businessConfig';
import { subscriptionService } from '../../services/subscriptionService';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [restoreMessage, setRestoreMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleStartTrial = async () => {
    setIsProcessing(true);
    const res = await subscriptionService.startFreeTrial(user.id);
    setIsProcessing(false);

    if (res.success) {
      if (onSuccess) onSuccess();
      onClose();
    } else {
      setRestoreMessage(res.error || 'Failed to start trial');
    }
  };

  const handleRestore = async () => {
    setIsProcessing(true);
    const res = await subscriptionService.restorePurchases(user.id);
    setIsProcessing(false);

    if (res.restored) {
      setRestoreMessage('FitSync Premium successfully restored!');
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } else {
      setRestoreMessage('No active subscription found for this account.');
      setTimeout(() => setRestoreMessage(null), 3000);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(7, 8, 12, 0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '16px',
      }}
      className="animate-fade-in"
    >
      <div
        className="glass-card glow-card-purple"
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: '26px',
          padding: '24px 22px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          position: 'relative',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          background: 'linear-gradient(165deg, rgba(26, 21, 45, 0.95) 0%, rgba(11, 13, 20, 0.98) 100%)',
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            cursor: 'pointer',
          }}
        >
          <X size={16} />
        </button>

        {/* Header Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge-pill badge-purple" style={{ padding: '4px 12px', fontSize: '11px', fontWeight: 800 }}>
            <Sparkles size={13} /> {BusinessConfig.freeTrialDays}-DAY FREE TRIAL
          </span>
        </div>

        {/* Title & Tagline */}
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--purple-light)', textTransform: 'uppercase' }}>
            Fitness, Without Limits
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginTop: '2px' }}>
            FitSync Premium
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.4 }}>
            Unleash full generative AI hyper-coaching, precision meal planning, and metabolic telemetry.
          </p>
        </div>

        {/* Pricing Card */}
        <div
          style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1.5px solid rgba(139, 92, 246, 0.35)',
            borderRadius: '18px',
            padding: '16px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
              Monthly Subscription
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              <span style={{ fontSize: '28px', fontWeight: 900, color: '#fff', fontFamily: 'var(--font-heading)' }}>
                {BusinessConfig.currencySymbol}{BusinessConfig.premiumMonthlyPrice}
              </span>
              <span style={{ fontSize: '13px', color: 'var(--text-dim)', fontWeight: 600 }}>
                / month
              </span>
            </div>
            <span style={{ fontSize: '11px', color: 'var(--emerald-light)', fontWeight: 700, display: 'block', marginTop: '2px' }}>
              First {BusinessConfig.freeTrialDays} days free, cancel anytime
            </span>
          </div>

          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'var(--gradient-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 0 16px var(--purple-glow)',
            }}
          >
            <CreditCard size={20} />
          </div>
        </div>

        {/* Feature Matrix */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            {
              title: 'AI Hyper-Coach & Meal Planner',
              desc: 'Generative recipes, macro budgets & allergen safety powered by Gemini.',
            },
            {
              title: 'Somatotype Progressive Blueprints',
              desc: 'Hypertrophy and mass periodization customized to your body type.',
            },
            {
              title: 'Deep Metabolic & Biometric Analytics',
              desc: 'ISO physiological time-series trends and InBody composition scans.',
            },
            {
              title: 'Priority Cloud Sync & Backup',
              desc: 'Continuous multi-device state replication protected by PostgreSQL RLS.',
            },
          ].map((feat, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  border: '1px solid var(--emerald-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--emerald-light)',
                  flexShrink: 0,
                  marginTop: '2px',
                }}
              >
                <Check size={12} strokeWidth={3} />
              </div>
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', display: 'block' }}>
                  {feat.title}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                  {feat.desc}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Status / Restore Message */}
        {restoreMessage && (
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '10px',
              background: restoreMessage.includes('restored') ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
              color: restoreMessage.includes('restored') ? 'var(--emerald-light)' : 'var(--rose-light)',
              fontSize: '12px',
              fontWeight: 700,
              textAlign: 'center',
            }}
          >
            {restoreMessage}
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant="primary"
          onClick={handleStartTrial}
          disabled={isProcessing}
          style={{ width: '100%', height: '48px', fontSize: '15px', fontWeight: 800 }}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="spin" /> Processing...
            </>
          ) : (
            `Start ${BusinessConfig.freeTrialDays}-Day Free Trial`
          )}
        </Button>

        {/* Restore & Policy Links */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={handleRestore}
            disabled={isProcessing}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--purple-light)',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
            }}
          >
            <RotateCcw size={13} /> Restore Previous Purchases
          </button>

          <p style={{ fontSize: '10px', color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.4 }}>
            {BusinessConfig.legal.subscriptionTermsText}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '10px', color: 'var(--text-muted)' }}>
            <ShieldCheck size={12} color="var(--emerald-light)" />
            <span>Google Play Billing Protected</span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Mail size={11} /> {BusinessConfig.supportEmail}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
