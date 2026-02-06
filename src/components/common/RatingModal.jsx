import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from './Button';

/**
 * Rating Modal with GTA San Andreas cheat code easter egg
 * Type "BRINGITON" to activate 5-star police lights effect
 */
const RatingModal = ({ isOpen, onClose, onRate }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [cheatInput, setCheatInput] = useState('');
  const [cheatActivated, setCheatActivated] = useState(false);
  const [policeLights, setPoliceLights] = useState(false);

  const CHEAT_CODE = 'BRINGITON';

  // Check cheat code when input changes
  useEffect(() => {
    if (cheatInput.toUpperCase() === CHEAT_CODE) {
      activateCheat();
    }
  }, [cheatInput]);

  const activateCheat = () => {
    setCheatActivated(true);
    setRating(5);
    setPoliceLights(true);

    // Play police lights animation for 3 seconds
    setTimeout(() => {
      setPoliceLights(false);
    }, 3000);
  };

  const handleStarClick = (value) => {
    setRating(value);
    setCheatActivated(false);
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onRate(rating);
      onClose();
      // Reset state
      setRating(0);
      setCheatActivated(false);
      setCheatInput('');
    }
  };

  const handleClose = () => {
    onClose();
    // Reset state
    setRating(0);
    setCheatActivated(false);
    setCheatInput('');
    setPoliceLights(false);
  };

  const handleCheatInputChange = (e) => {
    setCheatInput(e.target.value);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70 animate-fadeIn">
      <div className="bg-[var(--bg-secondary)] border-4 border-[var(--border)] max-w-md w-full p-6 pixel-corners relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center border-2 border-[var(--border)] bg-[var(--bg-primary)] hover:bg-red-500 hover:text-white transition-colors"
          aria-label="Close"
        >
          <span className="font-pixel text-xs">✕</span>
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="font-pixel text-lg text-[var(--accent)] mb-2">
            {'> RATE_PORTFOLIO'}
          </h3>
          <p className="font-mono text-xs text-[var(--text-secondary)]">
            How would you rate this portfolio?
          </p>
        </div>

        {/* Star Rating */}
        <div className="flex justify-center gap-4 mb-6">
          {[1, 2, 3, 4, 5].map((star) => {
            const isActive = star <= (hoverRating || rating);
            const isPoliceLight = policeLights && star <= 5;

            return (
              <button
                key={star}
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`
                  text-5xl transition-all duration-200 transform hover:scale-110
                  ${isActive ? 'opacity-100' : 'opacity-30'}
                  ${isPoliceLight ? 'animate-pulse-slow' : ''}
                `}
                style={{
                  filter: isPoliceLight
                    ? star % 2 === 0
                      ? 'drop-shadow(0 0 8px #ff0000) drop-shadow(0 0 16px #ff0000)'
                      : 'drop-shadow(0 0 8px #0000ff) drop-shadow(0 0 16px #0000ff)'
                    : 'none',
                }}
                aria-label={`Rate ${star} stars`}
              >
                ⭐
              </button>
            );
          })}
        </div>

        {/* Cheat Code Indicator */}
        {cheatActivated && (
          <div className="mb-4 text-center animate-fadeIn">
            <div className="inline-block bg-[var(--accent)] bg-opacity-20 border-2 border-[var(--accent)] px-4 py-2">
              <p className="font-pixel text-[10px] text-black">
                🚓 CHEAT ACTIVATED! 🚓
              </p>
              <p className="font-mono text-[9px] text-black mt-1">
                GTA San Andreas style!
              </p>
            </div>
          </div>
        )}

        {/* GTA Cheat Code Input */}
        {!cheatActivated && (
          <div className="mb-4">
            <label htmlFor="cheat-code" className="font-pixel text-[10px] text-[var(--accent)] mb-2 block text-center">
              🎮 GTA SAN ANDREAS CHEAT CODE 🎮
            </label>
            <input
              id="cheat-code"
              type="text"
              value={cheatInput}
              onChange={handleCheatInputChange}
              placeholder="Type the cheat code here..."
              className="w-full px-4 py-3 bg-[var(--bg-primary)] border-3 border-[var(--border)] text-center font-mono text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[var(--accent)] transition-colors uppercase"
              autoComplete="off"
            />
            <div className="mt-2 text-center">
              <p className="font-mono text-[10px] text-[var(--text-secondary)]">
                💡 Hint: Remember the GTA cheat for 6-star wanted level?
              </p>
              <p className="font-mono text-[9px] text-[var(--text-secondary)] mt-1">
                (It starts with "BRING" and ends with "ON"...)
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            onClick={handleClose}
            variant="secondary"
            className="flex-1"
          >
            CANCEL
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="flex-1"
          >
            {rating > 0 ? `SUBMIT ${rating}★` : 'SELECT RATING'}
          </Button>
        </div>
      </div>
    </div>
  );
};

RatingModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onRate: PropTypes.func.isRequired,
};

export default RatingModal;
