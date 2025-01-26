import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#FFBF32" },
        secondary: { DEFAULT: "#3b82f6" },
        solidGray: '#463E2C',
        success: { DEFAULT: '#38A457', light: '#F4FFFB' },
        warning: { DEFAULT: '#F09218', light: '#F9E6D0' },
        danger: { DEFAULT: '#B33A3A', light: '#F3DFDF' },
        info: { DEFAULT: '#2196F3', light: '#EBF4FF' },
        error: '#FF5454',
        'primary-color': '#FFAD32',
      },
    },
    fontFamily: {
      'primary-font': ['Albert Sans', 'sans-serif'],
      'secondary-font': ['Roboto', 'sans-serif'],
    },
  },
  plugins: [],
} satisfies Config;
