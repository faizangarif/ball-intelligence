import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#0a0a0f',
        surface: '#111118',
        surfaceLight: '#1a1a24',
        border: '#2a2a3a',
        text: '#e5e5e5',
        textMuted: '#8a8a9a',
        accent: {
          DEFAULT: '#00a651',
          light: '#00c964',
          dark: '#008a42',
          muted: 'rgba(0, 166, 81, 0.15)',
        },
        nbaBlue: '#1d428a',
        nflBlue: '#013369',
        nflRed: '#d50a0a',
        live: '#ef4444',
        gold: '#fbbf24',
        silver: '#94a3b8',
        bronze: '#cd7f32',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      animation: {
        'pulse-live': 'pulse-live 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
        'slide-up': 'slide-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        glow: 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        'pulse-live': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 166, 81, 0.2)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 166, 81, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
