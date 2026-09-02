import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass' | 'danger';
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  icon,
  fullWidth = true,
  className = '',
  style = {},
  ...props
}) => {
  let baseClass = 'btn-primary';
  if (variant === 'secondary' || variant === 'glass') {
    baseClass = 'btn-secondary';
  } else if (variant === 'danger') {
    baseClass = 'btn-secondary';
  }

  return (
    <button
      className={`${baseClass} ${className}`}
      style={{
        width: fullWidth ? '100%' : 'auto',
        ...(variant === 'danger' ? { background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' } : {}),
        ...style,
      }}
      {...props}
    >
      <span>{children}</span>
      {icon && <span style={{ display: 'inline-flex', alignItems: 'center' }}>{icon}</span>}
    </button>
  );
};
