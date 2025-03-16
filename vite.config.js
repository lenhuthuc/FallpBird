import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/FallpBird/",
  plugins: [react()],
  server: {
    watch: {
      ignored: ["**/node_modules/**", "**/.git/**", "**/dist/**"],
      usePolling: false,
    },
  },
});
