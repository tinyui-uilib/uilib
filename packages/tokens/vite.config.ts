import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [
    vanillaExtractPlugin(),
    dts({
      include: ["src"],
      exclude: ["src/generated/**"],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: resolve(import.meta.dirname, "src/index.ts"),
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: ["@vanilla-extract/css"],
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        exports: "named",
      },
    },
  },
});
