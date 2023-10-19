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
        brown: {
          DEFAULT: "#ED714D",
          light: "#FDF1ED",
          "light-hover": "#FCEAE4",
          "light-active": "#F9D3C8",
          normal: "#ED714D",
          "normal-hover": "#D56645",
          "normal-active": "#BE5A3E",
          dark: "#B2553A",
          "dark-hover": "#8E442E",
          "dark-active": "#6B3323",
          darker: "#53281B",
        },
        white: {
          DEFAULT: "#FFFFFF",
          "normal-hover": "#D9D9D9",
          "normal-active": "#BABABA",
          dark: "#595959",
          "dark-hover": "#404040",
          "dark-active": "#1C1C1C",
        },
        primary: {
          DEFAULT: "#ED714D",
        },
        red: "#EA2E2E",
        blue: "#3D79FE",
        yellow: "#FFC83A",
      },
    },
  },
  plugins: [],
};
export default config;
