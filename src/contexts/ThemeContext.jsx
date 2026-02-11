import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './themeContext';

function getInitialTheme() {
  // Preference order: 1) localStorage (explicit choice), 2) OS dark mode preference
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

const ThemeProvider = ({ children }) => {
  // Lazy initializer reads from localStorage/OS once — avoids setState inside an effect
  const [theme, setTheme] = useState(getInitialTheme);

  // Keep <html> class in sync with theme state (DOM side-effect belongs in an effect)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ThemeProvider;
