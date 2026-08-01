/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        "primary-strong": "var(--primary-strong)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        "surface-3": "var(--surface-3)",
        ink: "var(--text)",
        "ink-muted": "var(--text-muted)",
        online: "var(--online)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      animation: {
        "msg-in": "msgIn 0.28s cubic-bezier(0.16,1,0.3,1)",
        "fade-up": "fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)",
      },
    },
  },
  plugins: [],
};
