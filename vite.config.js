import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // enables `describe`, `it`, etc.
    environment: "jsdom", // simulates DOM for React components
    setupFiles: "./src/setupTests.js",
  },
});
