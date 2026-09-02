import React, { useState } from 'react';
import { Bell, Dumbbell, Droplets, Utensils, Footprints, Target, Sparkles, Send } from 'lucide-react';
import { Modal } from './Modal';
import { notificationService, type NotificationPreferences } from '../../services/notificationService';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({ isOpen, onClose }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(notificationService.getPreferences());
  const [testSent, setTestSent] = useState(false);

  const handleToggle = (key: keyof NotificationPreferences) => {
    const updated = notificationService.updatePreferences({
      [key]: !preferences[key],
    });
    setPreferences(updated);
  };

  const handleSendTest = async () => {
    setTestSent(true);
    await notificationService.sendTestNotification();
    setTimeout(() => setTestSent(false), 3000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="🔔 Notification Preferences">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {/* Master Toggle Banner */}
        <div
          className="glass-card glow-card-purple"
          style={{
            padding: '16px 18px',
            borderRadius: '16px',
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
                background: 'rgba(139, 92, 246, 0.25)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--purple-light)',
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff', display: 'block' }}>Master Notifications</span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Global alert enable/disable</span>
            </div>
          </div>

          <label style={{ position: 'relative', display: 'inline-block', width: '46px', height: '26px' }}>
            <input
              type="checkbox"
              checked={preferences.masterEnabled}
              onChange={() => handleToggle('masterEnabled')}
              style={{ opacity: 0, width: 0, height: 0 }}
            />
            <span
              style={{
                position: 'absolute',
                cursor: 'pointer',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: preferences.masterEnabled ? 'var(--gradient-purple)' : 'rgba(255,255,255,0.15)',
                transition: '0.3s',
                borderRadius: '34px',
                boxShadow: preferences.masterEnabled ? '0 0 12px var(--purple-glow)' : 'none',
              }}
            >
              <span
                style={{
                  position: 'absolute',
                  content: '""',
                  height: '20px',
                  width: '20px',
                  left: preferences.masterEnabled ? '23px' : '3px',
                  bottom: '3px',
                  background: '#ffffff',
                  transition: '0.3s',
                  borderRadius: '50%',
                }}
              />
            </span>
          </label>
        </div>

        {/* Categories List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', opacity: preferences.masterEnabled ? 1 : 0.45 }}>
          {[
            {
              key: 'workoutReminders' as const,
              title: 'Workout Reminders',
              sub: 'Daily training routine alerts',
              icon: <Dumbbell size={18} color="var(--purple-light)" />,
            },
            {
              key: 'hydrationReminders' as const,
              title: 'Hydration Station',
              sub: 'Water intake progress nudges',
              icon: <Droplets size={18} color="var(--cyan-light)" />,
            },
            {
              key: 'mealReminders' as const,
              title: 'Nutrition & Meals',
              sub: 'Planned diet and macro alerts',
              icon: <Utensils size={18} color="var(--coral-light)" />,
            },
            {
              key: 'activityMilestones' as const,
              title: 'Activity Milestones',
              sub: '5,000 and 10,000 step achievements',
              icon: <Footprints size={18} color="var(--emerald-light)" />,
            },
            {
              key: 'progressReminders' as const,
              title: 'Weekly Analytics',
              sub: 'Weekly progress and streak summary',
              icon: <Target size={18} color="#fbbf24" />,
            },
          ].map((item) => {
            const isChecked = preferences[item.key];
            return (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px 14px',
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '14px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '10px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff', display: 'block' }}>{item.title}</span>
                    <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>{item.sub}</span>
                  </div>
                </div>

                <label style={{ position: 'relative', display: 'inline-block', width: '38px', height: '22px' }}>
                  <input
                    type="checkbox"
                    disabled={!preferences.masterEnabled}
                    checked={isChecked}
                    onChange={() => handleToggle(item.key)}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: preferences.masterEnabled ? 'pointer' : 'not-allowed',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: isChecked && preferences.masterEnabled ? 'var(--gradient-cyan-purple)' : 'rgba(255,255,255,0.12)',
                      transition: '0.2s',
                      borderRadius: '24px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '16px',
                        width: '16px',
                        left: isChecked && preferences.masterEnabled ? '19px' : '3px',
                        bottom: '3px',
                        background: '#ffffff',
                        transition: '0.2s',
                        borderRadius: '50%',
                      }}
                    />
                  </span>
                </label>
              </div>
            );
          })}
        </div>

        {/* Immediate Test Trigger Button */}
        <div style={{ paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
          <button
            onClick={handleSendTest}
            disabled={!preferences.masterEnabled}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.07)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '12px',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: 'var(--font-heading)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: preferences.masterEnabled ? 'pointer' : 'not-allowed',
              opacity: preferences.masterEnabled ? 1 : 0.5,
              transition: 'all 0.15s ease',
            }}
          >
            {testSent ? (
              <>
                <Sparkles size={16} color="var(--emerald-light)" />
                <span>Notification Sent to Device!</span>
              </>
            ) : (
              <>
                <Send size={15} color="var(--purple-light)" />
                <span>⚡ Send Test Notification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
