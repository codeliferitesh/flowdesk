import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Satoshi'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        surface: {
          DEFAULT: "hsl(var(--surface))",
          raised: "hsl(var(--surface-raised))",
          overlay: "hsl(var(--surface-overlay))",
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        float: "float 3s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0" }, to: { opacity: "1" } },
        "slide-up": { from: { transform: "translateY(16px)", opacity: "0" }, to: { transform: "translateY(0)", opacity: "1" } },
        "scale-in": { from: { transform: "scale(0.95)", opacity: "0" }, to: { transform: "scale(1)", opacity: "1" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer: { from: { backgroundPosition: "200% 0" }, to: { backgroundPosition: "-200% 0" } },
      },
      boxShadow: {
        glow: "0 0 20px -4px rgb(34 197 94 / 0.4)",
        "glow-lg": "0 0 40px -8px rgb(34 197 94 / 0.5)",
        glass: "0 8px 32px 0 rgba(0,0,0,0.12)",
        card: "0 2px 12px rgba(0,0,0,0.08), 0 1px 3px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
export default config;
