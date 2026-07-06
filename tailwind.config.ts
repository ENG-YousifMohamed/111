import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#0A0A0A',      // أسود فخم
          secondary: '#1A1A1A',    // رمادي غامق
          accent: '#C8A87C',       // ذهبي
          accentLight: '#E8D5B5',  // ذهبي فاتح
          white: '#FFFFFF',
          gray: '#8A8A8A',
          lightGray: '#F5F5F5',
        },
        gold: {
          50: '#FDF8F0',
          100: '#FBF0E0',
          200: '#F5E0C0',
          300: '#E8C8A0',
          400: '#D8B080',
          500: '#C8A87C',   // الذهبي الأساسي
          600: '#B8986C',
          700: '#A8885C',
          800: '#98784C',
          900: '#88683C',
        },
      },
      fontFamily: {
        arabic: ['Cairo', 'Tajawal', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-pattern': "url('/hero-bg.jpg')",
        'gold-gradient': 'linear-gradient(135deg, #C8A87C 0%, #E8D5B5 50%, #C8A87C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0A0A0A 0%, #1A1A1A 100%)',
      },
      boxShadow: {
        'gold': '0 10px 40px -5px rgba(200, 168, 124, 0.3)',
        'gold-lg': '0 20px 60px -10px rgba(200, 168, 124, 0.4)',
        'dark': '0 10px 40px -5px rgba(0, 0, 0, 0.5)',
        'premium': '0 20px 60px -15px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 0.8s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'scale-in': 'scaleIn 0.5s ease-out',
        'gold-shine': 'goldShine 3s ease-in-out infinite',
        'slow-pulse': 'slowPulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        goldShine: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        slowPulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};

export default config;