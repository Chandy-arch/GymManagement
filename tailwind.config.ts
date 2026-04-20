import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        gym: {
          red: {
            50: '#fff1f2',
            100: '#ffe4e6',
            200: '#fecdd3',
            300: '#fda4af',
            400: '#fb7185',
            500: '#f43f5e',
            600: '#e11d48',
            700: '#be123c',
            800: '#9f1239',
            900: '#881337',
            950: '#4c0519',
          },
          dark: {
            50: '#f8f8f8',
            100: '#e8e8e8',
            200: '#d1d1d1',
            300: '#a9a9a9',
            400: '#737373',
            500: '#525252',
            600: '#3a3a3a',
            700: '#2a2a2a',
            800: '#1a1a1a',
            900: '#111111',
            950: '#0a0a0a',
          },
        },
      },
      backgroundImage: {
        'gym-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1a0000 50%, #0a0a0a 100%)',
        'red-glow': 'radial-gradient(ellipse at center, rgba(225, 29, 72, 0.2) 0%, transparent 70%)',
        'card-gradient': 'linear-gradient(145deg, #1a1a1a 0%, #111111 100%)',
      },
      animation: {
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-in': 'fadeIn 0.4s ease-out',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(225, 29, 72, 0)' },
          '50%': { boxShadow: '0 0 20px 4px rgba(225, 29, 72, 0.3)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glow: {
          '0%': { textShadow: '0 0 10px rgba(225, 29, 72, 0.5)' },
          '100%': { textShadow: '0 0 20px rgba(225, 29, 72, 0.8), 0 0 40px rgba(225, 29, 72, 0.4)' },
        },
      },
      boxShadow: {
        'red-glow': '0 0 20px rgba(225, 29, 72, 0.3)',
        'red-glow-lg': '0 0 40px rgba(225, 29, 72, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.5)',
        'inner-red': 'inset 0 0 30px rgba(225, 29, 72, 0.1)',
      },
    },
  },
  plugins: [],
};

export default config;
