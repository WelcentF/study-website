import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1", // Force Vite to listen on 127.0.0.1 for Spotify OAuth
    port: 5173,
    strictPort: true, // Fail if port is already in use
  },
});
