/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'mono': ['"Roboto Mono"', 'monospace'],
        'code': ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Light mode colors
        'light-bg-primary': '#F0F0F0',
        'light-bg-secondary': '#E0E0E0',
        'light-text-primary': '#1A1A1A',
        'light-text-secondary': '#4A4A4A',
        'light-accent': '#4A9EFF',
        'light-accent-hover': '#2E7FDD',
        'light-success': '#4CAF50',
        'light-border': '#2C2C2C',

        // Dark mode colors
        'dark-bg-primary': '#1A1A1A',
        'dark-bg-secondary': '#2C2C2C',
        'dark-text-primary': '#E0E0E0',
        'dark-text-secondary': '#A0A0A0',
        'dark-accent': '#00D9FF',
        'dark-accent-hover': '#00B8D4',
        'dark-success': '#00FF88',
        'dark-border': '#4A4A4A',
      },
      spacing: {
        'xs': '4px',
        'sm': '8px',
        'md': '16px',
        'lg': '24px',
        'xl': '32px',
        '2xl': '48px',
        '3xl': '64px',
      },
    },
  },
  plugins: [],
  darkMode: 'class',
}
