import { defineConfig, mergeConfig } from "vitest/config";
import base from "@auronui/vitest/config";

export default mergeConfig(base, defineConfig({
  test: {
    include: ["src/**/*.{test,spec}.ts"],
  },
}));
