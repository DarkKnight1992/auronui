import vue from "@auronui/standard/eslint/vue";

/** @type {import("eslint").Linter.Config[]} */
export default [
  {
    ignores: [
      "**/dist/**",
      "**/node_modules/**",
      "**/.turbo/**",
      "**/storybook-static/**",
      "**/tests/**",
      "**/*.test.js",
      "**/*.test.ts",
      "**/*.spec.js",
      "**/*.spec.ts"
    ],
  },
  ...vue,
  {
    // Root-level overrides
    rules: {
      // Allow unused vars in barrel index files
      "vue/no-unused-vars": "error",
      "vue/require-default-prop": "off",
    },
  },
];
