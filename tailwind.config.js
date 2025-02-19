/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0070f3',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f5f5f5',
          foreground: '#000000',
        },
        destructive: {
          DEFAULT: '#ff0000',
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#f0f0f0',
          foreground: '#000000',
        },
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'pulse-hover': 'pulse-hover 8s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-hover': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-2%)' },
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        'work-sans': ['var(--font-work-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
} 