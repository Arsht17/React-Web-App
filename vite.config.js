import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      sass: {
        // Use the modern Sass JS API to avoid the deprecation warning
        api: "modern",
      },
    },
  },
});
