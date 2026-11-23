/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Noto Sans TC"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['Cinzel', '"Noto Serif TC"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        obsidian: {
          950: '#0e1013',
          900: '#14171c',
          850: '#191d24',
          800: '#1f242d',
          700: '#2a303c',
        },
        gold: {
          300: '#ebd09a',
          400: '#d8b26e',
          500: '#c4984d',
          600: '#a37b36',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.2s ease-out both',
        'slide-up': 'slide-up 0.22s ease-out both',
        progress: 'progress 1.1s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'slide-up': {
          from: { opacity: '0', transform: 'translateY(4px)' },
          to: { opacity: '1', transform: 'none' },
        },
        progress: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(300%)' },
        },
      },
    },
  },
  plugins: [],
};
