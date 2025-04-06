import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  optimizeDeps: {
    include: ["react-force-graph-2d"],
  },
  build: {
    commonjsOptions: {
      include: [/react-force-graph-2d/, /node_modules/],
    },
  },
});
