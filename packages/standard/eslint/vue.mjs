import pluginVue from "eslint-plugin-vue";
import tseslint from "typescript-eslint";

export default [
  // Vue files — vue-eslint-parser as top-level, TS parser for <script>
  ...pluginVue.configs["flat/recommended"],
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
      },
    },
  },
  // TypeScript files — TS parser
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
    },
  },
  // TypeScript rules for all files
  {
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    },
  },
  // Shared Vue rules
  {
    rules: {
      "vue/component-api-style": ["warn", ["script-setup", "composition"]],
      "vue/define-macros-order": [
        "error",
        {
          order: [
            "defineOptions",
            "defineProps",
            "defineEmits",
            "defineSlots",
            "defineModel",
            "defineExpose",
          ],
        },
      ],
      "vue/define-props-declaration": ["error", "type-based"],
      "vue/define-emits-declaration": ["error", "type-based"],
      "vue/block-lang": ["error", { script: { lang: "ts" } }],
      "vue/no-unused-vars": "warn",
      "vue/padding-line-between-blocks": "error",
      "vue/prefer-import-from-vue": "error",
      "vue/no-reserved-component-names": "off",
      "vue/multi-word-component-names": "off",
    },
  },
  // Test files — relax rules that don't apply to inline test components
  {
    files: ["**/*.test.ts", "**/*.spec.ts"],
    rules: {
      "vue/component-api-style": "off",
      "vue/block-lang": "off",
    },
  },
];
