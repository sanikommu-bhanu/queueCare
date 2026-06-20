/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sora: ['Sora', 'sans-serif'],
        jakarta: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      colors: {
        brand: {
          dark: '#0c2461',
          DEFAULT: '#1e3799',
          mid: '#0984e3',
          light: '#74b9ff',
          pale: '#e8f4fd',
        },
        teal: {
          DEFAULT: '#00897b',
          mid: '#26a69a',
          pale: '#e0f2f1',
        },
        success: {
          DEFAULT: '#00b894',
          pale: '#e8f8f5',
        },
        warning: {
          DEFAULT: '#f59e0b',
          pale: '#fef3c7',
        },
        danger: {
          DEFAULT: '#e17055',
          dark: '#d63031',
          pale: '#fff5f5',
        },
      },
      borderRadius: {
        '2xl': '20px',
        '3xl': '28px',
        '4xl': '36px',
      },
      boxShadow: {
        card: '0 4px 20px rgba(0,0,0,0.08)',
        'card-lg': '0 12px 40px rgba(0,0,0,0.12)',
        brand: '0 8px 32px rgba(9,132,227,0.30)',
        teal: '0 8px 32px rgba(0,137,123,0.25)',
        warning: '0 8px 32px rgba(245,158,11,0.35)',
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out both',
        'bounce-in': 'bounceIn 0.7s cubic-bezier(0.34,1.56,0.64,1) both',
        'sheet-up': 'sheetUp 0.35s cubic-bezier(0.32,0.72,0,1) both',
        'pulse-ring': 'pulseRing 2.2s ease-in-out infinite',
        'status-blink': 'statusBlink 1.5s ease-in-out infinite',
        'spin-slow': 'spin 0.8s linear infinite',
      },
      keyframes: {
        fadeUp: { from: { opacity:'0', transform:'translateY(16px)' }, to: { opacity:'1', transform:'translateY(0)' } },
        bounceIn: { '0%': { transform:'scale(0.3)', opacity:'0' }, '60%': { transform:'scale(1.15)' }, '100%': { transform:'scale(1)', opacity:'1' } },
        sheetUp: { from: { transform:'translateY(100%)', opacity:'0' }, to: { transform:'translateY(0)', opacity:'1' } },
        pulseRing: { '0%,100%': { boxShadow:'0 0 0 0 rgba(9,132,227,0.4)' }, '50%': { boxShadow:'0 0 0 16px rgba(9,132,227,0)' } },
        statusBlink: { '0%,100%': { opacity:'1' }, '50%': { opacity:'0.3' } },
      },
    },
  },
  plugins: [],
};
