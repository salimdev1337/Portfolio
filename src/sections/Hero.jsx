import { useState, useEffect } from 'react';
import { Button } from '../components/common';

const Hero = () => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const fullText = '<SALIM MTIRI/>';

  useEffect(() => {
    // Typing animation
    let currentIndex = 0;
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTypingComplete(true);
      }
    }, 100);

    return () => clearInterval(typingInterval);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center section-padding relative overflow-hidden"
    >
      {/* Animated background effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Pixel grid background */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        ></div>

        {/* Floating pixels */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-[var(--accent)] opacity-40 animate-float"></div>
        <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-[var(--success)] opacity-30 animate-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-4 h-4 bg-[var(--accent)] opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container-custom text-center relative z-10">
        {/* Main Title with typing animation */}
        <h1 className="font-pixel text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[var(--accent)] mb-6 glitch">
          {displayedText}
          {!isTypingComplete && <span className="animate-blink">|</span>}
        </h1>

        {/* Subtitle */}
        <div className={`transition-opacity duration-500 ${isTypingComplete ? 'opacity-100' : 'opacity-0'}`}>
          <p className="font-mono text-lg sm:text-xl md:text-2xl text-[var(--text-primary)] mb-4 animate-fadeIn">
            Full-Stack Developer | Pixel-Perfect Problem Solver
          </p>

          <p className="font-mono text-sm sm:text-base text-[var(--text-secondary)] mb-8 max-w-2xl mx-auto px-4 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
            Gaming since Windows XP, coding since Pascal. Building complete applications from database to UI.
            <br className="hidden sm:block" />
            Bug hunter addict. Tests on potato laptops. Peak productivity at 2am with espresso.
          </p>

          {/* Call-to-Action Buttons */}
          <div className="flex gap-4 justify-center flex-wrap px-4 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
            <Button
              size="lg"
              onClick={() => scrollToSection('projects')}
              className="group"
            >
              <span className="group-hover:animate-pulse">⚔️</span> View Quests
            </Button>

            <Button
              variant="secondary"
              size="lg"
              onClick={() => scrollToSection('contact')}
            >
              📬 Contact Me
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => scrollToSection('about')}
            >
              📜 About
            </Button>
          </div>

          {/* Status Badge */}
          <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 bg-[var(--bg-secondary)] border-2 border-[var(--border)] pixel-corners animate-fadeIn" style={{ animationDelay: '0.6s' }}>
            <div className="w-3 h-3 bg-[var(--success)] rounded-full animate-pulse"></div>
            <span className="font-mono text-sm text-[var(--text-primary)]">
              Available for 6-month internship
            </span>
            <span className="font-pixel text-[8px] text-[#1A1A1A] bg-[var(--accent)] px-2 py-1">
              FEB-JUL 2026
            </span>
          </div>

          {/* Scroll indicator */}
          <div className="mt-8 animate-bounce">
            <div className="flex flex-col items-center gap-2">
              <span className="font-pixel text-[8px] text-[var(--text-secondary)]">SCROLL</span>
              <svg
                className="w-6 h-6 text-[var(--accent)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={3} d="M19 14l-7 7m0 0l-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
