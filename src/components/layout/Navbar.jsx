import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../contexts/useTheme';

// Declared outside component to avoid ESLint react-hooks/static-components error
const SunIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
    />
  </svg>
);

const MoonIcon = ({ className }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
    />
  </svg>
);

/**
 * Navbar with desktop horizontal nav + mobile right-side drawer.
 * Drawer slides in from right with a semi-transparent backdrop.
 * Supports swipe-left-to-close, Escape key, and backdrop click.
 */
const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const drawerRef = useRef(null);
  const touchStartX = useRef(null);

  // Solid background when scrolled
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Body scroll lock while drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('drawer-open');
    } else {
      document.body.classList.remove('drawer-open');
    }
    return () => document.body.classList.remove('drawer-open');
  }, [isMenuOpen]);

  // Escape key closes drawer
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') setIsMenuOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'ABOUT', href: '#about' },
    { name: 'PROJECTS', href: '#projects' },
    { name: 'SKILLS', href: '#skills' },
    { name: 'CONTACT', href: '#contact' },
  ];

  const handleLinkClick = () => setIsMenuOpen(false);

  // Swipe left ≥60px on the drawer panel closes it
  const handleDrawerTouchStart = e => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleDrawerTouchEnd = e => {
    if (touchStartX.current === null) return;
    if (touchStartX.current - e.changedTouches[0].clientX > 60) setIsMenuOpen(false);
    touchStartX.current = null;
  };

  return (
    <>
      {/* ── Top bar ── */}
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

            {/* Desktop nav */}
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

              {/* Desktop dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="w-12 h-12 flex items-center justify-center border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all group"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark'
                  ? <SunIcon className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white transition-colors" />
                  : <MoonIcon className="w-5 h-5 text-[var(--text-primary)] group-hover:text-white transition-colors" />
                }
              </button>
            </div>

            {/* Mobile controls */}
            <div className="md:hidden flex items-center gap-3">
              {/* Mobile dark mode toggle */}
              <button
                onClick={toggleTheme}
                className="w-11 h-11 flex items-center justify-center border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] transition-all group"
                aria-label="Toggle dark mode"
              >
                {theme === 'dark'
                  ? <SunIcon className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
                  : <MoonIcon className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
                }
              </button>

              {/* Hamburger */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="w-11 h-11 flex flex-col items-center justify-center gap-1.5 border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] transition-colors group"
                aria-label="Open navigation menu"
                aria-expanded={isMenuOpen}
              >
                <span className="w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all"></span>
                <span className="w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all"></span>
                <span className="w-5 h-0.5 bg-[var(--text-primary)] group-hover:bg-white transition-all"></span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Backdrop (mobile only) ── */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden="true"
      />

      {/* ── Right-side drawer (mobile only) ── */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-72 z-50 md:hidden
          bg-[var(--bg-primary)] border-l-3 border-[var(--border)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
        onTouchStart={handleDrawerTouchStart}
        onTouchEnd={handleDrawerTouchEnd}
        role="dialog"
        aria-modal="true"
        aria-hidden={!isMenuOpen}
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 h-20 border-b-3 border-[var(--border)] flex-shrink-0">
          <span className="font-pixel text-[12px] text-[var(--accent)]">MENU</span>
          <button
            onClick={() => setIsMenuOpen(false)}
            className="w-11 h-11 flex items-center justify-center border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all"
            aria-label="Close navigation menu"
          >
            <span className="font-pixel text-[10px] text-[var(--text-primary)]">✕</span>
          </button>
        </div>

        {/* Nav links */}
        <nav className="flex flex-col gap-1 px-4 py-6 flex-1">
          {navLinks.map(link => (
            <a
              key={link.name}
              href={link.href}
              onClick={handleLinkClick}
              tabIndex={isMenuOpen ? 0 : -1}
              className="font-pixel text-[10px] text-[var(--text-primary)] hover:text-[var(--accent)] hover:bg-[var(--bg-secondary)] px-4 py-4 border-2 border-transparent hover:border-[var(--border)] transition-all inline-flex items-center gap-3 min-h-[44px]"
            >
              <span className="text-[var(--accent)]">{'>'}</span>
              {link.name}
            </a>
          ))}
        </nav>

        {/* Drawer footer — theme toggle */}
        <div
          className="px-6 py-6 border-t-3 border-[var(--border)] flex-shrink-0"
          style={{ paddingBottom: 'env(safe-area-inset-bottom, 24px)' }}
        >
          <button
            onClick={toggleTheme}
            className="w-full h-11 flex items-center justify-center gap-3 border-3 border-[var(--border)] bg-[var(--bg-secondary)] hover:bg-[var(--accent)] hover:border-[var(--accent)] transition-all group"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark'
              ? <SunIcon className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
              : <MoonIcon className="w-4 h-4 text-[var(--text-primary)] group-hover:text-white transition-colors" />
            }
            <span className="font-pixel text-[8px] text-[var(--text-primary)] group-hover:text-white transition-colors">
              {theme === 'dark' ? 'LIGHT MODE' : 'DARK MODE'}
            </span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
