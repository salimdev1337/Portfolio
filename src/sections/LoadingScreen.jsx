import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/common';

const loadingFacts = [
  'Fact: Salim tests on potato laptops for maximum compatibility! 🥔',
  'Fact: Peak productivity happens at 2am with espresso ☕',
  'Fact: Bug hunting addict since Pascal days 🐛',
  'Fact: Commits more often than blinking 💻',
  'Fact: Gaming since Windows XP era 🎮',
  'Fact: If it runs on a potato, it runs anywhere!',
  'Fact: Clean code is the only code shipped ✨',
];

const LoadingScreen = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentFact] = useState(() => {
    // Initialize with random fact
    return loadingFacts[Math.floor(Math.random() * loadingFacts.length)];
  });
  const [showButton, setShowButton] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const startTimeRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const MIN_LOADING_TIME = 2000; // Minimum 2 seconds

  useEffect(() => {
    // Initialize loading screen on mount only
    startTimeRef.current = Date.now();

    // Simulate loading progress
    progressIntervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressIntervalRef.current);

          // Check if minimum time has passed
          const elapsedTime = Date.now() - startTimeRef.current;
          const minTimeReached = elapsedTime >= MIN_LOADING_TIME;

          if (minTimeReached) {
            // Show button immediately
            setShowButton(true);
          } else {
            // Wait for remaining time before showing button
            const remainingTime = MIN_LOADING_TIME - elapsedTime;
            setTimeout(() => {
              setShowButton(true);
            }, remainingTime);
          }

          return 100;
        }

        // Smooth progress to 100% in ~2 seconds
        return prev + 2;
      });
    }, 40); // 40ms interval: 50 steps × 40ms = 2000ms to reach 100%

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsPressed(true);

    // Animate button press then transition
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[var(--bg-primary)] flex items-center justify-center">
      <div className="container-custom max-w-2xl px-6 text-center">
        {/* Pixel Logo/Title */}
        <div className="mb-12">
          <h1 className="font-pixel text-3xl md:text-5xl text-[var(--accent)] mb-4 glitch">
            {'<LOADING/>'}
          </h1>
          <div className="font-mono text-sm text-[var(--text-secondary)] animate-pulse">
            {currentFact}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full h-8 bg-[var(--bg-secondary)] border-3 border-[var(--border)] relative overflow-hidden pixel-corners">
            {/* Progress fill */}
            <div
              className="h-full bg-[var(--accent)] transition-all duration-200 ease-linear relative"
              style={{ width: `${progress}%` }}
            >
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
            </div>

            {/* Progress text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-pixel text-[10px] text-[var(--text-primary)] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {progress}%
              </span>
            </div>
          </div>
        </div>

        {/* PRESS START Button */}
        {showButton && (
          <div className="animate-fadeIn">
            <Button
              size="lg"
              onClick={handleStart}
              className={`
                font-pixel
                animate-pulse-slow
                ${isPressed ? 'transform translate-y-1 shadow-none' : ''}
              `}
            >
              &gt; PRESS START &lt;
            </Button>

            <p className="font-mono text-xs text-[var(--text-secondary)] mt-4 opacity-70">
              Press any key or click to continue...
            </p>
          </div>
        )}

        {/* Pixel decoration */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-[var(--accent)] animate-blink"></div>
            <div
              className="w-2 h-2 bg-[var(--accent)] animate-blink"
              style={{ animationDelay: '0.2s' }}
            ></div>
            <div
              className="w-2 h-2 bg-[var(--accent)] animate-blink"
              style={{ animationDelay: '0.4s' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
