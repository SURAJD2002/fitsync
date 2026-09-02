import React, { useState } from 'react';
import { Camera, Edit2, Crown, Flame, Dumbbell, Target, Award, ChevronRight, ClipboardList, Ruler, Image as ImageIcon, Bell, Watch, User, Activity, Heart, Shield, HelpCircle, Headphones, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../common/Button';
import { Modal } from '../common/Modal';

export const ProfileScreen: React.FC = () => {
  const { user, updateUser, logout } = useAuth();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [nameInput, setNameInput] = useState(user.fullName);

  const handleSaveProfile = () => {
    updateUser({ fullName: nameInput });
    setIsEditModalOpen(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 20px 40px' }}>
      {/* Profile Hero Header Card */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Avatar with Camera badge */}
          <div style={{ position: 'relative' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', overflow: 'hidden', border: '2.5px solid var(--purple-primary)' }}>
              <img src={user.avatarUrl} alt={user.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <button
              onClick={() => alert('Photo upload dialog...')}
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '22px',
                height: '22px',
                borderRadius: '50%',
                background: 'var(--purple-primary)',
                border: '1.5px solid var(--bg-card)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <Camera size={12} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff' }}>{user.fullName}</h2>
              <button
                onClick={() => setIsEditModalOpen(true)}
                style={{ background: 'none', border: 'none', color: 'var(--purple-light)', cursor: 'pointer' }}
              >
                <Edit2 size={14} />
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginTop: '4px' }}>
              <span className="badge-pill badge-purple" style={{ textTransform: 'none' }}>
                <Crown size={12} /> Premium
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                🗓 Member since {user.memberSince}
              </span>
            </div>
          </div>
        </div>

        {/* 4 Stats Summary Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px', background: 'rgba(0,0,0,0.3)', padding: '12px 6px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-orange)', fontSize: '14px', fontWeight: 800 }}>
              <Flame size={14} /> {user.streakDays}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Day Streak</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--purple-light)', fontSize: '14px', fontWeight: 800 }}>
              <Dumbbell size={14} /> {user.completedWorkoutsCount}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Workouts</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-green)', fontSize: '14px', fontWeight: 800 }}>
              <Target size={14} /> {user.goalProgressPercent}%
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Goal Progress</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: 'var(--color-yellow)', fontSize: '14px', fontWeight: 800 }}>
              <Award size={14} /> {user.achievementsCount}
            </div>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Achievements</span>
          </div>
        </div>
      </div>

      {/* You're Premium! Banner */}
      <div
        className="glass-card"
        style={{
          padding: '16px',
          background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.25) 0%, rgba(18, 20, 28, 0.95) 100%)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(245, 158, 11, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Crown size={22} color="var(--color-yellow)" />
          </div>
          <div>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#fff' }}>You're Premium!</h4>
            <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Enjoy all premium benefits and personalized plans.</p>
          </div>
        </div>

        <button style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '6px 12px', color: '#fff', fontSize: '11px', fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
          View Benefits &gt;
        </button>
      </div>

      {/* My Body Stats Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff' }}>My Body Stats</h3>
          <button style={{ background: 'none', border: 'none', color: 'var(--purple-light)', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
            View All &gt;
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>72.4 kg</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Weight</span>
            <span style={{ fontSize: '9px', color: 'var(--color-green)', fontWeight: 700 }}>↓ 2.6 kg</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>102 cm</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Chest</span>
            <span style={{ fontSize: '9px', color: 'var(--color-green)', fontWeight: 700 }}>↑ 2 cm</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>81 cm</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Waist</span>
            <span style={{ fontSize: '9px', color: 'var(--color-green)', fontWeight: 700 }}>↓ 3 cm</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>23.1</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>BMI</span>
            <span style={{ fontSize: '9px', color: 'var(--color-green)', fontWeight: 700 }}>Normal</span>
          </div>
          <div className="glass-card" style={{ padding: '10px 4px', textAlign: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#fff', display: 'block' }}>16.2%</span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'block' }}>Body Fat</span>
            <span style={{ fontSize: '9px', color: 'var(--color-green)', fontWeight: 700 }}>↓ 1.6%</span>
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '12px' }}>Quick Actions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
          {[
            { label: 'My Plans', icon: <ClipboardList size={18} color="var(--purple-light)" /> },
            { label: 'Measurements', icon: <Ruler size={18} color="var(--color-blue)" /> },
            { label: 'Progress Photos', icon: <ImageIcon size={18} color="var(--color-green)" /> },
            { label: 'Reminders', icon: <Bell size={18} color="var(--color-orange)" /> },
            { label: 'My Devices', icon: <Watch size={18} color="var(--color-yellow)" /> },
          ].map((action, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{
                padding: '12px 4px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              {action.icon}
              <span style={{ fontSize: '10px', fontWeight: 600, color: '#fff', lineHeight: 1.1 }}>{action.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Settings List Menu */}
      <div className="glass-card" style={{ padding: '8px 14px', display: 'flex', flexDirection: 'column' }}>
        <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-dim)', padding: '8px 0 4px' }}>Account</h4>

        {[
          { label: 'Personal Information', icon: <User size={18} /> },
          { label: 'Fitness Goals', icon: <Target size={18} /> },
          { label: 'Activity Level', icon: <Activity size={18} /> },
          { label: 'Health Information', icon: <Heart size={18} /> },
          { label: 'Notification Settings', icon: <Bell size={18} /> },
          { label: 'Privacy Settings', icon: <Shield size={18} /> },
        ].map((item, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: idx < 5 ? '1px solid var(--border-subtle)' : 'none',
              cursor: 'pointer',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#fff', fontSize: '14px' }}>
              <span style={{ color: 'var(--text-muted)' }}>{item.icon}</span>
              <span>{item.label}</span>
            </div>
            <ChevronRight size={16} color="var(--text-dim)" />
          </div>
        ))}
      </div>

      {/* Support & Contact Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            <HelpCircle size={18} color="var(--purple-light)" />
            <span>Help & Support</span>
          </div>
          <ChevronRight size={16} color="var(--text-dim)" />
        </div>

        <div className="glass-card" style={{ padding: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#fff', fontSize: '13px', fontWeight: 700 }}>
            <Headphones size={18} color="var(--purple-light)" />
            <span>Contact Us</span>
          </div>
          <ChevronRight size={16} color="var(--text-dim)" />
        </div>
      </div>

      <Button variant="danger" onClick={logout} icon={<LogOut size={18} />}>
        Logout
      </Button>

      {/* Edit Name Modal */}
      {isEditModalOpen && (
        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Profile">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)' }}>Full Name</label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 14px',
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
