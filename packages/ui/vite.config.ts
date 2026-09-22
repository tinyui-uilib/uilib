import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

// Same monoRoot logic — two levels up from packages/ui
const monoRoot = resolve(import.meta.dirname, "../..");

function veIdentifier({ filePath }: { filePath: string }): string {
  const normalized = filePath.replace(/\\/g, "/").replace(/^\.\.\//, "");

  return "_" + createHash("md5").update(normalized).digest("hex").slice(0, 8);
}

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin({ identifiers: veIdentifier }),
    dts({
      include: ["src"],
      exclude: ["**/*.stories.tsx", "**/*.test.tsx"],
      rollupTypes: false,
      insertTypesEntry: true,
    }),
  ],

  resolve: {
    alias: {
      "@tinyui-uilib/tokens": resolve(
        import.meta.dirname,
        "../tokens/src/index.ts",
      ),
    },
  },

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
    minify: false,
    sourcemap: true,
  },
});
