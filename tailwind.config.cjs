/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '"Plus Jakarta Sans"',
          '"PingFang TC"',
          '"Noto Sans TC"',
          '"Microsoft JhengHei UI"',
          'system-ui',
          '-apple-system',
          'sans-serif',
        ],
        display: [
          '"Plus Jakarta Sans"',
          '"PingFang TC"',
          '"Noto Sans TC"',
          'sans-serif',
        ],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        canvas: 'rgb(var(--bg-canvas) / <alpha-value>)',
        surface: 'rgb(var(--bg-surface) / <alpha-value>)',
        subtle: 'rgb(var(--bg-subtle) / <alpha-value>)',
        elevated: 'rgb(var(--bg-elevated) / <alpha-value>)',
        line: 'rgb(var(--border-line) / <alpha-value>)',
        'line-strong': 'rgb(var(--border-strong) / <alpha-value>)',
        ink: 'rgb(var(--text-ink) / <alpha-value>)',
        sub: 'rgb(var(--text-sub) / <alpha-value>)',
        muted: 'rgb(var(--text-muted) / <alpha-value>)',
        brand: 'rgb(var(--brand) / <alpha-value>)',
      },
      animation: {
        'fade-in': 'fade-in 0.24s cubic-bezier(0.22, 1, 0.36, 1) both',
        progress: 'progress 1.1s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
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
