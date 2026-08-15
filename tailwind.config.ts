import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#0a0a0d",
          900: "#131318",
          800: "#1c1c24",
          700: "#2a2a35",
          600: "#3f3f4d",
        },
        ink: {
          100: "#f4f4f6",
          300: "#c9c9d3",
          500: "#8b8b99",
        },
        accent: {
          indigo: "#6d6af7",
          violet: "#9d6bf0",
          sky: "#5ac8e0",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "accent-gradient": "linear-gradient(135deg, #6d6af7 0%, #9d6bf0 100%)",
        "glow-radial":
          "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(109,106,247,0.25), transparent)",
      },
      boxShadow: {
        glow: "0 0 40px -10px rgba(109,106,247,0.45)",
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-soft": "pulse-soft 2.2s ease-in-out infinite",
      },
      borderRadius: {
        xl2: "1.25rem",
      },
    },
  },
  plugins: [],
};

export default config;
