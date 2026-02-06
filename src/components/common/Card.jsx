import React from 'react';

/**
 * Pixel-styled card component with retro gaming aesthetic
 * @param {object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hoverable - Whether card has hover effect
 * @param {function} props.onClick - Click handler
 */
const Card = ({
  children,
  className = '',
  hoverable = true,
  onClick,
  ...props
}) => {
  const baseClasses = 'pixel-card border-3 border-[var(--border)] bg-[var(--bg-secondary)] p-6 relative transition-all duration-100';
  const hoverClasses = hoverable ? 'hover:transform hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--border)]' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {/* Pixel corners */}
      <div className="absolute top-0 left-0 w-2 h-2 bg-[var(--border)] -translate-x-[3px] -translate-y-[3px]"></div>
      <div className="absolute top-0 right-0 w-2 h-2 bg-[var(--border)] translate-x-[3px] -translate-y-[3px]"></div>
      <div className="absolute bottom-0 left-0 w-2 h-2 bg-[var(--border)] -translate-x-[3px] translate-y-[3px]"></div>
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-[var(--border)] translate-x-[3px] translate-y-[3px]"></div>

      {children}
    </div>
  );
};

export default Card;
