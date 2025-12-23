import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F172A', // Slate 900 - Deep Navy
          light: '#334155',   // Slate 700
          dark: '#020617',    // Slate 950
        },
        secondary: {
          DEFAULT: '#B45309', // Amber 700 - Bronze/Gold
          light: '#D97706',   // Amber 600
          dark: '#78350F',    // Amber 900
        },
        accent: {
          DEFAULT: '#DC2626', // Red 600
          hover: '#B91C1C',   // Red 700
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        serif: ['var(--font-playfair)'],
      },
      animation: {
        marquee: 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;
