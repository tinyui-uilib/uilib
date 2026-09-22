import { defineConfig } from "vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

// Monorepo root — two levels up from packages/tokens
const monoRoot = resolve(import.meta.dirname, "../..");

function veIdentifier({ filePath }: { filePath: string }): string {
  const normalized = filePath
    .replace(/\\/g, "/")
    .replace(/^src\//, "tokens/src/");

  return "_" + createHash("md5").update(normalized).digest("hex").slice(0, 8);
}

export default defineConfig({
  plugins: [
    vanillaExtractPlugin({ identifiers: veIdentifier }),
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
