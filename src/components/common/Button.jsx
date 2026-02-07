import React from 'react';

/**
 * Pixel-styled button component with retro gaming aesthetic
 * @param {object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.variant - Button variant: 'primary', 'secondary', 'success'
 * @param {string} props.size - Button size: 'sm', 'md', 'lg'
 * @param {function} props.onClick - Click handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.type - Button type: 'button', 'submit', 'reset'
 * @param {boolean} props.disabled - Whether button is disabled
 */
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) => {
  // Base classes for all buttons
  const baseClasses =
    'pixel-button font-pixel uppercase tracking-wide inline-flex items-center justify-center gap-2 transition-all duration-100';

  // Variant styles
  const variantClasses = {
    primary:
      'bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white border-[var(--border)]',
    secondary:
      'bg-[var(--bg-secondary)] hover:bg-[var(--text-secondary)] text-[var(--text-primary)] border-[var(--border)]',
    success:
      'bg-[var(--success)] hover:bg-green-600 text-white border-[var(--border)]',
  };

  // Size styles
  const sizeClasses = {
    sm: 'text-[10px] px-4 py-2',
    md: 'text-[12px] px-6 py-3',
    lg: 'text-[14px] px-8 py-4',
  };

  // Disabled styles
  const disabledClasses = disabled
    ? 'opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none'
    : '';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClasses} ${className}`;

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
