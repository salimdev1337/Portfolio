import React, { useState, useEffect } from 'react';
import Button from '../common/Button';
import { useTheme } from '../../contexts/useTheme';

/**
 * Navbar component with responsive design, mobile hamburger menu, and dark mode toggle
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation links
  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'CONTACT', href: '#contact' },
  ];

  // Close mobile menu when clicking a link
  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[var(--bg-primary)] border-b-3 border-[var(--border)] shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#"
            className="font-pixel text-[14px] md:text-[16px] text-[var(--accent)] hover:text-[var(--accent-hover)] transition-colors glitch"
          >
            {'<SM/>'}
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                className="font-pixel text-[10px] text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors hover:transform hover:-translate-y-0.5 inline-block"
              >
                {link.name}
              </a>
            ))}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-12 h-12 flex items-center justify-center border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all group"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                // Sun icon
                <svg
                  className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                // Moon icon
                <svg
                  className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-4">
            {/* Mobile Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 flex items-center justify-center border-3 border-[var(--border)] bg-[var(--bg-secondary)]"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? (
                <svg
                  className="w-4 h-4 text-[var(--text-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              ) : (
                <svg
                  className="w-4 h-4 text-[var(--text-primary)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] transition-colors group"
              aria-label="Toggle menu"
            >
              <span
                className={`w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all ${isMenuOpen ? 'opacity-0' : ''}`}
              ></span>
              <span
                className={`w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              ></span>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? 'max-h-96 opacity-100 mb-4' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="flex flex-col gap-4 py-4 border-t-3 border-[var(--border)]">
            {navLinks.map(link => (
              <a
                key={link.name}
                href={link.href}
                onClick={handleLinkClick}
                className="font-pixel text-[10px] text-[var(--text-primary)] hover:text-[var(--accent)] hover:translate-x-2 transition-all inline-block"
              >
                {'> '}
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
