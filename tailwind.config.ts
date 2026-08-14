import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./data/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3fb",
          100: "#d6e2f4",
          200: "#adc5e9",
          300: "#7fa3da",
          400: "#4f7dc6",
          500: "#2e5ea8",
          600: "#1f4a8c",
          700: "#1a3a6b",
          800: "#152e54",
          900: "#111f38",
          950: "#0a1526",
        },
        accent: {
          50: "#fdf7e9",
          100: "#faecc4",
          200: "#f4d987",
          300: "#eec24d",
          400: "#e4ab2c",
          500: "#d4a12a",
          600: "#b17f1c",
          700: "#8a5f17",
          800: "#6b4a17",
          900: "#573e17",
        },
        ink: {
          50: "#f7f7f8",
          100: "#eeeef0",
          200: "#d9d9de",
          300: "#b6b7c0",
          400: "#8c8d9a",
          500: "#6c6d7c",
          600: "#565766",
          700: "#464752",
          800: "#3c3c46",
          900: "#26262e",
          950: "#17171c",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
        ],
      },
      maxWidth: {
        prose: "70ch",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
