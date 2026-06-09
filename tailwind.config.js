/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        sans: ['"Noto Sans SC"', 'sans-serif'],
      },
      colors: {
        bg: {
          primary: '#0a1628',
          secondary: '#0f1d35',
          tertiary: '#152542',
        },
        accent: {
          primary: '#00d4ff',
          secondary: '#ff7a45',
        },
        status: {
          normal: '#00c48c',
          fault: '#ff4d4f',
          pending: '#faad14',
          scrapped: '#8c8c8c',
          overdue: '#ff4d4f',
        },
      },
      boxShadow: {
        'glow': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-lg': '0 0 40px rgba(0, 212, 255, 0.4)',
        'glow-red': '0 0 20px rgba(255, 77, 79, 0.4)',
        'glow-green': '0 0 20px rgba(0, 196, 140, 0.4)',
        'glow-yellow': '0 0 20px rgba(250, 173, 20, 0.4)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.3)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 20s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(0, 212, 255, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(0, 212, 255, 0.8)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
