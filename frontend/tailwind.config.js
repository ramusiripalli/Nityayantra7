/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#06b6d4',
          600: '#0284c7', // Primary Cyan/Blue
          700: '#0369a1', // Primary Hover
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Amber / Deals / Highlights
          600: '#d97706',
          700: '#b45309',
        },
        surface: {
          DEFAULT: '#ffffff',
          alt: '#f8fafc',
          subtle: '#f1f5f9',
        },
        // Semantic Token Mapping using CSS variable definitions
        primary: {
          DEFAULT: 'var(--color-primary, #0284c7)',
          hover: 'var(--color-primary-hover, #0369a1)',
          light: 'var(--color-primary-light, #e0f2fe)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary, #f59e0b)',
          hover: 'var(--color-secondary-hover, #d97706)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'soft': '0 2px 10px -2px rgba(15, 23, 42, 0.06), 0 1px 3px -1px rgba(15, 23, 42, 0.04)',
        'card': '0 4px 20px -4px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'hover': '0 10px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.06)',
      },
      borderRadius: {
        'card': '1rem', // 16px
      }
    },
  },
  plugins: [],
}
