import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import dts from "vite-plugin-dts";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { resolve } from "node:path";
import { createHash } from "node:crypto";

export default defineConfig({
  plugins: [
    react(),
    vanillaExtractPlugin({ identifiers: veIdentifier }),
    preserveDirectives(), // ← top level, not in output.plugins
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

      output: [
        {
          format: "es",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].mjs",
          chunkFileNames: "[name].mjs",
          exports: "named",
        },
        {
          format: "cjs",
          preserveModules: true,
          preserveModulesRoot: "src",
          entryFileNames: "[name].cjs",
          chunkFileNames: "[name].cjs",
          exports: "named",
        },
      ],
    },

    minify: false,
    sourcemap: true,
  },
});

function veIdentifier({
  filePath,
  debugId,
}: {
  hash: string;
  filePath: string;
  debugId?: string | undefined;
  packageName?: string | undefined;
}): string {
  const normalizedPath = filePath.replace(/\\/g, "/").replace(/^\.\.\//, "");
  const key = `${normalizedPath}:${debugId ?? ""}`;
  return "_" + createHash("md5").update(key).digest("hex").slice(0, 8);
}
