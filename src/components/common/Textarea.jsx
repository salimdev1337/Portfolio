import PropTypes from 'prop-types';

/**
 * Pixel-styled textarea component
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Textarea value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.rows - Number of rows
 * @param {boolean} props.required - Required field
 * @param {string} props.error - Error message
 */
const Textarea = ({
  placeholder = '',
  value,
  onChange,
  className = '',
  rows = 4,
  required = false,
  error = '',
  ...props
}) => {
  return (
    <div className="w-full">
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        required={required}
        className={`pixel-input w-full resize-none ${error ? 'border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-xs mt-1 font-mono">{error}</p>
      )}
    </div>
  );
};

Textarea.propTypes = {
  placeholder: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  className: PropTypes.string,
  rows: PropTypes.number,
  required: PropTypes.bool,
  error: PropTypes.string,
};

export default Textarea;
