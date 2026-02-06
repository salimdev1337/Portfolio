import PropTypes from 'prop-types';

/**
 * Pixel-styled card component
 * @param {Object} props
 * @param {React.ReactNode} props.children - Card content
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.hover - Enable hover effect
 */
const Card = ({ children, className = '', hover = false, ...props }) => {
  return (
    <div
      className={`pixel-card ${
        hover
          ? 'transition-transform hover:-translate-y-1 hover:shadow-[4px_4px_0_var(--border)] cursor-pointer'
          : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
};

export default Card;
