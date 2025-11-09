import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fff1f2",
          100: "#ffd5d9",
          200: "#ffb2bc",
          300: "#ff8fa1",
          400: "#ff6b86",
          500: "#ff476c",
          600: "#ff2153",
          700: "#e50a41",
          800: "#b40031",
          900: "#7f0022"
        },
        primary: {
          DEFAULT: "#ff476c",
          dark: "#e50a41",
          light: "#ff8fa1"
        },
        accent: {
          100: "#dff9ff",
          200: "#b6edff",
          300: "#80dfff",
          400: "#42cfff",
          500: "#0dbbf3"
        },
        ink: {
          900: "#050505",
          800: "#0f0f14",
          700: "#1b1b23",
          600: "#262b3b"
        },
        surface: {
          DEFAULT: "#f4f5fb",
          light: "#f4f5fb",
          muted: "#e3e6f3",
          dark: "#10121c",
          deeper: "#0b0d15"
        }
      },
      backgroundImage: {
        "grid-glow":
          "radial-gradient(circle at 20% 20%, rgba(255,71,108,0.20), transparent 40%), radial-gradient(circle at 80% 0%, rgba(13,187,243,0.20), transparent 35%)",
        "hero-glow":
          "linear-gradient(135deg, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.65) 45%, rgba(229,10,65,0.65) 120%)"
      },
      boxShadow: {
        glow: "0 20px 60px -20px rgba(255,33,83,0.5)"
      },
      keyframes: {
        tilt: {
          "0%": { transform: "rotate(0deg) translateY(0px)" },
          "50%": { transform: "rotate(1.5deg) translateY(-6px)" },
          "100%": { transform: "rotate(0deg) translateY(0px)" }
        }
      },
      animation: {
        tilt: "tilt 8s ease-in-out infinite"
      }
    }
  },
  plugins: []
};

export default config;
