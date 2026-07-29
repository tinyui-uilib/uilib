import StyleDictionary from "style-dictionary";

const sd = new StyleDictionary({
  source: ["figma/tokens.json"],
  platforms: {
    css: {
      transformGroup: "css",
      prefix: "uilib",
      buildPath: "src/generated/",
      files: [
        {
          destination: "tokens.css",
          format: "css/variables",
          options: { selector: ":root" },
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "src/generated/",
      files: [
        {
          destination: "tokens.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log("✅ Tokens built from figma/tokens.json");
