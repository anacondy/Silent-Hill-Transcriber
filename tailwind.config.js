/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sh-primary': '#8fa860',
        'sh-interim': '#cce899',
        'sh-bg-dark': '#0f110c',
        'sh-bg-sludge': '#1a1c15',
        'sh-accent': '#3e4a2e',
        'sh-metal': '#5c6e3b',
        'sh-glow': '#a3bd63',
      },
      fontFamily: {
        'silent': ['"Special Elite"', 'cursive'],
        'hud': ['"Syne Mono"', 'monospace'],
      },
      animation: {
        'scanline': 'scanline 8s linear infinite',
        'flicker': 'flicker 4s infinite',
        'flicker-fast': 'flicker-fast 1s step-end infinite',
        'grain': 'grain 8s steps(10) infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'pulse-subtle': 'pulse-subtle 2s ease-in-out infinite',
        'ping-slow': 'ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        scanline: {
          '0%': { transform: 'translateY(-100%) translateZ(0)' },
          '100%': { transform: 'translateY(100%) translateZ(0)' },
        },
        flicker: {
          '0%': { opacity: '0.95' },
          '5%': { opacity: '0.85' },
          '10%': { opacity: '0.9' },
          '15%': { opacity: '0.4' },
          '20%': { opacity: '0.95' },
          '50%': { opacity: '0.9' },
          '55%': { opacity: '0.7' },
          '60%': { opacity: '0.95' },
          '100%': { opacity: '0.95' },
        },
        'flicker-fast': {
          '0%, 50%': { opacity: '1' },
          '51%, 100%': { opacity: '0' },
        },
        grain: {
          '0%, 100%': { transform: 'translate(0, 0) translateZ(0)' },
          '10%': { transform: 'translate(-5%, -10%) translateZ(0)' },
          '20%': { transform: 'translate(-15%, 5%) translateZ(0)' },
          '30%': { transform: 'translate(7%, -25%) translateZ(0)' },
          '40%': { transform: 'translate(-5%, 25%) translateZ(0)' },
          '50%': { transform: 'translate(-15%, 10%) translateZ(0)' },
          '60%': { transform: 'translate(15%, 0%) translateZ(0)' },
          '70%': { transform: 'translate(0%, 15%) translateZ(0)' },
          '80%': { transform: 'translate(3%, 35%) translateZ(0)' },
          '90%': { transform: 'translate(-10%, 10%) translateZ(0)' },
        },
        'pulse-glow': {
          '0%, 100%': { textShadow: '0 0 10px #7c8f4b, 0 0 20px #7c8f4b' },
          '50%': { textShadow: '0 0 20px #a3bd63, 0 0 30px #a3bd63' },
        },
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'ping-slow': {
          '0%': { transform: 'scale(1)', opacity: '0.3' },
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        // Aspect ratio specific breakpoints
        'tall': { 'raw': '(min-aspect-ratio: 9/20)' },
        'wide': { 'raw': '(min-aspect-ratio: 16/9)' },
        'ultrawide': { 'raw': '(min-aspect-ratio: 21/9)' },
      },
      fontSize: {
        '2xs': '0.625rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem',
        '7xl': '4.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      minHeight: {
        'dvh': '100dvh',
      },
      height: {
        'dvh': '100dvh',
      },
    },
  },
  plugins: [],
}
