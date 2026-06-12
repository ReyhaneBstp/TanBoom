import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./constants/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        }
      },
      fontFamily: {
        vazir: ["Vazirmatn", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glass: "0 24px 80px rgba(200, 162, 200, 0.2)",
        "soft-rose": "0 18px 50px rgba(180, 122, 180, 0.18)"
      },
      backgroundImage: {
        "rose-mesh":
          "radial-gradient(circle at 20% 20%, rgba(200,162,200,.28), transparent 28%), radial-gradient(circle at 80% 10%, rgba(244,214,255,.44), transparent 24%), radial-gradient(circle at 50% 90%, rgba(224,231,255,.42), transparent 32%)"
      }
    }
  },
  plugins: []
};

export default config;
