/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Bebas Neue', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        furnace: {
          bg: '#141418',
          panel: '#1E1E24',
          border: '#2A2A32',
          ember: '#FF6B2B',
          gold: '#FFB347',
          glow: '#FF8C42',
        },
      },
      animation: {
        'blink-warn': 'blink-warn 0.8s ease-in-out infinite',
        'blink-danger': 'blink-danger 0.5s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'fade-in-down': 'fade-in-down 0.8s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
        'gradient-shift': 'gradient-shift 3s ease infinite',
      },
      keyframes: {
        'blink-warn': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.3' },
        },
        'blink-danger': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px #EF4444' },
          '50%': { opacity: '0.4', boxShadow: '0 0 5px #EF4444' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 15px #FF6B2B40' },
          '50%': { boxShadow: '0 0 35px #FF6B2B80' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
    },
  },
  plugins: [],
}
