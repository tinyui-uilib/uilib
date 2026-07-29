import type { StorybookConfig } from "@storybook/react-vite";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { resolve } from "node:path";

// main.ts is at apps/docs/.storybook/main.ts
// __dirname  = apps/docs/.storybook
// ../         = apps/docs
// ../../      = apps
// ../../../   = repo root
const repoRoot = resolve(__dirname, "../../..");

const config: StorybookConfig = {
  stories: ["../../../packages/ui/src/**/*.stories.@(ts|tsx)"],

  addons: [
    "@storybook/addon-essentials",
    "@storybook/addon-a11y",
    "@storybook/addon-interactions",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  async viteFinal(config) {
    config.plugins ??= [];
    config.plugins.push(vanillaExtractPlugin());

    config.resolve ??= {};
    config.resolve.alias = {
      ...(Array.isArray(config.resolve.alias)
        ? {}
        : (config.resolve.alias ?? {})),
      "@uilib/tokens": resolve(repoRoot, "packages/tokens/src/index.ts"),
      "@uilib/ui": resolve(repoRoot, "packages/ui/src/index.ts"),
    };

    return config;
  },

  docs: {
    autodocs: "tag",
  },

  typescript: {
    reactDocgen: "react-docgen-typescript",
    reactDocgenTypescriptOptions: {
      shouldExtractLiteralValuesFromEnum: true,
      propFilter: (prop) =>
        prop.parent == null ||
        !prop.parent.fileName.includes("node_modules/@types/react"),
    },
  },
};

export default config;
