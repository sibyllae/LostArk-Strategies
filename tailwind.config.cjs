/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Noto Sans TC"',
          '"PingFang TC"',
          '"Inter"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          '"Noto Sans TC"',
          '"PingFang TC"',
          '"Inter"',
          'system-ui',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
      },
      colors: {
        canvas: 'rgb(var(--bg-canvas) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        elevated: 'rgb(var(--bg-surface-elevated) / <alpha-value>)',
        hover: 'rgb(var(--bg-surface-hover) / <alpha-value>)',
        subtle: 'rgb(var(--bg-media-well) / <alpha-value>)',
        well: 'rgb(var(--bg-media-well) / <alpha-value>)',
        line: 'rgb(var(--border-subtle) / <alpha-value>)',
        'line-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        active: 'rgb(var(--border-active) / <alpha-value>)',
        crimson: 'rgb(var(--accent-section-primary) / <alpha-value>)',
        tealbar: 'rgb(var(--accent-section-secondary) / <alpha-value>)',
        ink: 'rgb(var(--text-primary) / <alpha-value>)',
        sub: 'rgb(var(--text-secondary) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        brand: 'rgb(var(--semantic-highlight) / <alpha-value>)',
        gold: 'rgb(var(--semantic-highlight) / <alpha-value>)',
        magic: 'rgb(var(--semantic-attribute) / <alpha-value>)',
        setgreen: 'rgb(var(--semantic-group) / <alpha-value>)',
        rare: 'rgb(var(--semantic-warning) / <alpha-value>)',
        roll: 'rgb(var(--semantic-range) / <alpha-value>)',
        danger: 'rgb(var(--semantic-danger) / <alpha-value>)',
      },
      transitionTimingFunction: {
        obsidian: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      transitionDuration: {
        fast: '120ms',
        normal: '180ms',
      },
      animation: {
        'fade-in': 'fade-in 120ms cubic-bezier(0.2, 0, 0, 1) both',
        progress: 'progress 1.1s ease-in-out infinite',
        'card-pulse': 'card-pulse 1.1s cubic-bezier(0.2, 0, 0, 1) 1',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        progress: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(300%)' },
        },
        'card-pulse': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(92, 124, 250, 0)' },
          '25%': { boxShadow: '0 0 0 2px rgba(92, 124, 250, 0.85)' },
          '60%': { boxShadow: '0 0 0 1px rgba(92, 124, 250, 0.45)' },
        },
      },
    },
  },
  plugins: [],
};
