import React, { useState } from 'react';
import { Camera, Edit2, Crown, Flame, Dumbbell, Target, Award, ChevronRight, Watch, User, Heart, Shield, LogOut, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';
import { NotificationSettingsModal } from '../common/NotificationSettingsModal';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);

  const handleSaveProfile = () => {
    updateUser({ fullName: nameInput });
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '16px 18px 40px' }} className="animate-fade-in">
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
              onClick={() => alert('Photo upload dialog...')}
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
                onClick={() => setIsEditModalOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--purple-light)', cursor: 'pointer' }}
              >
                <Edit2 size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '6px' }}>
              <span className="badge-pill badge-purple" style={{ textTransform: 'none', padding: '3px 10px' }}>
                <Crown size={12} color="#fbbf24" /> Pro Athlete
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

      {/* Account Settings List Menu */}
      <div className="glass-card" style={{ padding: '8px 18px', borderRadius: '22px', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', padding: '12px 0 6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Preferences & Account
        </h4>

        {[
          { label: 'Notification Preferences', icon: <Bell size={18} />, action: () => setIsNotificationModalOpen(true) },
          { label: 'Personal Information', icon: <User size={18} /> },
          { label: 'Fitness & Somatotype Goals', icon: <Target size={18} /> },
          { label: 'Connected Wearables & Sensors', icon: <Watch size={18} /> },
          { label: 'Health & Biometrics', icon: <Heart size={18} /> },
          { label: 'Cloud Sync & Privacy Settings', icon: <Shield size={18} /> },
        ].map((item, idx) => (
          <div
            key={idx}
            onClick={item.action}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
              borderBottom: idx < 5 ? '1px solid var(--border-subtle)' : 'none',
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

      {/* Notification Preferences Modal */}
      <NotificationSettingsModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />

      {/* Edit Name Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Athlete Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)' }}>Full Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-glass)',
                borderRadius: '14px',
                padding: '14px 16px',
                color: '#fff',
                fontSize: '15px',
                outline: 'none',
              }}
            />
            <Button onClick={handleSaveProfile}>Save Changes</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
