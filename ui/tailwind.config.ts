import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#4B4DED",
          dark: "#3B3CC4",
          light: "#5F60F6"
        },
        accent: {
          DEFAULT: "#F58634",
          muted: "#FFE9D6"
        },
        surface: "#F5F7FB"
      }
    }
  },
  plugins: []
};

export default config;
