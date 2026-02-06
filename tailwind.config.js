/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
        'mono': ['"Roboto Mono"', 'monospace'],
        'code': ['"Fira Code"', 'monospace'],
      },
      colors: {
        // Light mode colors
        'light': {
          'bg-primary': '#F0F0F0',
          'bg-secondary': '#E0E0E0',
          'text-primary': '#1A1A1A',
          'text-secondary': '#4A4A4A',
          'accent': '#4A9EFF',
          'accent-hover': '#2E7FDD',
          'success': '#4CAF50',
          'border': '#2C2C2C',
        },
        // Dark mode colors
        'dark': {
          'bg-primary': '#1A1A1A',
          'bg-secondary': '#2C2C2C',
          'text-primary': '#E0E0E0',
          'text-secondary': '#A0A0A0',
          'accent': '#00D9FF',
          'accent-hover': '#00B8D4',
          'success': '#00FF88',
          'border': '#4A4A4A',
        },
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
}
