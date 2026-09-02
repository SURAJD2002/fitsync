import React, { useState } from 'react';
import { Check, Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  leftIcon?: React.ReactNode;
  isValid?: boolean;
  isPassword?: boolean;
  countrySelector?: React.ReactNode;
  errorMessage?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  leftIcon,
  isValid = false,
  isPassword = false,
  countrySelector,
  errorMessage,
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="input-group">
      {label && <label className="input-label">{label}</label>}
      <div className={`input-field-wrapper ${isValid ? 'valid' : ''}`}>
        {leftIcon && <div className="input-icon-left">{leftIcon}</div>}
        {countrySelector && <div style={{ marginRight: '8px', borderRight: '1px solid var(--border-subtle)', paddingRight: '8px' }}>{countrySelector}</div>}
        <input className="input-field" type={inputType} {...props} />

        {isPassword && (
          <div
            className="input-icon-right"
            onClick={() => setShowPassword(!showPassword)}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        )}

        {!isPassword && isValid && (
          <div className="input-icon-right" style={{ color: 'var(--color-green)' }}>
            <Check size={18} />
          </div>
        )}
      </div>

      {errorMessage && (
        <span style={{ fontSize: '11px', color: '#ef4444', marginTop: '2px' }}>
          {errorMessage}
        </span>
      )}
    </div>
  );
};
