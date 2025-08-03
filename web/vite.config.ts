import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  return {
    plugins: [tailwindcss(), reactRouter(), tsconfigPaths()],
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: [
        "arch.taile7682f.ts.net",
        "localhost",
        "127.0.0.1"
      ]
    }
  };
});