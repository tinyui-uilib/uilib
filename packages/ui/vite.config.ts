import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin(),
    dts({
      include: ["src"],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
      rollupTypes: false,
    }),
  ],

  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },

    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "@vanilla-extract/css",
        "@vanilla-extract/recipes",
        /^@radix-ui\/.*/,
      ],

      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "named",
      },
    },

    // Don't minify library output — consumers' bundlers do this.
    // Minified libraries are also harder to debug.
    minify: false,
    sourcemap: true,
  },
});
