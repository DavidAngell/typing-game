import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: 'Fira Sans, sans-serif',
      },
    },
    colors: {
      main: {
        50: '#faf7fc',
        100: '#f4eef9',
        200: '#e8dcf2',
        300: '#d7c0e7',
        400: '#be9ad8',
        500: '#a171c4',
        600: '#8b58ad',
        700: '#6e418a',
        800: '#5c3771',
        900: '#4e315e',
        950: '#2f173b',
      },
    },  
  },
  plugins: [],
} satisfies Config;
