import PropTypes from 'prop-types';

/**
 * Pixel-styled button component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Button content
 * @param {Function} props.onClick - Click handler
 * @param {string} props.variant - Button variant (primary, secondary, success)
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Disabled state
 */
const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  disabled = false,
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-[var(--accent)] hover:bg-[var(--accent-hover)]',
    secondary: 'bg-[var(--bg-secondary)] hover:bg-[var(--border)]',
    success: 'bg-[var(--success)] hover:opacity-90',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`pixel-button ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary', 'success']),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
