import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from "path"

// https://vite.dev/config/
export default defineConfig({
  plugins: [ TanStackRouterVite({ target: 'react', autoCodeSplitting: true }) , react(), tailwindcss() ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
