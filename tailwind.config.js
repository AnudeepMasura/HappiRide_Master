/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          50: '#f7faf4',
          100: '#edf4e5',
          200: '#d7e7c7',
          300: '#b8d39f',
          400: '#94b973',
          500: '#556b2f', // Primary Olive Green
          600: '#465826',
          700: '#37451e',
          800: '#283216',
          900: '#1a220f',
        },
        'light-olive': '#8fbc8f',
        'soft-gray': '#f5f5f5',
        'enterprise-bg': '#f8f9fa',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
