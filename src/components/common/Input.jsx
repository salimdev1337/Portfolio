import React from 'react';

/**
 * Pixel-styled input component with retro gaming aesthetic
 * @param {object} props
 * @param {string} props.type - Input type: 'text', 'email', 'password', 'number', etc.
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.label - Input label
 * @param {string} props.error - Error message
 * @param {boolean} props.required - Whether input is required
 */
const Input = ({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  className = '',
  label,
  error,
  required = false,
  ...props
}) => {
  const inputClasses = `pixel-input border-3 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-sm px-4 py-3 w-full transition-colors duration-100 focus:outline-none focus:border-[var(--accent)] ${
    error ? 'border-red-500 focus:border-red-500' : ''
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-pixel text-[10px] mb-2 text-[var(--text-primary)] uppercase">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={inputClasses}
        required={required}
        {...props}
      />
      {error && <p className="mt-2 text-red-500 text-xs font-mono">{error}</p>}
    </div>
  );
};

/**
 * Pixel-styled textarea component
 */
export const Textarea = ({
  placeholder = '',
  value,
  onChange,
  className = '',
  label,
  error,
  required = false,
  rows = 4,
  ...props
}) => {
  const textareaClasses = `pixel-input border-3 border-[var(--border)] bg-[var(--bg-primary)] text-[var(--text-primary)] font-mono text-sm px-4 py-3 w-full transition-colors duration-100 focus:outline-none focus:border-[var(--accent)] resize-vertical ${
    error ? 'border-red-500 focus:border-red-500' : ''
  } ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block font-pixel text-[10px] mb-2 text-[var(--text-primary)] uppercase">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={textareaClasses}
        required={required}
        rows={rows}
        {...props}
      />
      {error && <p className="mt-2 text-red-500 text-xs font-mono">{error}</p>}
    </div>
  );
};

export default Input;
