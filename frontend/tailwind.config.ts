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
        background: {
          DEFAULT: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          subtle: "var(--bg-subtle)",
        },
        brand: {
          50: "var(--brand-50)",
          100: "#D1FAE5",
          200: "#A7F3D0",
          300: "#6EE7B7",
          400: "var(--brand-400)",
          500: "var(--brand-500)",
          600: "#059669",
          700: "#047857",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "var(--text-secondary)",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "var(--text-primary)",
          950: "#020617",
        },
        border: {
          DEFAULT: "var(--border-subtle)",
          subtle: "var(--border-subtle)",
          light: "#F1F5F9",
        },
        status: {
          success: "var(--success)",
          danger: "var(--danger)",
          warning: "var(--warning)",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        subtle: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        cardHover: "0 10px 25px -3px rgba(16, 185, 129, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.03)",
        modal: "0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.05)",
      },
      borderRadius: {
        xl: "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
    },
  },
  plugins: [],
};
export default config;
