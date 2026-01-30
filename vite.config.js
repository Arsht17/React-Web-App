import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  css: {
    preprocessorOptions: {
      //fix for sass warning
      scss: {
        api: "modern-compiler",
      },
    },
  },
});
