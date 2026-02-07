/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0b1120',
        surface: '#0f172a',
        card: '#111827',
        border: '#1f2937',
        muted: '#94a3b8',
        text: '#e2e8f0',
        primary: {
          DEFAULT: '#7c3aed',
          soft: 'rgba(124, 58, 237, 0.2)',
        },
        accent: '#38bdf8',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
    },
  },
  plugins: [],
}
