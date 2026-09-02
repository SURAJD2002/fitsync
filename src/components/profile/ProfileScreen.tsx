import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Edit2,
  Crown,
  Flame,
  Dumbbell,
  Target,
  Award,
  ChevronRight,
  Watch,
  User,
  Heart,
  Shield,
  LogOut,
  Bell,
  Check,
  RefreshCw,
  Cpu,
  Sparkles,
  CreditCard,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useFitness } from '../../context/FitnessContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { NotificationSettingsModal } from '../common/NotificationSettingsModal';
import { PremiumModal } from '../subscription/PremiumModal';
import { activityTrackingService } from '../../services/activityTrackingService';
import { subscriptionService, type EntitlementState } from '../../services/subscriptionService';
import { BusinessConfig } from '../../config/businessConfig';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, logout } = useAuth();
  const { bodyComposition, weightHistory } = useFitness();

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState(user.fullName);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [entitlement, setEntitlement] = useState<EntitlementState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchEntitlement = React.useCallback(async () => {
    const res = await subscriptionService.getEntitlement(user.id);
    setEntitlement(res);
  }, [user.id]);

  useEffect(() => {
    fetchEntitlement();
  }, [fetchEntitlement]);

  const handleSaveProfile = () => {
    updateUser({ fullName: nameInput });
    setActiveModal(null);
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          updateUser({ avatarUrl: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    const success = await activityTrackingService.syncToSupabase();
    setIsSyncing(false);
    setSyncSuccess(success);
    setTimeout(() => setSyncSuccess(false), 3000);
  };

  const latestWeight = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1].weightKg : 75;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 18px 40px' }} className="animate-fade-in">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleAvatarFileChange}
        accept="image/*"
        style={{ display: 'none' }}
      />

      {/* Profile Luxury Athlete Header Card */}
      <div
        className="glass-card glow-card-purple"
        style={{
          padding: '22px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          borderRadius: '24px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar with Camera badge */}
          <div style={{ position: 'relative' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '2.5px solid var(--purple-primary)',
                boxShadow: '0 0 16px var(--purple-glow)',
              }}
            >
              <img src={user.avatarUrl} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              title="Change Profile Photo"
              style={{
                position: 'absolute',
                bottom: '-4px',
                right: '-4px',
                width: '24px',
                height: '24px',
                borderRadius: '8px',
                background: 'var(--gradient-purple)',
                border: '1.5px solid var(--bg-dark)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
              }}
            >
              <Camera size={13} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '19px', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>
                {user.fullName}
              </h2>
              <button
                onClick={() => {
                  setNameInput(user.fullName);
                  setActiveModal('personal_info');
                }}
                title="Edit Name"
                style={{ background: 'none', border: 'none', color: 'var(--purple-light)', cursor: 'pointer' }}
              >
                <Edit2 size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
              <span className="badge-pill badge-purple" style={{ textTransform: 'none', padding: '3px 10px' }}>
                <Crown size={12} color="#fbbf24" /> {entitlement?.isPremium ? 'Premium Athlete' : 'Pro Athlete'}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Since {user.memberSince || '2026'}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stats Summary Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '6px',
            background: 'rgba(7, 8, 12, 0.75)',
            border: '1px solid var(--border-subtle)',
            padding: '14px 6px',
            borderRadius: '18px',
            textAlign: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--coral-light)', fontSize: '15px', fontWeight: 900 }}>
              <Flame size={15} fill="#f97316" /> {user.streakDays || 1}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Streak</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--purple-light)', fontSize: '15px', fontWeight: 900 }}>
              <Dumbbell size={15} /> {user.completedWorkoutsCount || 12}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Workouts</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--emerald-light)', fontSize: '15px', fontWeight: 900 }}>
              <Target size={15} /> {user.goalProgressPercent || 85}%
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Goal</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#fbbf24', fontSize: '15px', fontWeight: 900 }}>
              <Award size={15} /> {user.achievementsCount || 6}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: 600 }}>Badges</span>
          </div>
        </div>
      </div>

      {/* Subscription & Monetization Status Card */}
      <div
        className="glass-card"
        style={{
          padding: '18px 20px',
          borderRadius: '22px',
          border: entitlement?.isPremium
            ? '1.5px solid rgba(139, 92, 246, 0.4)'
            : '1.5px solid rgba(249, 115, 22, 0.35)',
          background: entitlement?.isPremium
            ? 'linear-gradient(145deg, rgba(30, 24, 54, 0.7) 0%, rgba(14, 17, 27, 0.8) 100%)'
            : 'linear-gradient(145deg, rgba(45, 26, 18, 0.7) 0%, rgba(14, 17, 27, 0.8) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color={entitlement?.isPremium ? 'var(--purple-light)' : 'var(--coral-light)'} />
            <span style={{ fontSize: '15px', fontWeight: 900, color: '#fff' }}>
              {entitlement?.isPremium
                ? entitlement.isTrial
                  ? `FitSync Trial (${entitlement.trialDaysRemaining}d remaining)`
                  : `FitSync Premium (${BusinessConfig.currencySymbol}${BusinessConfig.premiumMonthlyPrice}/mo)`
                : 'FitSync Free Experience'}
            </span>
          </div>
          <span style={{ fontSize: '11.5px', color: 'var(--text-secondary)', marginTop: '4px', display: 'block', lineHeight: 1.3 }}>
            {entitlement?.isPremium
              ? 'Full AI meal planning, progressive blueprints & metabolic analytics unlocked.'
              : `Unlock full AI hyper-coach & generative meal plans for ₹${BusinessConfig.premiumMonthlyPrice}/mo.`}
          </span>
        </div>

        {entitlement?.isPremium ? (
          <Button
            variant="secondary"
            onClick={() => subscriptionService.manageSubscription()}
            style={{ padding: '8px 14px', fontSize: '12px', flexShrink: 0 }}
          >
            <ExternalLink size={13} /> Manage
          </Button>
        ) : (
          <Button
            variant="primary"
            onClick={() => setIsPremiumModalOpen(true)}
            style={{ padding: '8px 16px', fontSize: '12px', flexShrink: 0 }}
          >
            Upgrade
          </Button>
        )}
      </div>

      {/* Account Settings List Menu */}
      <div className="glass-card" style={{ padding: '8px 18px', borderRadius: '22px', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', padding: '12px 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Preferences & Account
        </h4>

        {[
          { label: 'Notification Preferences', icon: <Bell size={18} />, action: () => setActiveModal('notifications') },
          { label: 'Subscription & Billing', icon: <CreditCard size={18} />, action: () => setIsPremiumModalOpen(true) },
          { label: 'Personal Information', icon: <User size={18} />, action: () => setActiveModal('personal_info') },
          { label: 'Fitness & Somatotype Goals', icon: <Target size={18} />, action: () => setActiveModal('goals') },
          { label: 'Connected Wearables & Sensors', icon: <Watch size={18} />, action: () => setActiveModal('sensors') },
          { label: 'Health & Biometrics', icon: <Heart size={18} />, action: () => setActiveModal('biometrics') },
          { label: 'Cloud Sync & Privacy Settings', icon: <Shield size={18} />, action: () => setActiveModal('cloud_sync') },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: idx < 6 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', color: '#fff', fontSize: '14.5px', fontWeight: 600 }}>
              <span style={{ color: 'var(--purple-light)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <ChevronRight size={16} color="var(--text-dim)" />
          </div>
        ))}
      </div>

      {/* Support & Logout Button */}
      <Button variant="danger" onClick={logout} icon={<LogOut size={18} />}>
        Sign Out Account
      </Button>

      {/* FitSync Premium Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onSuccess={() => fetchEntitlement()}
      />

      {/* Notification Preferences Modal */}
      <NotificationSettingsModal
        isOpen={activeModal === 'notifications'}
        onClose={() => setActiveModal(null)}
      />

      {/* Personal Information Modal */}
      {activeModal === 'personal_info' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Athlete Profile Details">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Full Name
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Account Email
              </label>
              <input
                type="text"
                disabled
                value={user.email || 'athlete@fitsync.app'}
                style={{
                  width: '100%',
                  background: 'rgba(0,0,0,0.3)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 14px',
                  color: 'var(--text-dim)',
                  fontSize: '14px',
                }}
              />
            </div>
            <Button variant="primary" onClick={handleSaveProfile}>
              Save Profile Changes
            </Button>
          </div>
        </Modal>
      )}

      {/* Goals Modal */}
      {activeModal === 'goals' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Fitness & Somatotype Goals">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>PRIMARY OBJECTIVE</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--purple-light)', marginTop: '2px' }}>
                Hypertrophy & Mass (Build Muscle)
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SOMATOTYPE CLASSIFICATION</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--cyan-light)', marginTop: '2px' }}>
                Mesomorph / Athletic Base
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>TARGET DAILY ENERGY EXPENDITURE</span>
              <div style={{ fontSize: '15px', fontWeight: 800, color: 'var(--coral-light)', marginTop: '2px' }}>
                2,681 kcal / day (Surplus for Growth)
              </div>
            </div>
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Done
            </Button>
          </div>
        </Modal>
      )}

      {/* Connected Sensors & Wearables Modal */}
      {activeModal === 'sensors' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Hardware Sensors & Devices">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '12px 14px', borderRadius: '14px' }}>
              <Cpu size={22} color="var(--emerald-light)" />
              <div>
                <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#fff', display: 'block' }}>
                  Samsung S22 Ultra Sensor Hub
                </span>
                <span style={{ fontSize: '11px', color: 'var(--emerald-light)' }}>
                  ● Hardware Active (TYPE_STEP_COUNTER)
                </span>
              </div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px 14px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              FitSync connects directly to low-power chipset microcontrollers on your device. Footsteps and distance are tracked continuously through phone lock with zero CPU wake overhead.
            </div>

            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Close Sensor Diagnostics
            </Button>
          </div>
        </Modal>
      )}

      {/* Health & Biometrics Modal */}
      {activeModal === 'biometrics' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Health & Biometric Profile">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>CURRENT WEIGHT</span>
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#fff' }}>{latestWeight} kg</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>BODY FAT</span>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--coral-light)' }}>
                {bodyComposition.bodyFatPercent}%
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>MUSCLE MASS</span>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--emerald-light)' }}>
                {bodyComposition.muscleMassKg} kg
              </div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '12px', borderRadius: '12px' }}>
              <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>WATER RATIO</span>
              <div style={{ fontSize: '17px', fontWeight: 800, color: 'var(--cyan-light)' }}>
                {bodyComposition.waterPercent}%
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cloud Sync & Security Modal */}
      {activeModal === 'cloud_sync' && (
        <Modal isOpen={true} onClose={() => setActiveModal(null)} title="Supabase Cloud & Encryption">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '12px 14px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--purple-light)', fontSize: '13px', fontWeight: 800 }}>
                <Shield size={16} /> PostgreSQL Row-Level Security Active
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                All workouts, biometric records, and meal plans are encrypted per user UID.
              </p>
            </div>

            <Button variant="primary" onClick={handleManualSync} disabled={isSyncing}>
              {isSyncing ? (
                <>
                  <RefreshCw size={15} className="spin" /> Syncing...
                </>
              ) : syncSuccess ? (
                <>
                  <Check size={15} /> Synced Successfully!
                </>
              ) : (
                <>
                  <RefreshCw size={15} /> Sync State with Cloud
                </>
              )}
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
